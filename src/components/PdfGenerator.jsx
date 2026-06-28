import React from 'react';
import { Download, Printer, FileDown } from 'lucide-react';

/**
 * PdfGenerator component displaying PDF generation and Print buttons.
 * Adapts to mobile with a sticky bottom bar.
 */
export default function PdfGenerator({ onDownloadPdf, onPrint }) {
  return (
    <>
      {/* Desktop & Tablet Layout (Normal Card) */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-800">Export Options</h3>
            <p className="text-xs text-slate-400">Download a digital PDF copy or print directly</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-250/70 active:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all duration-200 border border-slate-200"
            >
              <Printer className="h-4 w-4" />
              <span>Print Quotation</span>
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-black transition-all duration-200 shadow-lg shadow-brand-100"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Layout (Fixed at bottom) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200/60 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrint}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200/50"
        >
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </button>
        <button
          type="button"
          onClick={onDownloadPdf}
          className="flex-[2] inline-flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-brand-200"
        >
          <FileDown className="h-4 w-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Spacer to prevent mobile sticky bar from overlapping content */}
      <div className="sm:hidden h-20" />
    </>
  );
}
