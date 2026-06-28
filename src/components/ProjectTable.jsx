import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Layers, LayoutGrid } from 'lucide-react';
import { calculateArea, calculateCost } from '../services/calculationService';
import { formatNumber, formatCurrency } from '../utils/formatter';

/**
 * ProjectTable component for managing dynamic project rows.
 * Uses react-hook-form's useFieldArray.
 */
export default function ProjectTable({ register, control, watch, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const watchedProjects = watch('projects') || [];

  const handleAddRow = () => {
    append({
      description: '',
      designDetails: '',
      length: '',
      width: '',
      rate: '',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-brand-500" />
            <span>Project Details</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Specify the walls, dimensions, rates, and design details</p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm shadow-brand-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Wall / Area</span>
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Layers className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No project rows added yet</p>
          <p className="text-xs text-slate-400 mt-1">Click the "Add Wall / Area" button to add at least one painting item</p>
          {errors.projects?.root && (
            <p className="text-rose-500 text-xs mt-3 font-semibold">{errors.projects.root.message}</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[26%]">Wall Description</th>
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[20%]">Design Details</th>
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-16">Length (Ft)</th>
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-16">Width (Ft)</th>
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-20">Area (Sq.Ft)</th>
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-36">Rate (₹)</th>
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-28">Cost (₹)</th>
                <th className="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field, index) => {
                const length = watchedProjects[index]?.length || 0;
                const width = watchedProjects[index]?.width || 0;
                const rate = watchedProjects[index]?.rate || 0;
                const area = calculateArea(length, width);
                const cost = calculateCost(area, rate);

                return (
                  <tr key={field.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                    {/* Wall Description */}
                    <td className="py-3 pr-2 w-[26%]">
                      <input
                        type="text"
                        placeholder="e.g. Living Room Main Wall"
                        {...register(`projects.${index}.description`, { required: 'Description required' })}
                        className={`w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border ${
                          errors.projects?.[index]?.description ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
                        } rounded-xl text-slate-800 text-xs outline-none focus:ring-2 transition-all`}
                      />
                    </td>

                    {/* Design Details */}
                    <td className="py-3 pr-2 w-[20%]">
                      <input
                        type="text"
                        placeholder="e.g. Royal Play, Texture, Matte"
                        {...register(`projects.${index}.designDetails`)}
                        className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-brand-500 focus:ring-brand-100 rounded-xl text-slate-800 text-xs outline-none focus:ring-2 transition-all"
                      />
                    </td>

                    {/* Length (Feet) */}
                    <td className="py-3 pr-2 text-center w-16">
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        {...register(`projects.${index}.length`, {
                          required: true,
                          min: { value: 0.01, message: 'Must be > 0' },
                        })}
                        className={`w-full px-2 py-2 text-center bg-slate-50 hover:bg-slate-100/70 focus:bg-white border ${
                          errors.projects?.[index]?.length ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
                        } rounded-xl text-slate-800 text-xs outline-none focus:ring-2 transition-all`}
                      />
                    </td>

                    {/* Width (Feet) */}
                    <td className="py-3 pr-2 text-center w-16">
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        {...register(`projects.${index}.width`, {
                          required: true,
                          min: { value: 0.01, message: 'Must be > 0' },
                        })}
                        className={`w-full px-2 py-2 text-center bg-slate-50 hover:bg-slate-100/70 focus:bg-white border ${
                          errors.projects?.[index]?.width ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
                        } rounded-xl text-slate-800 text-xs outline-none focus:ring-2 transition-all`}
                      />
                    </td>

                    {/* Area (Auto) */}
                    <td className="py-3 text-right font-semibold text-slate-700 text-xs select-none pr-2 w-20">
                      {formatNumber(area)} <span className="text-[10px] text-slate-400 font-normal">sq.ft</span>
                    </td>

                    {/* Rate per Sq.Ft */}
                    <td className="py-3 pr-2 w-36">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2.5 text-[10px] font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          step="any"
                          placeholder="0"
                          {...register(`projects.${index}.rate`, {
                            required: true,
                            min: { value: 0.01, message: 'Must be > 0' },
                          })}
                          className={`w-full pl-6 pr-2 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border ${
                            errors.projects?.[index]?.rate ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
                          } rounded-xl text-slate-800 text-xs outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                    </td>

                    {/* Cost (Auto) */}
                    <td className="py-3 text-right font-bold text-brand-600 text-xs select-none pr-2 w-28">
                      {formatCurrency(cost)}
                    </td>

                    {/* Delete Action */}
                    <td className="py-3 text-center w-12">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                        title="Remove wall"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
