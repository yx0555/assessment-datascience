import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Trash2, 
  AlertTriangle, 
  Download, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { TriageResult, AgencyCode } from '../types';
import { MSO_AGENCIES } from '../data/agencies';

interface TriageHistoryListProps {
  history: TriageResult[];
  activeResultId?: string;
  onSelectResult: (result: TriageResult) => void;
  onClearHistory: () => void;
}

export const TriageHistoryList: React.FC<TriageHistoryListProps> = ({
  history,
  activeResultId,
  onSelectResult,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [agencyFilter, setAgencyFilter] = useState<string>('ALL');

  const filteredHistory = history.filter((item) => {
    if (agencyFilter !== 'ALL' && item.primaryAgency.code !== agencyFilter) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.originalFeedback.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.primaryAgency.name.toLowerCase().includes(q) ||
      (item.extractedEntities.location && item.extractedEntities.location.toLowerCase().includes(q))
    );
  });

  const exportAllJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mso-feedback-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-800" />
            Feedback History & Activity Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and inspect all {history.length} public feedback ticket{history.length === 1 ? '' : 's'} triaged and routed during this session.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              id="btn-export-session-json"
              onClick={exportAllJson}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer transition-all"
              title="Export all triaged tickets as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export History (.json)</span>
            </button>
            <button
              id="btn-clear-session-history"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 cursor-pointer transition-all"
              title="Clear current session history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs space-y-2">
          <FileText className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-600 text-sm">No feedback tickets in history yet</p>
          <p className="text-slate-400 max-w-sm mx-auto">
            Switch to the <strong>Feedback Routing</strong> tab to evaluate public feedback and build your history ledger.
          </p>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket ID, keywords, agency, location..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                aria-label="Filter by Agency"
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 font-medium cursor-pointer"
              >
                <option value="ALL">All Agencies</option>
                <option value="HDB">HDB</option>
                <option value="TOWN_COUNCIL">Town Councils</option>
                <option value="NEA">NEA</option>
                <option value="LTA">LTA</option>
                <option value="NPARKS">NParks</option>
                <option value="PUB">PUB</option>
                <option value="SLA">SLA</option>
                <option value="OUT_OF_PURVIEW">Out of Purview</option>
              </select>
            </div>
          </div>

          {/* Ticket Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {filteredHistory.map((item) => {
              const agency = MSO_AGENCIES[item.primaryAgency.code as AgencyCode] || MSO_AGENCIES.OTHER_AGENCY;
              const isActive = activeResultId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectResult(item)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs text-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {item.id}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                          isActive 
                            ? 'bg-slate-800 text-white border-slate-700' 
                            : agency.badgeColor
                        }`}>
                          {agency.shortName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.extractedEntities.safetyHazard && (
                          <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Hazard
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {item.primaryAgency.name}
                      </h4>
                      <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                        {item.summary || item.originalFeedback}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isActive ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-semibold flex items-center gap-1 text-emerald-400 hover:underline">
                      <span>Open in Feedback Routing</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
