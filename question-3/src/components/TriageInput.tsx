import React, { useState } from 'react';
import { 
  FileText, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface TriageInputProps {
  onTriage: (feedback: string, notes?: string) => Promise<void>;
  isLoading: boolean;
}

export const TriageInput: React.FC<TriageInputProps> = ({ onTriage, isLoading }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [contextNotes, setContextNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleClear = () => {
    setFeedbackText('');
    setContextNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || isLoading) return;
    onTriage(feedbackText, contextNotes.trim() ? contextNotes : undefined);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 h-full flex flex-col justify-between transition-all">
      <div>
        <div className="pb-3.5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Public Feedback Received
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Paste public feedback from OneService, email, or resident communications to determine lead routing and generate the suggested agency reply.
          </p>
        </div>

        <form id="form-triage-input" onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Main Textarea */}
          <div className="relative">
            <textarea
              id="input-citizen-feedback"
              rows={6}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Paste public feedback here..."
              className="w-full text-sm text-slate-800 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400 resize-y leading-relaxed font-sans"
              required
            />
            <div className="flex justify-end mt-1 text-[11px] text-slate-400 font-mono">
              <span>{feedbackText.length} characters</span>
            </div>
          </div>

          {/* Optional Context Notes Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showNotes ? 'Hide internal notes' : '+ Add internal officer notes (optional)'}</span>
            </button>

            {showNotes && (
              <div className="mt-2 animate-fade-in">
                <input
                  id="input-officer-notes"
                  type="text"
                  value={contextNotes}
                  onChange={(e) => setContextNotes(e.target.value)}
                  placeholder="e.g. Repeated enquiry from resident; site inspection already scheduled previously"
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
        <button
          id="btn-clear-input"
          type="button"
          onClick={handleClear}
          disabled={!feedbackText && !contextNotes}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        <button
          id="btn-submit-triage"
          type="submit"
          form="form-triage-input"
          disabled={!feedbackText.trim() || isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating Feedback...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Routing and Follow-up</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
