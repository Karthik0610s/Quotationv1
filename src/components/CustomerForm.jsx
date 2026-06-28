import React from 'react';
import { User, Phone, MapPin, Hash, Calendar } from 'lucide-react';

/**
 * CustomerForm component to collect customer and quotation details.
 * Integrates with react-hook-form.
 */
export default function CustomerForm({ register, errors, quotationNumber, quotationDate }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <User className="h-5 w-5 text-brand-500" />
          <span>Client Information</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Enter the customer details and quotation metadata</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quotation Number (Auto) */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Hash className="h-3.5 w-3.5 text-slate-400" />
            Quotation Number
          </label>
          <input
            type="text"
            value={quotationNumber}
            disabled
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed outline-none"
          />
        </div>

        {/* Quotation Date (Auto) */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Quotation Date
          </label>
          <input
            type="text"
            value={quotationDate}
            disabled
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed outline-none"
          />
        </div>

        {/* Client Name */}
        <div className="md:col-span-1">
          <label htmlFor="clientName" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-slate-400" />
            Client Name <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              id="clientName"
              type="text"
              placeholder="Enter client's full name"
              {...register('clientName', { required: 'Client name is required' })}
              className={`w-full pl-4 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border ${
                errors.clientName ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
              } rounded-xl text-slate-800 text-sm transition-all duration-200 outline-none focus:ring-4`}
            />
          </div>
          {errors.clientName && (
            <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.clientName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="md:col-span-1">
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            Phone Number <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              id="phone"
              type="tel"
              placeholder="Enter phone number (e.g. +91 98765 43210)"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[0-9\s-]{10,15}$/,
                  message: 'Please enter a valid phone number',
                },
              })}
              className={`w-full pl-4 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border ${
                errors.phone ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
              } rounded-xl text-slate-800 text-sm transition-all duration-200 outline-none focus:ring-4`}
            />
          </div>
          {errors.phone && (
            <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            Address
          </label>
          <textarea
            id="address"
            rows="3"
            placeholder="Enter project/client site address"
            {...register('address')}
            className="w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-500 focus:ring-brand-100 rounded-xl text-slate-800 text-sm transition-all duration-200 outline-none focus:ring-4 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
