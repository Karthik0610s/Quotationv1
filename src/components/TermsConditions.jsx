import React from 'react';
import { FileText } from 'lucide-react';

/**
 * TermsConditions component for entering custom terms and conditions.
 */
export default function TermsConditions({ register }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-500" />
          <span>Terms & Conditions</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Customize payment stages, project schedules, and warranties</p>
      </div>

      <div>
        <textarea
          id="terms"
          rows="4"
          placeholder="Enter terms and conditions line-by-line..."
          {...register('terms')}
          className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-500 focus:ring-brand-100 rounded-xl text-slate-700 text-xs leading-relaxed transition-all duration-200 outline-none focus:ring-4 resize-none"
        />
        <p className="text-[10px] text-slate-400 mt-2 italic">
          Tip: You can edit the text above. Each line will appear as a bullet point in the generated PDF.
        </p>
      </div>
    </div>
  );
}
