import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Building2, 
  Home, 
  ShieldAlert, 
  Car, 
  Trees, 
  Droplets, 
  Landmark, 
  HardHat, 
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { MSO_AGENCIES } from '../data/agencies';
import { AgencyCode } from '../types';

interface AgencyDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightAgencyCode?: AgencyCode | null;
}

export const AgencyDirectoryModal: React.FC<AgencyDirectoryModalProps> = ({
  isOpen,
  onClose,
  highlightAgencyCode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'MSO' | 'NON_MSO'>('ALL');

  if (!isOpen) return null;

  const agencyList = Object.values(MSO_AGENCIES);

  const filteredAgencies = agencyList.filter((agency) => {
    if (selectedFilter === 'MSO' && agency.code === 'OUT_OF_PURVIEW') return false;
    if (selectedFilter === 'NON_MSO' && agency.code !== 'OUT_OF_PURVIEW') return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      agency.name.toLowerCase().includes(q) ||
      agency.shortName.toLowerCase().includes(q) ||
      agency.domain.toLowerCase().includes(q) ||
      agency.description.toLowerCase().includes(q) ||
      agency.typicalIssues.some(i => i.toLowerCase().includes(q))
    );
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5 text-red-600" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'Car': return <Car className="w-5 h-5 text-blue-600" />;
      case 'Trees': return <Trees className="w-5 h-5 text-teal-600" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-cyan-600" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-indigo-600" />;
      case 'HardHat': return <HardHat className="w-5 h-5 text-slate-600" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default: return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700" />
              Singapore MSO Partner Agency Directory & Purview Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory boundaries, land demarcations, and routing jurisdictions under the Municipal Services Office
            </p>
          </div>
          <button
            id="btn-close-directory-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-search-agency"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by agency, issue (e.g. tree, pothole, leak)..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Agencies ({agencyList.length})
            </button>
            <button
              onClick={() => setSelectedFilter('MSO')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === 'MSO'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              MSO Partner Agencies
            </button>
            <button
              onClick={() => setSelectedFilter('NON_MSO')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === 'NON_MSO'
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Out of Purview
            </button>
          </div>
        </div>

        {/* Directory Cards Scroll Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {filteredAgencies.map((agency) => {
            const isHighlighted = highlightAgencyCode === agency.code;
            return (
              <div
                key={agency.code}
                className={`p-4 rounded-xl border transition-all ${
                  isHighlighted
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                      {getIcon(agency.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {agency.name}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${agency.badgeColor}`}>
                          {agency.shortName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {agency.domain}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-2.5">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {agency.description}
                  </p>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Typical Municipal Scopes & Ticket Types:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {agency.typicalIssues.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50/70 px-2 py-1 rounded border border-slate-100">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate" title={issue}>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Source: Municipal Services Office (MSO) Singapore • Partner Agency Operating Standards
        </div>
      </div>
    </div>
  );
};
