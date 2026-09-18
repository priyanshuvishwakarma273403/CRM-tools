import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../services/api';
import { Plus, Search, LifeBuoy, CheckCircle2, Clock, AlertCircle, MessageSquare, User, Send } from 'lucide-react';

export const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({ subject: '', description: '', priority: 'MEDIUM', customerId: '' });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await api.tickets.getAll();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Failed to load support tickets:', e);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await api.tickets.create(formData);
    setIsDrawerOpen(false);
    setFormData({ subject: '', description: '', priority: 'MEDIUM', customerId: '' });
    loadTickets();
  };

  const handleSelectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const c = await api.tickets.getComments(ticket.id);
      setComments(Array.isArray(c) ? c : []);
    } catch (e) {
      setComments([]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;
    await api.tickets.addComment(selectedTicket.id, { comment: newComment, isInternal: false });
    setNewComment('');
    const c = await api.tickets.getComments(selectedTicket.id);
    setComments(Array.isArray(c) ? c : []);
  };

  const handleStatusChange = async (ticketId, status) => {
    await api.tickets.updateStatus(ticketId, status);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => ({ ...prev, status }));
    }
    loadTickets();
  };

  const filtered = tickets.filter((t) => {
    const subj = (t.subject || t.title || '').toLowerCase();
    const num = (t.ticketNumber || t.id || '').toLowerCase();
    const q = query.toLowerCase();
    const matchesQuery = subj.includes(q) || num.includes(q);
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  const statuses = ['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'RESOLVED', 'CLOSED'];

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Support Tickets Queue"
        subtitle="Omnichannel customer support tickets, SLA tracking, and ticket resolution workflows."
        breadcrumbs={['CRM', 'Support Tickets']}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>
            New Support Ticket
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedStatus === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search ticket number, subject..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No support tickets found"
          description={query ? `No tickets matching "${query}"` : 'Support inbox is clear! Create a ticket when customers submit issues.'}
          actionLabel="Create Ticket"
          onAction={() => setIsDrawerOpen(true)}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">
                      #{t.ticketNumber || t.id?.slice(0, 8)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                        {t.subject || t.title || 'Untitled Ticket'}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{t.description || 'No description'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={t.status || 'OPEN'} />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                        t.priority === 'URGENT' || t.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {t.priority || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      {t.assigneeName || 'Unassigned'}
                    </td>
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="secondary" size="xs" onClick={() => handleSelectTicket(t)}>
                        View Thread
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Thread Side Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto space-y-5 text-left">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400 uppercase">
                  Ticket #{selectedTicket.ticketNumber || selectedTicket.id?.slice(0, 8)}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedTicket.subject || selectedTicket.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status:</span>
                <StatusBadge status={selectedTicket.status || 'OPEN'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedTicket.priority || 'MEDIUM'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                {selectedTicket.description}
              </div>
            </div>

            {/* Change Status Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block uppercase">Update Status</label>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedTicket.id, st)}
                    className={`px-2.5 py-1 rounded-lg border cursor-pointer ${
                      selectedTicket.status === st
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Comments Stream */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                <span>Conversation Log ({comments.length})</span>
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto p-1">
                {comments.length > 0 ? (
                  comments.map((c, i) => (
                    <div key={c.id || i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{c.userName || 'Support Agent'}</span>
                        <span className="text-[10px] font-mono text-slate-400">{c.createdAt ? new Date(c.createdAt).toLocaleTimeString() : 'Just now'}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{c.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic p-3 text-center">No comments logged yet.</div>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type an internal note or reply to customer..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-hidden"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 shrink-0 cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Drawer for Ticket Creation */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create Support Ticket" size="md">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <Input label="Subject / Summary" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Unable to access billing dashboard" />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg p-2"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600">Detailed Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
              placeholder="Provide exact details of the customer ticket..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Support Ticket</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default TicketsPage;
