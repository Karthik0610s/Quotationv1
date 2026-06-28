import React from 'react';

/**
 * Footer component.
 */
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <p>© {new Date().getFullYear()} LavZ Artistry. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
          <span>Developed by <span className="text-brand-400 font-semibold">Karthikeyan Developer</span></span>
          <span className="text-slate-700">|</span>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
