import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Mail, 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  Sliders, 
  Download, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { TriageResult, AgencyCode } from '../types';
import { MSO_AGENCIES } from '../data/agencies';

interface HighlightedTriageSectionProps {
  result: TriageResult;
  onOpenDirectoryForAgency?: (code: AgencyCode) => void;
  onUpdateDraft: (newDraft: string) => void;
}

export const HighlightedTriageSection: React.FC<HighlightedTriageSectionProps> = ({
  result,
  onOpenDirectoryForAgency,
  onUpdateDraft
}) => {
  const primaryAgencyCode = result.primaryAgency.code as AgencyCode;
  const agencyInfo = MSO_AGENCIES[primaryAgencyCode] || MSO_AGENCIES.OTHER_AGENCY;
  const isOutOfPurview = !result.isPurviewOfMSO || result.purviewStatus === 'OUT_OF_PURVIEW';

  const [activeTab, setActiveTab] = useState<'standard' | 'more_info' | 'urgent' | 'referral'>(
    isOutOfPurview ? 'referral' : 'standard'
  );
  const [draftContent, setDraftContent] = useState(
    result.draftReply.activeDraftText || 
    (isOutOfPurview && result.draftReply.outOfPurviewReferralReply ? result.draftReply.outOfPurviewReferralReply : result.draftReply.standardAcknowledgment)
  );
  const [selectedTone, setSelectedTone] = useState<'Empathetic & Warm' | 'Concise & Direct' | 'Formal Official'>('Empathetic & Warm');
  const [officerNote, setOfficerNote] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [showRefinePanel, setShowRefinePanel] = useState(false);

  // Sync draftContent whenever activeTab or result changes
  useEffect(() => {
    if (isOutOfPurview && result.draftReply.outOfPurviewReferralReply) {
      setActiveTab('referral');
      setDraftContent(result.draftReply.outOfPurviewReferralReply);
    } else {
      setActiveTab('standard');
      setDraftContent(result.draftReply.activeDraftText || result.draftReply.standardAcknowledgment);
    }
  }, [result.id, isOutOfPurview]);

  const handleTabChange = (tab: 'standard' | 'more_info' | 'urgent' | 'referral') => {
    setActiveTab(tab);
    let newText = result.draftReply.standardAcknowledgment;
    if (tab === 'more_info') newText = result.draftReply.requestMoreInfoReply;
    if (tab === 'urgent') newText = result.draftReply.urgentSafetyReply;
    if (tab === 'referral' && result.draftReply.outOfPurviewReferralReply) {
      newText = result.draftReply.outOfPurviewReferralReply;
    }
    setDraftContent(newText);
    onUpdateDraft(newText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = () => {
    setIsDispatched(true);
    setTimeout(() => {
      setIsDispatched(false);
    }, 4000);
  };

  const handleExportText = () => {
    const report = `=====================================================
MUNICIPAL SERVICES OFFICE (MSO) - TRIAGE TICKET
Ticket ID: ${result.id}
Timestamp: ${result.timestamp}
=====================================================

[PURVIEW STATUS]
${result.purviewStatus} (Within MSO: ${result.isPurviewOfMSO ? 'YES' : 'NO'})

[PROPOSED LEAD ROUTING DEPARTMENT]
Lead Agency: ${result.primaryAgency.name} (${result.primaryAgency.code})
Division: ${result.primaryAgency.specificDivision || 'N/A'}
${result.primaryAgency.targetTownCouncil ? `Town Council: ${result.primaryAgency.targetTownCouncil}\n` : ''}
[OUT OF PURVIEW DETAILS (IF ANY)]
${isOutOfPurview && result.outOfPurviewDetails ? `Recommended Authority: ${result.outOfPurviewDetails.recommendedAuthority}\nReason: ${result.outOfPurviewDetails.reason}\nAlternative: ${result.outOfPurviewDetails.alternativeChannel}\n` : 'N/A'}

[SUGGESTED CITIZEN REPLY]
${draftContent}
=====================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.id}-routing-dispatch.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefineWithAI = async () => {
    try {
      setIsPolishing(true);
      const res = await fetch('/api/refine-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalFeedback: result.originalFeedback,
          currentDraft: draftContent,
          tone: selectedTone,
          actionType: activeTab,
          officerNotes: officerNote
        })
      });
      const data = await res.json();
      if (data.refinedDraft) {
        setDraftContent(data.refinedDraft);
        onUpdateDraft(data.refinedDraft);
      }
    } catch (err) {
      console.error('Error polishing draft:', err);
    } finally {
      setIsPolishing(false);
      setShowRefinePanel(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between transition-all h-full">
      <div>
        {/* SECTION 1: PROMINENT LEAD ROUTING / OUT-OF-PURVIEW HIGHLIGHT HEADER */}
        <div className={`p-5 border-b ${
          isOutOfPurview 
            ? 'bg-gradient-to-r from-rose-50 via-rose-50/70 to-amber-50/50 border-rose-200' 
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-2">
              {/* Status Pill */}
              <div className="flex flex-wrap items-center gap-2">
                {isOutOfPurview ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    OUT OF MSO PURVIEW
                  </span>
                ) : result.purviewStatus === 'MULTI_AGENCY' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500 text-white shadow-xs">
                    <Layers className="w-3.5 h-3.5" />
                    MULTI-AGENCY LEAD ROUTING
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    WITHIN MSO PURVIEW
                  </span>
                )}
              </div>

              {/* Main Lead Department Announcement */}
              <div>
                <div className={`text-[11px] font-bold tracking-wider uppercase ${isOutOfPurview ? 'text-rose-700' : 'text-emerald-400'}`}>
                  {isOutOfPurview ? 'Non-Municipal Referral Authority' : 'Proposed Lead Routing Department'}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                  <h1 className={`text-lg sm:text-xl font-black tracking-tight ${isOutOfPurview ? 'text-rose-950' : 'text-white'}`}>
                    {isOutOfPurview
                      ? (result.outOfPurviewDetails?.recommendedAuthority || result.primaryAgency.name)
                      : result.primaryAgency.name}
                  </h1>

                  {!isOutOfPurview && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-white/15 text-white border border-white/20"
                    >
                      {agencyInfo.shortName}
                    </span>
                  )}
                </div>

                {/* Division / Town Council Subtitle */}
                <p className={`text-xs mt-1 ${isOutOfPurview ? 'text-rose-800' : 'text-slate-300'}`}>
                  {result.primaryAgency.specificDivision && (
                    <span>Division: <strong>{result.primaryAgency.specificDivision}</strong></span>
                  )}
                  {result.primaryAgency.targetTownCouncil && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold">
                      {result.primaryAgency.targetTownCouncil}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Out of Purview Notice Box */}
          {isOutOfPurview && result.outOfPurviewDetails && (
            <div className="mt-3 bg-white/90 rounded-xl p-3 border border-rose-200/90 text-xs text-rose-900 space-y-1.5">
              <div className="font-semibold text-rose-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Jurisdiction Clarification & Alternative Channel
              </div>
              <p className="leading-relaxed text-slate-700 text-xs">
                {result.outOfPurviewDetails.reason}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="font-semibold text-slate-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                  Authorized Agency: {result.outOfPurviewDetails.recommendedAuthority}
                </span>
                {result.outOfPurviewDetails.alternativeChannel && (
                  <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                    {result.outOfPurviewDetails.alternativeChannel}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Secondary Supporting Agencies if Multi-Agency */}
          {result.secondaryAgencies && result.secondaryAgencies.length > 0 && (
            <div className="mt-3 bg-white/10 rounded-xl p-3 border border-white/15 text-xs space-y-1.5">
              <div className="text-slate-200 font-semibold flex items-center gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5 text-purple-300" />
                Secondary / Supporting Partner Agencies:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.secondaryAgencies.map((sec, idx) => (
                  <div key={idx} className="bg-white/15 px-2 py-0.5 rounded-lg border border-white/20 text-white text-[11px]">
                    <strong>{sec.name} ({sec.code})</strong>: {sec.roleReason}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: SUGGESTED AGENCY CITIZEN REPLY IN THE SAME UNIFIED CARD */}
        <div className="p-5 space-y-3.5 bg-white">
          {/* Reply Header & Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" />
                Suggested Agency Reply
              </h2>
              <p className="text-[11px] text-slate-500">
                Formulated on behalf of <strong>{result.primaryAgency.name}</strong>.
              </p>
            </div>

            {/* Action Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto overflow-x-auto">
              {!isOutOfPurview && (
                <>
                  <button
                    type="button"
                    onClick={() => handleTabChange('standard')}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'standard'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Acknowledgment
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('more_info')}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'more_info'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Request Info
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('urgent')}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'urgent'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Urgent Action
                  </button>
                </>
              )}

              {isOutOfPurview && (
                <button
                  type="button"
                  onClick={() => handleTabChange('referral')}
                  className="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-white text-rose-800 shadow-2xs whitespace-nowrap"
                >
                  Out-of-Purview Notice
                </button>
              )}
            </div>
          </div>

          {/* Draft Editor Textarea */}
          <div className="relative">
            <textarea
              rows={6}
              value={draftContent}
              onChange={(e) => {
                setDraftContent(e.target.value);
                onUpdateDraft(e.target.value);
              }}
              placeholder="Official agency draft reply will appear here..."
              className="w-full text-xs text-slate-800 bg-slate-50/50 hover:bg-slate-50/90 focus:bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-sans leading-relaxed resize-y"
            />
          </div>

          {/* AI Tone & Polish Drawer (Expandable) */}
          {showRefinePanel && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  Select Tone & Refine
                </span>
                <button
                  type="button"
                  onClick={() => setShowRefinePanel(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(['Empathetic & Warm', 'Concise & Direct', 'Formal Official'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                      selectedTone === t
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="Specific instructions (e.g. Include case reference #4912, highlight scheduled site visit)"
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRefineWithAI}
                  disabled={isPolishing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPolishing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Polishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply Polish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls Toolbar */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowRefinePanel(!showRefinePanel)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Tone / Polish</span>
          </button>

          <button
            type="button"
            onClick={handleExportText}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors cursor-pointer"
            title="Download dispatch ticket summary"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Reply</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDispatch}
            disabled={isDispatched}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer ${
              isDispatched
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.99]'
            }`}
          >
            {isDispatched ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dispatched</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>Approve & Dispatch</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
