import React from 'react';
import { Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-2 ring-slate-800/10">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                MSO Municipal Feedback Triage
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                OneService Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Municipal Services Office • Cross-Agency Routing & Citizen Reply Assistant
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

