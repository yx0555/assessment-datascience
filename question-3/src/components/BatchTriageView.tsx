import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle2, RefreshCw, AlertCircle, Layers, ArrowRight } from 'lucide-react';
import { TriageResult } from '../types';

interface BatchTriageViewProps {
  onAddBatchToHistory?: (results: TriageResult[]) => void;
  onSelectResult?: (result: TriageResult) => void;
}

export const BatchTriageView: React.FC<BatchTriageViewProps> = ({
  onAddBatchToHistory,
  onSelectResult
}) => {
  const [inputText, setInputText] = useState(`1. Deep pothole on fast lane of CTE near Moulmein exit causing cars to swerve dangerously.
2. Rubbish chute choked at Blk 112 Ang Mo Kio Ave 4 from level 5 to level 8, foul smell spreading.
3. Someone called saying they are OneService officer and asked for PayNow transfer of $500 fine.
4. Large swarm of bees building hive on tree right outside kindergarten in Clementi Woods Park.
5. Air-con compressor leaking water in my private condo master bedroom.`);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<TriageResult[]>([]);

  const handleProcessBatch = async () => {
    const lines = inputText
      .split('\n')
      .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) return;

    setIsProcessing(true);
    const results: TriageResult[] = [];

    for (const line of lines) {
      try {
        const res = await fetch('/api/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedbackText: line })
        });
        const data = await res.json();
        results.push(data);
      } catch (err) {
        console.error('Batch feedback item error:', err);
      }
    }

    setBatchResults(results);
    if (onAddBatchToHistory && results.length > 0) {
      onAddBatchToHistory(results);
    }
    setIsProcessing(false);
  };

  const handleExportCSV = () => {
    if (batchResults.length === 0) return;
    
    const headers = ["Ticket ID", "Feedback", "Purview", "Primary Agency", "Hazard", "Summary", "Citizen Draft Reply"];
    const rows = batchResults.map(r => [
      r.id,
      `"${r.originalFeedback.replace(/"/g, '""')}"`,
      r.purviewStatus,
      `"${r.primaryAgency.name}"`,
      r.extractedEntities.safetyHazard ? "YES" : "NO",
      `"${r.summary.replace(/"/g, '""')}"`,
      `"${r.draftReply.activeDraftText.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mso-batch-feedback-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Batch Feedback Processor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter multiple feedback items (one per line) or paste ticket transcripts to process in high volume. All processed entries will be automatically saved to Feedback History.
            </p>
          </div>

          {batchResults.length > 0 && (
            <button
              id="btn-export-batch-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({batchResults.length})</span>
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Batch Input List (1 feedback entry per line):
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={7}
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
            placeholder="Paste tickets here, one per line..."
          />
        </div>

        <div className="flex justify-end">
          <button
            id="btn-process-batch"
            onClick={handleProcessBatch}
            disabled={isProcessing}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white shadow-sm transition-all ${
              isProcessing ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Batch Queue...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Process All Feedback Entries</span>
              </>
            )}
          </button>
        </div>
      </div>

      {batchResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Batch Feedback Results ({batchResults.length} Items saved to History)
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Added to Feedback History
            </span>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {batchResults.map((res) => (
              <div 
                key={res.id} 
                className="p-4 hover:bg-slate-50/80 transition-colors space-y-2 cursor-pointer group"
                onClick={() => onSelectResult && onSelectResult(res)}
                title="Click to view in single feedback routing"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                      {res.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {res.primaryAgency.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      res.purviewStatus === 'OUT_OF_PURVIEW' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {res.purviewStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-400">
                      SLA: {res.slaHoursEstimate}h
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">
                  <strong>Input:</strong> {res.originalFeedback}
                </p>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs text-slate-700">
                  <strong>Draft Reply:</strong> {res.draftReply.activeDraftText.slice(0, 140)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
