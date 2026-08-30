import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  FileText, 
  ShieldAlert, 
  MapPin, 
  ListChecks, 
  Building2, 
  RotateCcw,
  Bot,
  User,
  Info
} from 'lucide-react';
import { TriageResult } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface CaseIntelligenceChatProps {
  result: TriageResult;
}

export const CaseIntelligenceChat: React.FC<CaseIntelligenceChatProps> = ({ result }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Reset chat when active triage case changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Case **${result.id}** (${result.primaryAgency.name}) is ready. Detailed incident info—including the **executive summary**, **statutory purview rationale**, **extracted incident entities**, and **operational action plan**—is available on demand. Click any quick prompt below or type your question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [result.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      id: 'summary',
      label: 'Executive Incident Summary',
      icon: <FileText className="w-3.5 h-3.5 text-blue-500" />,
      query: 'What is the executive incident summary?'
    },
    {
      id: 'rationale',
      label: 'Statutory Purview Rationale',
      icon: <Building2 className="w-3.5 h-3.5 text-emerald-500" />,
      query: 'Why is this agency assigned under statutory purview and land boundary guidelines?'
    },
    {
      id: 'actions',
      label: 'Officer Action Plan',
      icon: <ListChecks className="w-3.5 h-3.5 text-purple-500" />,
      query: 'What is the recommended operational action plan for the receiving officer?'
    },
    {
      id: 'hazards',
      label: 'Safety Hazard & Urgency',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />,
      query: 'Were any public safety hazards or critical urgency factors detected?'
    },
    {
      id: 'entities',
      label: 'Extracted Entities & Location',
      icon: <MapPin className="w-3.5 h-3.5 text-amber-500" />,
      query: 'What are the extracted location, landmark, town, category, and sentiment entities?'
    },
    {
      id: 'secondary',
      label: 'Secondary Partner Agencies',
      icon: <Info className="w-3.5 h-3.5 text-cyan-500" />,
      query: 'Are there any secondary or cross-boundary partner agencies involved in this case?'
    }
  ];

  const handleSendMessage = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/case-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          caseContext: result,
          chatHistory: messages.slice(-6)
        })
      });

      if (!response.ok) {
        throw new Error('Chat API call failed');
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the requested incident detail for this case.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback local lookup
      const lower = trimmed.toLowerCase();
      let fallbackText = '';
      if (lower.includes('summary')) {
        fallbackText = `**Executive Incident Summary:**\n"${result.summary}"`;
      } else if (lower.includes('why') || lower.includes('purview') || lower.includes('rationale') || lower.includes('jurisdiction')) {
        fallbackText = `**Statutory Purview & Land Boundary Rationale:**\n${result.jurisdictionReasoning}`;
      } else if (lower.includes('action') || lower.includes('plan')) {
        fallbackText = `**Recommended Officer Actions:**\n` + (result.actionPlan || []).map((a, i) => `${i + 1}. ${a}`).join('\n');
      } else if (lower.includes('hazard') || lower.includes('safety') || lower.includes('urgency')) {
        fallbackText = `**Safety & Urgency Assessment:**\n- Safety Hazard: ${result.extractedEntities.safetyHazard ? '⚠️ Yes (' + (result.extractedEntities.hazardDetails || 'Urgent hazard identified') + ')' : '✅ No immediate safety hazard'}`;
      } else if (lower.includes('entity') || lower.includes('location')) {
        fallbackText = `**Extracted Incident Entities:**\n- Location: ${result.extractedEntities.location || result.extractedEntities.townOrEstate || 'General vicinity'}\n- Category: ${result.extractedEntities.category}\n- Sentiment: ${result.extractedEntities.sentiment}`;
      } else {
        fallbackText = `**Case Intelligence:**\nThis incident is assigned to **${result.primaryAgency.name}**.\nSummary: "${result.summary}"`;
      }

      const fallbackMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Chat reset. Ask any question regarding incident specifics, statutory boundaries, or action recommendations for case **${result.id}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Case Intelligence Chat
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-semibold">
                {result.id}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Prompt or ask questions to view incident summary, statutory reasoning, entities & actions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-700 px-2.5 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="p-3 bg-slate-50/40 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Click to view case details:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSendMessage(p.query)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 space-y-3.5 max-h-[320px] overflow-y-auto bg-slate-50/20">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  MSO
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                isUser
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-1'
              }`}>
                <div className="whitespace-pre-line font-sans">
                  {m.text}
                </div>
                <div className={`text-[10px] text-right font-mono mt-1 ${isUser ? 'text-slate-300' : 'text-slate-400'}`}>
                  {m.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
              MSO
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
              <span>Retrieving case intelligence...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Text Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3.5 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about this case (e.g. 'What is the incident summary?', 'Why not NEA?')..."
          disabled={isLoading}
          className="flex-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder:text-slate-400 transition-all disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-all disabled:opacity-40 cursor-pointer shrink-0"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
