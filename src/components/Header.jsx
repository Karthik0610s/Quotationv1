import React from 'react';
import { Paintbrush, RefreshCw, PlusCircle } from 'lucide-react';

/**
 * Header component for the Quotation Generator.
 * Contains the title, logo icon, and global actions like "New Quotation" and "Clear Form".
 */
export default function Header({ onNewQuotation, onClearForm }) {
  return (
    <header className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Brand/Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="bg-white/15 p-2 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
            <Paintbrush className="h-7 w-7 text-brand-200 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              LavZ <span className="text-brand-200">Artistry</span>
            </h1>
            <p className="text-xs text-brand-100 font-medium tracking-wide">
              PREMIUM WALL PAINTING QUOTATION GENERATOR
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNewQuotation}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/25 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm backdrop-blur-sm"
            title="Start a new quotation with an incremented quotation number"
          >
            <PlusCircle className="h-4 w-4 text-brand-200" />
            <span>New Quotation</span>
          </button>
          <button
            type="button"
            onClick={onClearForm}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600/95 hover:bg-rose-600 active:bg-rose-700 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
            title="Reset all form fields to default"
          >
            <RefreshCw className="h-4 w-4 text-rose-100 animate-spin-hover" />
            <span>Clear Form</span>
          </button>
        </div>
      </div>
    </header>
  );
}
