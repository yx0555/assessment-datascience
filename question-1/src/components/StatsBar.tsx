import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';
import { TriageResult } from '../types';

interface StatsBarProps {
  history: TriageResult[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ history }) => {
  const total = history.length;
  const inPurviewCount = history.filter(h => h.isPurviewOfMSO && h.purviewStatus !== 'OUT_OF_PURVIEW').length;
  const outOfPurviewCount = total - inPurviewCount;
  const inPurviewRate = total > 0 ? Math.round((inPurviewCount / total) * 100) : 100;
  
  const criticalCount = history.filter(h => h.priority === 'CRITICAL' || h.priority === 'HIGH').length;
  const avgSla = total > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.slaHoursEstimate || 12), 0) / total)
    : 8;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Total Triaged */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
          <span>Cases Processed</span>
          <Building className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="text-xl font-bold text-slate-900 mt-1">
          {total}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Live internal session ledger
        </div>
      </div>

      {/* In Purview Rate */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
          <span>MSO Purview Rate</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <div className="text-xl font-bold text-emerald-700 mt-1">
          {inPurviewRate}%
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          {outOfPurviewCount} non-MSO referrals
        </div>
      </div>

      {/* High/Critical Priority */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
          <span>Urgent / Hazards</span>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="text-xl font-bold text-amber-700 mt-1">
          {criticalCount}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Flagged for priority dispatch
        </div>
      </div>

      {/* Avg SLA Target */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
          <span>Average SLA Target</span>
          <Clock className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <div className="text-xl font-bold text-blue-700 mt-1">
          {avgSla}h
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Cross-agency turnaround
        </div>
      </div>
    </div>
  );
};
