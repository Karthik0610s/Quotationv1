import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileWarning, CheckCircle2 } from 'lucide-react';

// Components
import Header from '../components/Header';
import CustomerForm from '../components/CustomerForm';
import ProjectTable from '../components/ProjectTable';
import CostSummary from '../components/CostSummary';
import TermsConditions from '../components/TermsConditions';
import SignaturePad from '../components/SignaturePad';
import Preview from '../components/Preview';
import PdfGenerator from '../components/PdfGenerator';
import Footer from '../components/Footer';

// Services & Utils
import storageService from '../services/storageService';
import pdfService from '../services/pdfService';
import {
  calculateSubTotal,
  calculateGrandTotal,
  calculateBalance,
} from '../services/calculationService';
import { generateQuotationNumber, getNextCounter } from '../utils/quotationNumber';

const DEFAULT_TERMS = `30% Advance Payment Required
Remaining 70% After Completion
Estimated Duration 2 Days`;

export default function Home() {
  const previewRef = useRef(null);
  
  // Local states for quotation number and date (which are managed outside direct user typing)
  const [quotationCounter, setQuotationCounter] = useState(() => {
    return storageService.get('lavz_quotation_counter', 1001);
  });

  const [quotationNumber, setQuotationNumber] = useState(() => {
    return storageService.get('lavz_quotation_number', generateQuotationNumber(1001));
  });

  const [quotationDate, setQuotationDate] = useState(() => {
    return storageService.get('lavz_quotation_date', new Date().toISOString().split('T')[0]);
  });

  const [activeTab, setActiveTab] = useState('edit');

  // Load initial form data from local storage or set defaults
  const getInitialFormData = () => {
    const saved = storageService.get('lavz_quotation_form_data');
    if (saved) return saved;

    return {
      clientName: '',
      phone: '',
      address: '',
      projects: [
        {
          description: 'Living Room Main Wall',
          designDetails: 'Royal Play Texture (Matte Finish)',
          length: '12',
          width: '10',
          rate: '25',
        },
      ],
      terms: DEFAULT_TERMS,
      advanceAmount: '0',
      painterSignature: '',
      customerSignature: '',
    };
  };

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: getInitialFormData(),
    mode: 'onChange',
  });

  // Watch form values to update the live preview and auto-save
  const watchedValues = watch();
  
  // Auto-save form data to local storage on value change
  useEffect(() => {
    storageService.set('lavz_quotation_form_data', watchedValues);
  }, [watchedValues]);

  // Sync quotation metadata to local storage
  useEffect(() => {
    storageService.set('lavz_quotation_counter', quotationCounter);
    storageService.set('lavz_quotation_number', quotationNumber);
    storageService.set('lavz_quotation_date', quotationDate);
  }, [quotationCounter, quotationNumber, quotationDate]);

  // Calculate live values
  const subTotal = calculateSubTotal(watchedValues.projects || []);
  const grandTotal = calculateGrandTotal(subTotal);
  const balance = calculateBalance(grandTotal, watchedValues.advanceAmount || 0);

  // Notification / Status state for PDF generation
  const [statusMsg, setStatusMsg] = useState(null);

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  /**
   * Action: Start a new quotation
   * Increments the counter and resets the form.
   */
  const handleNewQuotation = () => {
    const nextCounter = getNextCounter(quotationCounter);
    const nextNumber = generateQuotationNumber(nextCounter);
    const today = new Date().toISOString().split('T')[0];

    setQuotationCounter(nextCounter);
    setQuotationNumber(nextNumber);
    setQuotationDate(today);

    reset({
      clientName: '',
      phone: '',
      address: '',
      projects: [
        {
          description: '',
          designDetails: '',
          length: '',
          width: '',
          rate: '',
        },
      ],
      terms: DEFAULT_TERMS,
      advanceAmount: '0',
      painterSignature: '',
      customerSignature: '',
    });

    showStatus('success', `Created New Quotation: ${nextNumber}`);
  };

  /**
   * Action: Clear Form
   * Resets all fields to completely empty.
   */
  const handleClearForm = () => {
    reset({
      clientName: '',
      phone: '',
      address: '',
      projects: [],
      terms: DEFAULT_TERMS,
      advanceAmount: '0',
      painterSignature: '',
      customerSignature: '',
    });
    showStatus('success', 'Form cleared successfully');
  };

  /**
   * Core validation helper before generating PDF or Printing.
   */
  const validateFormBeforeExport = async () => {
    const isValid = await trigger();
    if (!isValid) {
      showStatus('error', 'Please correct the validation errors in the form.');
      return false;
    }

    if (!watchedValues.projects || watchedValues.projects.length === 0) {
      showStatus('error', 'At least one project row is required.');
      return false;
    }

    return true;
  };

  /**
   * Action: Download PDF
   */
  const handleDownloadPdf = async () => {
    const isValid = await validateFormBeforeExport();
    if (!isValid) return;

    showStatus('info', 'Generating PDF...');
    try {
      const fileName = `Quotation_${quotationNumber}_${watchedValues.clientName.replace(/\s+/g, '_')}.pdf`;
      await pdfService.downloadPdf(previewRef.current, fileName);
      showStatus('success', 'PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      showStatus('error', 'Failed to generate PDF. Please try again.');
    }
  };

  /**
   * Action: Print
   */
  const handlePrint = async () => {
    const isValid = await validateFormBeforeExport();
    if (!isValid) return;

    try {
      pdfService.printElement(previewRef.current);
    } catch (error) {
      console.error('Print Error:', error);
      showStatus('error', 'Failed to open print dialog.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Header */}
      <Header onNewQuotation={handleNewQuotation} onClearForm={handleClearForm} />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Toast / Status Notification */}
        {statusMsg && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : statusMsg.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {statusMsg.type === 'error' ? (
              <FileWarning className="h-5 w-5 text-rose-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            )}
            <span className="text-xs font-bold">{statusMsg.text}</span>
          </div>
        )}

        {/* Mobile/Tablet Tab Switcher */}
        <div className="lg:hidden flex p-1 bg-slate-100 border border-slate-200/30 rounded-xl mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
              activeTab === 'edit'
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200/20'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Edit Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
              activeTab === 'preview'
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200/20'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Quotation Form (Takes 7 cols on large screens) */}
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className={`lg:col-span-7 space-y-6 sm:space-y-8 ${activeTab === 'edit' ? 'block' : 'hidden lg:block'}`}
          >
            {/* Customer Details Card */}
            <CustomerForm
              register={register}
              errors={errors}
              quotationNumber={quotationNumber}
              quotationDate={quotationDate}
            />

            {/* Project Details Card */}
            <ProjectTable
              register={register}
              control={control}
              watch={watch}
              errors={errors}
            />

            {/* Cost Summary Card */}
            <CostSummary
              register={register}
              errors={errors}
              subTotal={subTotal}
              grandTotal={grandTotal}
              balance={balance}
            />

            {/* Terms and Conditions Card */}
            <TermsConditions register={register} />

            {/* Signature Pads Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-800">Signatures</h2>
                <p className="text-xs text-slate-400 mt-0.5">Draw painter and customer signatures to finalize proposal</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SignaturePad
                  label="Authorized Painter Signature"
                  value={watchedValues.painterSignature}
                  onChange={(val) => setValue('painterSignature', val)}
                />
                <SignaturePad
                  label="Customer Signature (Acceptance)"
                  value={watchedValues.customerSignature}
                  onChange={(val) => setValue('customerSignature', val)}
                />
              </div>
            </div>

            {/* Export Actions (Desktop) */}
            <PdfGenerator
              onDownloadPdf={handleDownloadPdf}
              onPrint={handlePrint}
            />
          </form>

          {/* Right Column - Live Preview (Takes 5 cols on large screens) */}
          <div className={`lg:col-span-5 space-y-4 ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-100 border border-slate-200/40 px-4 py-2.5 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
              <span className="text-[10px] text-brand-600 bg-brand-50 font-bold px-2.5 py-0.5 rounded-full border border-brand-100/30 animate-pulse">
                Auto-syncing
              </span>
            </div>

            <Preview
              ref={previewRef}
              data={{
                ...watchedValues,
                quotationNumber,
                quotationDate,
              }}
              subTotal={subTotal}
              grandTotal={grandTotal}
              balance={balance}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
