import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserCheck, Users, Building2, Briefcase, CheckSquare, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenantStore } from '../../store/useTenantStore';

export const CommandPalette = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useTenantStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickActions = [
    { label: 'Go to Leads Pipeline', icon: UserCheck, category: 'Navigation', href: '/leads' },
    { label: 'Go to Sales Pipeline', icon: Briefcase, category: 'Navigation', href: '/deals' },
    { label: 'Go to Companies Directory', icon: Building2, category: 'Navigation', href: '/companies' },
    { label: 'Go to Contacts', icon: Users, category: 'Navigation', href: '/contacts' },
    { label: 'View Tasks', icon: CheckSquare, category: 'Navigation', href: '/tasks' },
    { label: 'View Invoices & Billing', icon: FileText, category: 'Navigation', href: '/invoices' },
  ];

  const searchResults = [
    { type: 'Lead', title: 'Sophia Martine', subtitle: 'Nexus Biotech • VP Digital Transformation', href: '/leads/lead_1' },
    { type: 'Deal', title: 'Apex Global Enterprise CRM Rollout', subtitle: '$185,000 • Proposal Stage', href: '/deals/deal_1' },
    { type: 'Company', title: 'Apex Global Technologies', subtitle: 'FinTech • 450 Employees', href: '/companies/comp_1' },
    { type: 'Contact', title: 'David Kovac', subtitle: 'CTO at Apex Global', href: '/contacts/cont_1' },
    { type: 'Task', title: 'Send revised SLA proposal to Apex Global', subtitle: 'Due tomorrow', href: '/tasks' },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.subtitle.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href) => {
    setCommandPaletteOpen(false);
    setQuery('');
    navigate(href);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-10 border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800 py-3.5 gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Type a command or search leads, deals, contacts, invoices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none text-base"
            />
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {query === '' ? (
              <div className="py-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Navigation
                </div>
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(action.href)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Search Results
                </div>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded uppercase">
                          {item.type}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">{item.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                No matching leads, deals, or contacts found.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
