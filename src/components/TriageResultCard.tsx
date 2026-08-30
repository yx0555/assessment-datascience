import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle, 
  Layers, 
  ArrowRight, 
  FileCheck, 
  HelpCircle, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { TriageResult, AgencyCode } from '../types';
import { MSO_AGENCIES } from '../data/agencies';

interface TriageResultCardProps {
  result: TriageResult;
  onOpenDirectoryForAgency: (code: AgencyCode) => void;
}

export const TriageResultCard: React.FC<TriageResultCardProps> = ({
  result,
  onOpenDirectoryForAgency
}) => {
  const primaryAgencyCode = result.primaryAgency.code as AgencyCode;
  const agencyInfo = MSO_AGENCIES[primaryAgencyCode] || MSO_AGENCIES.OTHER_AGENCY;

  const isOutOfPurview = !result.isPurviewOfMSO || result.purviewStatus === 'OUT_OF_PURVIEW';

  const priorityColors = {
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    LOW: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20'
  };

  const priorityBadges = {
    CRITICAL: 'CRITICAL PRIORITY',
    HIGH: 'HIGH PRIORITY',
    MEDIUM: 'STANDARD PRIORITY',
    LOW: 'LOW PRIORITY'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 transition-all">
      {/* Top Banner: Purview Status & Primary Agency Recommendation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Purview Status Pill */}
            {isOutOfPurview ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                OUT OF MSO PURVIEW
              </span>
            ) : result.purviewStatus === 'MULTI_AGENCY' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                <Layers className="w-3.5 h-3.5" />
                MULTI-AGENCY COORDINATION
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                WITHIN MSO PURVIEW
              </span>
            )}

            {/* Priority Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${
                priorityColors[result.priority] || priorityColors.MEDIUM
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {priorityBadges[result.priority] || result.priority}
            </span>

            {/* SLA Target */}
            <span className="text-xs text-slate-500 font-medium">
              Est. SLA: <strong className="text-slate-800">{result.slaHoursEstimate}h</strong>
            </span>
          </div>

          <div className="pt-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {isOutOfPurview ? (
                <span className="text-rose-700">Non-Municipal Issue Identified</span>
              ) : (
                <span>Proposed Lead Routing:</span>
              )}
              {!isOutOfPurview && (
                <button
                  onClick={() => onOpenDirectoryForAgency(primaryAgencyCode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border ${agencyInfo.badgeColor} hover:opacity-90 transition-opacity cursor-pointer`}
                  title="Click to view agency purview details"
                >
                  <span>{agencyInfo.shortName}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              {result.primaryAgency.specificDivision 
                ? `${result.primaryAgency.name} • ${result.primaryAgency.specificDivision}`
                : result.primaryAgency.name}
              {result.primaryAgency.targetTownCouncil && (
                <span className="font-semibold text-emerald-700 ml-1">
                  ({result.primaryAgency.targetTownCouncil})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex md:flex-col items-center md:items-end justify-between bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-slate-100">
          <div className="text-xs text-slate-500 font-medium">Model Confidence</div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, result.confidenceScore))}%` }}
              />
            </div>
            <span className="text-sm font-bold font-mono text-slate-800">
              {result.confidenceScore}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Gemini 3.7 Flash</span>
        </div>
      </div>

      {/* Out of Purview Advisory Callout (If Out of Purview) */}
      {isOutOfPurview && result.outOfPurviewDetails && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-rose-900">
                Non-MSO Purview Notice & Recommended Authority
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed">
                {result.outOfPurviewDetails.reason}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-rose-950 bg-white/80 px-2.5 py-1 rounded border border-rose-200">
                  Target Agency: {result.outOfPurviewDetails.recommendedAuthority}
                </span>
                {result.outOfPurviewDetails.alternativeChannel && (
                  <span className="text-xs text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded">
                    Official Channel: {result.outOfPurviewDetails.alternativeChannel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Agencies (If Multi-Agency) */}
      {result.secondaryAgencies && result.secondaryAgencies.length > 0 && (
        <div className="bg-purple-50/50 border border-purple-200/80 rounded-xl p-4 space-y-2">
          <div className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-600" />
            Supporting / Secondary Partner Agencies
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {result.secondaryAgencies.map((sec, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-lg border border-purple-100 text-xs space-y-1 shadow-2xs">
                <div className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>{sec.name} ({sec.code})</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {sec.roleReason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Summary */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Executive Incident Summary
        </h3>
        <p className="text-sm text-slate-800 leading-relaxed font-medium bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          "{result.summary}"
        </p>
      </div>

      {/* Extracted Key Metadata Entities */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Extracted Incident Entities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> Location / Precinct
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-1 truncate" title={result.extractedEntities.location || 'Not explicitly stated'}>
              {result.extractedEntities.location || result.extractedEntities.townOrEstate || 'General Area'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-medium">Issue Category</div>
            <div className="text-xs font-semibold text-slate-800 mt-1 truncate" title={result.extractedEntities.category}>
              {result.extractedEntities.category || 'General Municipal'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-medium">Citizen Sentiment</div>
            <div className="text-xs font-semibold text-slate-800 mt-1">
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                result.extractedEntities.sentiment === 'Urgent' || result.extractedEntities.sentiment === 'Frustrated'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`} />
              {result.extractedEntities.sentiment || 'Neutral'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-medium">Safety Hazard</div>
            <div className="text-xs font-semibold mt-1">
              {result.extractedEntities.safetyHazard ? (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Hazard Identified
                </span>
              ) : (
                <span className="text-slate-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> No Hazard
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Singapore Jurisdiction & Land Boundary Rationale */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Jurisdiction & Statutory Purview Rationale
        </h3>
        <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
          {result.jurisdictionReasoning}
        </div>
      </div>

      {/* Suggested Internal Action Plan for Receiving Officer */}
      {result.actionPlan && result.actionPlan.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
            Recommended Officer Operational Actions
          </h3>
          <div className="space-y-1.5">
            {result.actionPlan.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
