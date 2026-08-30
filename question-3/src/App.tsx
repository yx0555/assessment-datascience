import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TriageInput } from './components/TriageInput';
import { HighlightedTriageSection } from './components/HighlightedTriageSection';
import { CaseIntelligenceChat } from './components/CaseIntelligenceChat';
import { TriageHistoryList } from './components/TriageHistoryList';
import { BatchTriageView } from './components/BatchTriageView';
import { TriageResult } from './types';
import { 
  AlertCircle, 
  Sparkles, 
  FileSpreadsheet, 
  Layers 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'routing' | 'history' | 'batch'>('routing');
  const [currentResult, setCurrentResult] = useState<TriageResult | null>(null);
  const [history, setHistory] = useState<TriageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize with a default initial triage case so the officer sees a live example immediately
  useEffect(() => {
    const initialCase: TriageResult = {
      id: 'MSO-748921',
      timestamp: new Date().toISOString(),
      originalFeedback: 'The pedestrian green man signal at the junction of Tampines Ave 4 and Tampines St 21 (near Blk 201D) has not been turning green for the past 2 days. School children from the nearby primary school are forced to dash across the road during breaks in heavy morning traffic. Please send a technician urgently before an accident occurs!',
      purviewStatus: 'UNDER_PURVIEW',
      isPurviewOfMSO: true,
      primaryAgency: {
        code: 'LTA',
        name: 'Land Transport Authority',
        specificDivision: 'Traffic Operations & Commuter Infrastructure Maintenance'
      },
      priority: 'HIGH',
      slaHoursEstimate: 4,
      confidenceScore: 97,
      summary: 'Faulty pedestrian green-man traffic signal at Tampines Ave 4 / Tampines St 21 junction posing urgent road safety hazard for school children.',
      jurisdictionReasoning: 'Traffic signals, pedestrian crossings, push-button mechanisms, and public road infrastructure fall directly under the statutory purview of the Land Transport Authority (LTA).',
      extractedEntities: {
        location: 'Junction of Tampines Ave 4 & Tampines St 21 (near Blk 201D)',
        townOrEstate: 'Tampines',
        landmark: 'Primary school junction',
        safetyHazard: true,
        hazardDetails: 'Pedestrians & schoolchildren crossing against uninterrupted heavy morning traffic',
        sentiment: 'Urgent',
        category: 'Road & Traffic Safety'
      },
      actionPlan: [
        'Dispatch LTA Traffic Operations emergency repair crew to Tampines Ave 4 / St 21 junction within 4 hours',
        'Inspect and replace faulty pedestrian signal push-button / controller card',
        'Verify green-man sequence timing and synchronisation with main road lights'
      ],
      draftReply: {
        standardAcknowledgment: `Dear Resident,\n\nThank you for alerting us to the faulty pedestrian green-man signal at the junction of Tampines Ave 4 and Tampines St 21.\n\nWe have escalated your report directly to the Land Transport Authority (LTA) Traffic Operations engineering team. A repair crew is being dispatched to inspect and rectify the signal mechanism today.\n\nWe appreciate your vigilance in safeguarding road safety for the school children and community.\n\nYours sincerely,\nLand Transport Authority (LTA) / OneService`,
        requestMoreInfoReply: `Dear Resident,\n\nThank you for contacting OneService regarding the pedestrian signal at Tampines Ave 4. Could you let us know if the fault occurs during all cycle intervals or specifically when the pedestrian push-button is pressed?\n\nYours sincerely,\nLand Transport Authority (LTA)`,
        urgentSafetyReply: `[URGENT ATTENTION] Dear Resident, thank you for highlighting this traffic safety risk. LTA's on-duty traffic crew has been deployed to secure the junction and restore normal traffic signal operations immediately.\n\nYours sincerely,\nLand Transport Authority (LTA)`,
        outOfPurviewReferralReply: `Dear Resident,\n\nThank you for contacting OneService. This matter falls outside the statutory scope of municipal agencies. Please contact the relevant specialized authority.\n\nYours sincerely,\nMunicipal Services Office`,
        activeDraftText: `Dear Resident,\n\nThank you for alerting us to the faulty pedestrian green-man signal at the junction of Tampines Ave 4 and Tampines St 21.\n\nWe have escalated your report directly to the Land Transport Authority (LTA) Traffic Operations engineering team. A repair crew is being dispatched to inspect and rectify the signal mechanism today.\n\nWe appreciate your vigilance in safeguarding road safety for the school children and community.\n\nYours sincerely,\nLand Transport Authority (LTA) / OneService`
      }
    };

    setCurrentResult(initialCase);
    setHistory([initialCase]);
  }, []);

  const handleTriage = async (feedbackText: string, contextNotes?: string) => {
    if (!feedbackText || !feedbackText.trim()) {
      setErrorMessage('Please provide feedback text before initiating triage.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackText, contextNotes })
      });

      if (!response.ok) {
        throw new Error(`Triage request failed: ${response.statusText}`);
      }

      const result: TriageResult = await response.json();
      setCurrentResult(result);
      setHistory(prev => [result, ...prev.filter(item => item.id !== result.id)]);
    } catch (err: any) {
      console.error('Triage error:', err);
      setErrorMessage('Failed to triage feedback. Calibrated fallback engine activated.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBatchToHistory = (newItems: TriageResult[]) => {
    if (!newItems || newItems.length === 0) return;
    setHistory(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const freshItems = newItems.filter(item => !existingIds.has(item.id));
      return [...freshItems, ...prev];
    });
  };

  const handleUpdateDraft = (newDraft: string) => {
    if (!currentResult) return;
    const updated = {
      ...currentResult,
      draftReply: {
        ...currentResult.draftReply,
        activeDraftText: newDraft
      }
    };
    setCurrentResult(updated);
    setHistory(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-sm text-rose-800 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Primary Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1 shadow-2xs">
          <button
            onClick={() => setActiveTab('routing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'routing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Feedback Routing</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Feedback History</span>
            {history.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                activeTab === 'history' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {history.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'batch'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Batch Feedback</span>
          </button>
        </div>

        {/* Tab 1: Feedback Routing (Top Half: 2 Equal Columns; Bottom Half: Case Intelligence Chat) */}
        {activeTab === 'routing' && (
          <div className="space-y-6">
            {/* TOP HALF: Equal Width Side-by-Side Frames */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Top Left: Public Feedback Received */}
              <div className="flex flex-col">
                <TriageInput onTriage={handleTriage} isLoading={isLoading} />
              </div>

              {/* Top Right: Proposed Lead Routing Department & Suggested Agency Reply */}
              <div className="flex flex-col">
                {isLoading ? (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center h-full min-h-[360px] space-y-4">
                    <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Evaluating Feedback & Formulating Reply
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Analyzing statutory agency purviews and preparing suggested reply...
                      </p>
                    </div>
                  </div>
                ) : currentResult ? (
                  <HighlightedTriageSection
                    result={currentResult}
                    onUpdateDraft={handleUpdateDraft}
                  />
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[360px] space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No Active Routing Result</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Paste public feedback on the left and click "Generate Routing and Follow-up" to determine lead routing and response.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM HALF: Case Intelligence Chat Frame */}
            {currentResult && (
              <div className="w-full animate-fade-in">
                <CaseIntelligenceChat result={currentResult} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Feedback History Section */}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <TriageHistoryList
              history={history}
              activeResultId={currentResult?.id}
              onSelectResult={(res) => {
                setCurrentResult(res);
                setActiveTab('routing');
              }}
              onClearHistory={() => setHistory([])}
            />
          </div>
        )}

        {/* Tab 3: Batch Feedback */}
        {activeTab === 'batch' && (
          <BatchTriageView 
            onAddBatchToHistory={handleAddBatchToHistory}
            onSelectResult={(res) => {
              setCurrentResult(res);
              setActiveTab('routing');
            }}
          />
        )}
      </main>
    </div>
  );
}
