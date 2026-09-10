import React, { useState } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Bot, Send, Sparkles, AlertTriangle, Lightbulb, Zap, RefreshCw } from 'lucide-react';

export const AiAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello Alex! I am your Nexus AI Sales Copilot. I have analyzed your active deals and leads. Here are key insights for today:\n\n1. Apex Global Deal ($185k) has a 75% win probability, but hasn\'t had a recorded call in 5 days.\n2. Sophia Martine (Score: 88) matches your Ideal Customer Profile (ICP) for Biotech compliance module rollout.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponse = 'Based on your CRM data: I recommend scheduling a follow-up demo call with Apex Global. Would you like me to draft a personalized follow-up email?';
      if (userMsg.toLowerCase().includes('lead') || userMsg.toLowerCase().includes('score')) {
        aiResponse = 'Top 3 Leads by AI Engagement Score:\n1. Sophia Martine (88) - High activity on pricing page.\n2. Liam O\'Connor (92) - Requested Security Compliance Docs.\n3. Hannah Zhang (74) - Opened last 3 email campaigns.';
      } else if (userMsg.toLowerCase().includes('draft') || userMsg.toLowerCase().includes('email')) {
        aiResponse = 'Draft Email generated:\n\nSubject: Nexus CRM SLA & Custom Workflows Overview for Apex Global\n\nHi David,\n\nFollowing up on our discussion regarding your enterprise CRM rollout...';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nexus AI Sales Intelligence Copilot"
        subtitle="Natural language sales query engine, automated deal risk detection, and draft generation."
        breadcrumbs={['CRM', 'AI Copilot']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface Column */}
        <Card className="lg:col-span-2 flex flex-col h-[650px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm">Nexus Sales Assistant</h3>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Online • Enterprise LLM Engine
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Reset Session
            </Button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-subtle whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && <Avatar name="Alex Vance" size="sm" />}
              </div>
            ))}
            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-brand-600 font-bold animate-pulse">
                <Sparkles className="w-4 h-4" /> Nexus AI is analyzing sales graph...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Summarize high-priority deals' or 'Draft email to Sophia')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-sm px-4 py-2.5 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <Button type="submit" variant="primary" rightIcon={<Send className="w-4 h-4" />}>
              Ask
            </Button>
          </form>
        </Card>

        {/* AI Deal Risk & Action Recommendations */}
        <div className="space-y-4">
          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              Automated Risk Alert
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-2">BioGenix Labs ($240k)</h4>
            <p className="text-xs text-slate-500 mt-1">
              Risk: Competitor "Vortex CRM" mentioned in last email exchange. Recommended action: Send comparison SLA matrix.
            </p>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <Lightbulb className="w-4 h-4" />
              Smart Opportunity
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-2">CloudScale Dynamics ($92k)</h4>
            <p className="text-xs text-slate-500 mt-1">
              High intent signal: Client viewed contract terms 4 times in the past 24 hours. Ready to close.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
