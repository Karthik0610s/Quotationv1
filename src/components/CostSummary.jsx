import React from 'react';
import { Landmark, ArrowRightLeft, Wallet, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatter';

/**
 * CostSummary component displaying subtotals, advance amount input, grand total, and balance.
 */
export default function CostSummary({ register, errors, subTotal, grandTotal, balance }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6">
      <div className="border-b border-slate-100 pb-3 mb-5">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-brand-500" />
          <span>Cost Summary</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-sans">Overview of total costs, advance payment, and remaining balance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sub Total */}
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sub Total</span>
          <span className="text-lg font-bold text-slate-700 mt-2">{formatCurrency(subTotal)}</span>
        </div>

        {/* Advance Amount (Input) */}
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between">
          <label htmlFor="advanceAmount" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5 text-slate-400" />
            Advance Payment
          </label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
            <input
              id="advanceAmount"
              type="number"
              step="any"
              placeholder="0.00"
              {...register('advanceAmount', {
                min: { value: 0, message: 'Cannot be negative' },
              })}
              className={`w-full pl-7 pr-3 py-2 bg-white border ${
                errors.advanceAmount ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
              } rounded-xl text-slate-800 text-sm font-bold outline-none focus:ring-4 transition-all`}
            />
          </div>
          {errors.advanceAmount && (
            <p className="text-rose-500 text-[10px] mt-1 font-medium">{errors.advanceAmount.message}</p>
          )}
        </div>

        {/* Grand Total */}
        <div className="bg-brand-50/40 border border-brand-100/50 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 bg-brand-500/10 p-5 rounded-full">
            <CheckCircle className="h-8 w-8 text-brand-500/20" />
          </div>
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider z-10">Grand Total</span>
          <span className="text-xl font-black text-brand-700 mt-2 z-10">{formatCurrency(grandTotal)}</span>
        </div>

        {/* Balance Amount */}
        <div className={`border p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden ${
          balance > 0 
            ? 'bg-amber-50/30 border-amber-100/50 text-amber-900' 
            : 'bg-emerald-50/30 border-emerald-100/50 text-emerald-900'
        }`}>
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 bg-current opacity-[0.04] p-5 rounded-full">
            <ArrowRightLeft className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Balance Due</span>
          <span className="text-xl font-black mt-2">{formatCurrency(balance)}</span>
        </div>
      </div>
    </div>
  );
}
