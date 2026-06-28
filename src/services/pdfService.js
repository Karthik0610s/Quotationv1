import html2pdf from 'html2pdf.js';

/**
 * Service to handle PDF generation using html2pdf.js.
 */
const pdfService = {
  /**
   * Generates and downloads a PDF from an HTML element.
   * @param {HTMLElement} element - The HTML element to convert to PDF
   * @param {string} filename - The name of the downloaded PDF file
   * @returns {Promise<void>} Resolves when the PDF is generated
   */
  downloadPdf: (element, filename = 'quotation.pdf') => {
    if (!element) {
      return Promise.reject(new Error('Element not found'));
    }

    // 1. Workaround for html2canvas oklch/oklab parsing bugs:
    // html2canvas reads document.styleSheets directly. If we only disable style elements,
    // they remain in document.styleSheets in some browsers. To force html2canvas to ignore them,
    // we must temporarily remove them from the DOM entirely, and restore them afterwards.
    const styleElements = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    const tempStyleElements = [];
    const removedElements = [];

    styleElements.forEach((el) => {
      try {
        let cssText = '';
        if (el.tagName === 'STYLE') {
          cssText = el.innerHTML;
        } else if (el.tagName === 'LINK' && el.sheet) {
          cssText = Array.from(el.sheet.cssRules).map(rule => rule.cssText).join('\n');
        }

        if (cssText.includes('oklch') || cssText.includes('oklab')) {
          const parentNode = el.parentNode;
          const nextSibling = el.nextSibling;
          if (parentNode) {
            parentNode.removeChild(el);
            removedElements.push({ el, parentNode, nextSibling });
          }

          const sanitizedCssText = cssText
            .replace(/oklch\([^)]+\)/g, '#000')
            .replace(/oklab\([^)]+\)/g, '#000');

          const tempStyle = document.createElement('style');
          tempStyle.className = 'temp-pdf-style';
          tempStyle.innerHTML = sanitizedCssText;
          document.head.appendChild(tempStyle);
          tempStyleElements.push(tempStyle);
        }
      } catch (err) {
        console.warn('Could not sanitize style tag:', err);
      }
    });

    // 2. Workaround for html2canvas oklch/oklab parsing bugs in computed styles:
    // Intercept computed color properties to avoid html2canvas from reading oklch/oklab styles.
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function (el, pseudoElt) {
      const style = originalGetComputedStyle.call(window, el, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const value = target[prop];
          if (typeof value === 'string' && (value.includes('oklch') || value.includes('oklab'))) {
            return 'rgb(0, 0, 0)';
          }
          if (typeof value === 'function') {
            if (prop === 'getPropertyValue') {
              return function (val) {
                const ret = target.getPropertyValue(val);
                if (typeof ret === 'string' && (ret.includes('oklch') || ret.includes('oklab'))) {
                  return 'rgb(0, 0, 0)';
                }
                return ret;
              };
            }
            return value.bind(target);
          }
          return value;
        }
      });
    };

    const opt = {
      margin: 0, // 0 margin to prevent right side from being cut off
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2.5, // High resolution
        useCORS: true,
        logging: false,
        scrollY: 0,
        scrollX: 0,
        windowWidth: 794, // Standard A4 width in pixels at 96 DPI
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      }
    };

    // Temporarily add a class for printing styling if needed
    element.classList.add('pdf-print-mode');

    const cleanUp = () => {
      element.classList.remove('pdf-print-mode');
      
      // Restore getComputedStyle
      window.getComputedStyle = originalGetComputedStyle;

      // Restore original style sheets to their exact position in the DOM
      removedElements.forEach(({ el, parentNode, nextSibling }) => {
        try {
          parentNode.insertBefore(el, nextSibling);
        } catch {
          parentNode.appendChild(el);
        }
      });
      // Remove temporary styles
      tempStyleElements.forEach(el => {
        el.remove();
      });
    };

    return html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        cleanUp();
      })
      .catch((error) => {
        cleanUp();
        console.error('PDF Generation failed:', error);
        throw error;
      });
  },

  /**
   * Triggers the print dialog for the specific element using a hidden iframe.
   * @param {HTMLElement} element - The element to print
   */
  printElement: (element) => {
    if (!element) return;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = '0';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    
    // Get all style tags and link tags from main document to preserve Tailwind styles
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(tag => tag.outerHTML)
      .join('\n');
      
    doc.write(`
      <html>
        <head>
          <title>Quotation</title>
          ${styles}
          <style>
            @page {
              size: A4;
              margin: 8mm;
            }
            body {
              margin: 0;
              padding: 0;
              background: white !important;
              color: black !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* Ensure the print fits and is styled properly */
            .pdf-print-container {
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }
          </style>
        </head>
        <body>
          <div class="pdf-print-container">
            ${element.innerHTML}
          </div>
          <script>
            // Wait for styles/images to load before printing
            window.addEventListener('load', () => {
              setTimeout(() => {
                window.focus();
                window.print();
                setTimeout(() => {
                  window.parent.document.body.removeChild(window.frameElement);
                }, 500);
              }, 500);
            });
          </script>
        </body>
      </html>
    `);
    doc.close();
  }
};

export default pdfService;
