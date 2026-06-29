import React, { forwardRef } from 'react';
import { Paintbrush, Phone, MapPin, User, FileText } from 'lucide-react';
import { calculateArea, calculateCost } from '../services/calculationService';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatter';

/**
 * Live A4 Quotation Preview component.
 * Uses forwardRef so that html2pdf.js can capture the DOM node.
 */
const Preview = forwardRef(({ data, subTotal, grandTotal, balance }, ref) => {
  const {
    clientName = '',
    phone = '',
    address = '',
    quotationNumber = '',
    quotationDate = '',
    projects = [],
    terms = '',
    advanceAmount = 0,
    painterSignature = '',
    customerSignature = '',
  } = data;

  // Split terms by newline to display as bullet points
  const termsList = terms
    ? terms.split('\n').filter((line) => line.trim() !== '')
    : [];

  return (
    <div className="w-full overflow-x-auto lg:overflow-x-visible pb-6 flex justify-start lg:justify-center lg:sticky lg:top-6">
      {/* Container simulating A4 sheet (794px width by 1123px height at 96 DPI) */}
      <div
        ref={ref}
        id="quotation-preview-a4"
        className="w-[794px] min-w-[794px] lg:w-full lg:min-w-0 lg:max-w-[794px] min-h-[1123px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-8 sm:p-10 flex flex-col justify-between text-slate-800 font-sans text-xs relative overflow-hidden print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700" />

        {/* Content Wrap */}
        <div className="space-y-6 flex-grow">
          {/* Letterhead Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="bg-brand-600 text-white p-1.5 rounded-lg shadow-sm">
                  <Paintbrush size={16} stroke="#ffffff" className="text-white" />
                </div>
                <h1 className="text-lg font-black text-brand-700 tracking-tight uppercase">
                  LavZ Artistry
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                PREMIUM WALL PAINTING & DESIGN TEXTURES
              </p>
              <div className="mt-2 text-[10px] text-slate-500 space-y-1">
                <p className="leading-tight">
                  <MapPin size={12} stroke="#2563eb" className="inline-block shrink-0 mr-1.5" style={{ verticalAlign: '-1.5px' }} />
                  <span className="align-middle" > Chennai-62</span>
                </p>
                <p className="leading-tight">
                  <Phone size={12} stroke="#2563eb" className="inline-block shrink-0 mr-1.5" style={{ verticalAlign: '-1.5px' }} />
                  <span className="align-middle">+91 73976 03921</span>
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="inline-block bg-brand-50 text-brand-700 font-bold px-3 py-1 rounded-lg tracking-wider uppercase text-[10px] border border-brand-100 mb-2.5">
                Quotation
              </span>
              <div className="space-y-1 text-slate-600 text-[10px] w-[110px]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">No:</span>
                  <span className="font-bold text-slate-800 text-right">{quotationNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Date:</span>
                  <span className="font-bold text-slate-800 text-right">{formatDate(quotationDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <User size={12} stroke="#2563eb" className="inline-block shrink-0 mr-1.5" style={{ verticalAlign: '-2px' }} />
                <span className="align-middle">Client Details</span>
              </h3>
              <p className="font-bold text-slate-800 text-xs">{clientName || '---'}</p>
              <p className="text-slate-500 font-medium mt-1 text-[11px]">{phone || '---'}</p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <MapPin size={12} stroke="#2563eb" className="inline-block shrink-0 mr-1.5" style={{ verticalAlign: '-2px' }} />
                <span className="align-middle">Site Address</span>
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line text-xs">
                {address || '---'}
              </p>
            </div>
          </div>

          {/* Project Details Table */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <FileText size={12} stroke="#2563eb" className="inline-block shrink-0 mr-1.5" style={{ verticalAlign: '-2px' }} />
              <span className="align-middle">Project Estimation</span>
            </h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider w-[38%]">Wall / Description</th>
                    <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider w-[26%]">Design Details</th>
                    <th className="py-2.5 px-2 text-[10px] uppercase tracking-wider text-right w-[18%]">Size (sq.ft)</th>
                    <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider text-right w-[18%]">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-slate-400 italic">
                        No project items added yet.
                      </td>
                    </tr>
                  ) : (
                    projects.map((proj, idx) => {
                      const area = calculateArea(proj.length, proj.width);
                      const cost = calculateCost(area, proj.rate);
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-800">{proj.description || '---'}</td>
                          <td className="py-2 px-3 text-slate-500">{proj.designDetails || '---'}</td>
                          <td className="py-2 px-2 text-right font-medium text-slate-600">
                            {formatNumber(area)} <span className="text-[9px] text-slate-400 font-normal">sq.ft</span>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-brand-600">
                            {formatCurrency(cost)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Terms Split (Moved here to flow naturally below the table) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Terms and Conditions */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Terms & Conditions
              </h4>
              {termsList.length === 0 ? (
                <p className="text-slate-400 italic text-[11px]">No custom terms provided.</p>
              ) : (
                <ul className="space-y-1 text-slate-600 pl-3 list-disc text-[10px] leading-relaxed">
                  {termsList.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-[11px]">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Sub Total:</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Advance Amount:</span>
                <span>{formatCurrency(advanceAmount)}</span>
              </div>
              <div className="border-t border-slate-200 my-1.5" />
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Grand Total:</span>
                <span className="text-brand-700">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold mt-1.5 pt-2 border-t border-slate-200">
                <span>Balance Due:</span>
                <span className={balance > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section (Signatures & Footer note pushed to the absolute bottom) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {/* Signatures Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Painter Signature */}
            <div className="flex flex-col items-center justify-end text-center space-y-1">
              <div className="h-14 w-40 border-b border-slate-200 flex items-center justify-center relative bg-slate-50 rounded-lg overflow-hidden">
                {painterSignature ? (
                  <img
                    src={painterSignature}
                    alt="Painter Signature"
                    className="max-h-full max-w-full object-contain pointer-events-none"
                  />
                ) : (
                  <span className="text-[10px] text-slate-300 italic">Awaiting Signature</span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Authorized Signatory
              </span>
              <span className="text-[9px] text-slate-400">For LavZ Artistry</span>
            </div>

            {/* Customer Signature */}
            <div className="flex flex-col items-center justify-end text-center space-y-1">
              <div className="h-14 w-40 border-b border-slate-200 flex items-center justify-center relative bg-slate-50 rounded-lg overflow-hidden">
                {customerSignature ? (
                  <img
                    src={customerSignature}
                    alt="Customer Signature"
                    className="max-h-full max-w-full object-contain pointer-events-none"
                  />
                ) : (
                  <span className="text-[10px] text-slate-300 italic">Awaiting Signature</span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Customer Signature
              </span>
              <span className="text-[9px] text-slate-400">Acceptance of Proposal</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-3">
            Thank you for choosing LavZ Artistry! We look forward to transforming your walls.
          </div>
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;
