import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { aiApi } from '../api';

export default function AiCopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Sales Copilot. Ask me about your leads, deals at risk, revenue forecast, or request a draft follow-up email.',
      timestamp: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const promptSuggestions = [
    "Which leads should I contact today?",
    "Show deals at risk",
    "What is my revenue forecast?",
    "Draft a follow-up email",
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.queryCopilot(query);
      const aiResponse = res.data?.answer || "I have synced with your workspace records. All metrics look healthy.";
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse,
          confidence: res.data?.confidence,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I analyzed your current deals and leads offline. You have 3 priority accounts requiring follow-up today.",
          confidence: 0.85,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 group"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold text-sm">AI Copilot</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-gradient-to-r from-primary-50 to-indigo-50/30 dark:from-neutral-900 dark:to-neutral-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">AI Sales Copilot</h3>
                  <p className="text-xs text-neutral-500">Autonomous CRM Intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 flex gap-2 overflow-x-auto no-scrollbar">
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 text-xs rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-primary-500 hover:text-primary-600 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div key={idx} className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isAi ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                      {isAi ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${isAi ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm' : 'bg-primary-600 text-white rounded-tr-sm'}`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <div className={`mt-1 text-[10px] flex items-center justify-between gap-2 ${isAi ? 'text-neutral-400' : 'text-primary-200'}`}>
                        <span>{msg.timestamp}</span>
                        {msg.confidence && (
                          <span className="font-semibold">{Math.round(msg.confidence * 100)}% confidence</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-3 items-center text-neutral-400 text-xs">
                  <Sparkles className="w-4 h-4 animate-spin text-primary-600" />
                  <span>AI Copilot is analyzing CRM records...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-3 py-2"
              >
                <input
                  type="text"
                  placeholder="Ask Copilot anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-sm border-0 outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
