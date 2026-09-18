import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../services/api';
import { BookOpen, Search, Sparkles, Plus, Folder, FileText, ArrowRight, Bot } from 'lucide-react';

export const KnowledgePage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ragQuestion, setRagQuestion] = useState('');
  const [ragAnswer, setRagAnswer] = useState(null);
  const [askingRag, setAskingRag] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Product Guide', content: '', summary: '' });

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    try {
      const [artData, catData] = await Promise.all([
        api.knowledge.getArticles(),
        api.knowledge.getCategories(),
      ]);
      setArticles(Array.isArray(artData) ? artData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (e) {
      console.warn('Failed to load knowledge base:', e);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await api.knowledge.createArticle(formData);
    setIsDrawerOpen(false);
    setFormData({ title: '', category: 'Product Guide', content: '', summary: '' });
    loadKnowledge();
  };

  const handleAskRag = async (e) => {
    e.preventDefault();
    if (!ragQuestion.trim()) return;
    setAskingRag(true);
    try {
      const res = await api.knowledge.askQuestion(ragQuestion);
      setRagAnswer(res);
    } catch (e) {
      setRagAnswer({ answer: 'Failed to synthesize answer from Knowledge Base RAG service.' });
    } finally {
      setAskingRag(false);
    }
  };

  const filtered = articles.filter((a) => {
    const title = (a.title || '').toLowerCase();
    const summary = (a.summary || a.content || '').toLowerCase();
    const q = query.toLowerCase();
    const matchesSearch = title.includes(q) || summary.includes(q);
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Knowledge Base &amp; RAG Intelligence"
        subtitle="Centralized product documentation, FAQs, and AI vector-search RAG engine."
        breadcrumbs={['CRM', 'Knowledge Base']}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>
            New Article
          </Button>
        }
      />

      {/* Embedded "Ask Knowledge Base RAG" Form */}
      <div className="p-6 rounded-3xl border border-ai-200 dark:border-ai-900/60 bg-ai-50/50 dark:bg-ai-950/20 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-ai-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Ask Knowledge RAG Assistant
            </h3>
            <span className="text-[11px] text-slate-500">Retrieval-Augmented Generation query over canonical CRM articles</span>
          </div>
        </div>

        <form onSubmit={handleAskRag} className="flex gap-2">
          <input
            type="text"
            value={ragQuestion}
            onChange={(e) => setRagQuestion(e.target.value)}
            placeholder="Ask a question (e.g. 'How do I set up automated deal assignment rules?')..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-hidden focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={askingRag}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{askingRag ? 'Thinking...' : 'Ask RAG'}</span>
          </button>
        </form>

        {ragAnswer && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-fade-in">
            <span className="text-[10px] font-mono uppercase font-bold text-brand-600 dark:text-brand-400 block">
              Synthesized RAG Response
            </span>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              {ragAnswer.answer || ragAnswer.response || JSON.stringify(ragAnswer)}
            </p>
          </div>
        )}
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Categories ({articles.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category || cat.name}
              onClick={() => setSelectedCategory(cat.category || cat.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === (cat.category || cat.name)
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.category || cat.name} ({cat.count !== undefined ? cat.count : 1})
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search documentation articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No articles found"
          description={query ? `No documentation matching "${query}"` : 'Knowledge base is empty. Publish your first article.'}
          actionLabel="Create Article"
          onAction={() => setIsDrawerOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((art) => (
            <Card key={art.id} className="hover:border-brand-400 transition-colors flex flex-col justify-between p-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-brand-600" />
                    <span>{art.category || 'General'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase text-[9px]">
                    {art.status || 'PUBLISHED'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{art.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.summary || art.content || 'No summary provided.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-brand-600 hover:underline cursor-pointer">
                <span>Read Full Specification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Drawer for Article Creation */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Publish Knowledge Article" size="md">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <Input
            label="Article Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Master Sales Pipeline Workflow Guide"
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. Sales, Onboarding, API"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600">Executive Summary</label>
            <input
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg p-2 text-slate-900 dark:text-slate-100"
              placeholder="Short 1-sentence abstract..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600">Article Content (Markdown)</label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg p-2.5 text-slate-900 dark:text-slate-100 font-mono"
              placeholder="Write full article body text..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Publish Article</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default KnowledgePage;
