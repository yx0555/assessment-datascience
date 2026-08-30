import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Send, 
  Edit3, 
  Sliders, 
  MessageSquare, 
  Download, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { TriageResult } from '../types';

interface DraftReplyEditorProps {
  result: TriageResult;
  onUpdateDraft: (newDraft: string) => void;
}

export const DraftReplyEditor: React.FC<DraftReplyEditorProps> = ({
  result,
  onUpdateDraft
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'more_info' | 'urgent' | 'referral'>('standard');
  const [draftContent, setDraftContent] = useState(result.draftReply.activeDraftText || result.draftReply.standardAcknowledgment);
  const [selectedTone, setSelectedTone] = useState<'Empathetic & Warm' | 'Concise & Direct' | 'Formal Official'>('Empathetic & Warm');
  const [officerNote, setOfficerNote] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [showRefinePanel, setShowRefinePanel] = useState(false);

  // Sync draftContent if activeTab changes
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
${result.purviewStatus} (MSO Purview: ${result.isPurviewOfMSO ? 'YES' : 'NO'})

[RECEIVING AGENCY]
Primary: ${result.primaryAgency.name} (${result.primaryAgency.code})
Division: ${result.primaryAgency.specificDivision || 'N/A'}
Priority: ${result.priority} | Est SLA: ${result.slaHoursEstimate} Hours
Confidence: ${result.confidenceScore}%

[CITIZEN FEEDBACK]
"${result.originalFeedback}"

[EXECUTIVE SUMMARY]
${result.summary}

[JURISDICTION RATIONALE]
${result.jurisdictionReasoning}

[OFFICER APPROVED CITIZEN REPLY]
${draftContent}
=====================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.id}-triage-dispatch.txt`;
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Suggested Agency Citizen Reply
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200/60">
              Receiving Agency Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, refine, and approve the official communication drafted on behalf of{' '}
            <strong className="text-slate-800">{result.primaryAgency.name}</strong>.
          </p>
        </div>

        {/* Action Preset Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto overflow-x-auto">
          <button
            id="tab-standard-reply"
            type="button"
            onClick={() => handleTabChange('standard')}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'standard'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acknowledgment
          </button>
          <button
            id="tab-more-info-reply"
            type="button"
            onClick={() => handleTabChange('more_info')}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'more_info'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Request Details
          </button>
          <button
            id="tab-urgent-reply"
            type="button"
            onClick={() => handleTabChange('urgent')}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'urgent'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Urgent Action
          </button>
          {!result.isPurviewOfMSO && (
            <button
              id="tab-referral-reply"
              type="button"
              onClick={() => handleTabChange('referral')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'referral'
                  ? 'bg-white text-rose-800 shadow-2xs font-semibold'
                  : 'text-rose-600 hover:text-rose-900'
              }`}
            >
              Referral Notice
            </button>
          )}
        </div>
      </div>

      {/* Main Draft Textarea */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            id="textarea-draft-reply"
            rows={7}
            value={draftContent}
            onChange={(e) => {
              setDraftContent(e.target.value);
              onUpdateDraft(e.target.value);
            }}
            className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50/40 hover:bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans leading-relaxed resize-y"
            placeholder="Official draft response..."
          />
          <div className="absolute right-3.5 bottom-3 text-[11px] text-slate-400 font-mono">
            {draftContent.length} chars
          </div>
        </div>
      </div>

      {/* Polish & Refine Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Communication Tone:
            </span>
            {(['Empathetic & Warm', 'Concise & Direct', 'Formal Official'] as const).map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setSelectedTone(tone)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors border ${
                  selectedTone === tone
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>

          <button
            id="btn-toggle-refine-panel"
            type="button"
            onClick={() => setShowRefinePanel(!showRefinePanel)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{showRefinePanel ? 'Hide AI Polish' : 'AI Polish with Notes'}</span>
          </button>
        </div>

        {showRefinePanel && (
          <div className="pt-2 border-t border-slate-200/60 space-y-2">
            <input
              type="text"
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              placeholder="e.g. Mention that contractor Mr. Tan will visit tomorrow at 10am; emphasize dengue vigilance"
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-slate-400"
            />
            <div className="flex justify-end">
              <button
                id="btn-apply-polish"
                type="button"
                onClick={handleRefineWithAI}
                disabled={isPolishing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-2xs disabled:opacity-50"
              >
                {isPolishing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Polishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Apply AI Polish ({selectedTone})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dispatched Notification Banner */}
      {isDispatched && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Reply Approved & Dispatched!</strong> Reference ticket <strong>{result.id}</strong> logged to OneService routing ledger.
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
            Status: Dispatched
          </span>
        </div>
      )}

      {/* Bottom Dispatch Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {/* Copy to Clipboard */}
          <button
            id="btn-copy-draft"
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Draft</span>
              </>
            )}
          </button>

          {/* Export Ticket Report */}
          <button
            id="btn-export-ticket"
            type="button"
            onClick={handleExportText}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            title="Download full case summary & draft response"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>

        {/* Approve & Dispatch Button */}
        <button
          id="btn-approve-dispatch"
          type="button"
          onClick={handleDispatch}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] rounded-xl shadow-xs transition-all focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-100" />
          <span>Approve & Dispatch Reply</span>
        </button>
      </div>
    </div>
  );
};
