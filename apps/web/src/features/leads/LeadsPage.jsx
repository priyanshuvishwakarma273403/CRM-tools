import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { Avatar } from '../../components/ui/Avatar';
import { Drawer } from '../../components/ui/Drawer';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../services/api';
import {
  Plus,
  Search,
  Download,
  Upload,
  LayoutGrid,
  List,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Star,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    source: 'WEBSITE',
    status: 'NEW',
    score: 75,
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await api.leads.getAll();
      setLeads(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Failed to load leads:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await api.leads.create(formData);
    setIsDrawerOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      jobTitle: '',
      source: 'WEBSITE',
      status: 'NEW',
      score: 75,
    });
    loadLeads();
  };

  const getLeadName = (l) => {
    if (l.name) return l.name;
    if (l.firstName || l.lastName) return `${l.firstName || ''} ${l.lastName || ''}`.trim();
    return 'Unnamed Lead';
  };

  const getCompanyName = (l) => l.companyName || l.company || 'N/A';
  const getScore = (l) => l.score !== undefined ? l.score : (l.leadScore !== undefined ? l.leadScore : 50);

  const filteredLeads = leads.filter((l) => {
    const name = getLeadName(l).toLowerCase();
    const company = getCompanyName(l).toLowerCase();
    const email = (l.email || '').toLowerCase();
    const q = query.toLowerCase();

    const matchesSearch = name.includes(q) || company.includes(q) || email.includes(q);
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedLeadIds.length} lead(s)?`)) return;
    await Promise.all(selectedLeadIds.map((id) => api.leads.delete(id)));
    setSelectedLeadIds([]);
    loadLeads();
  };

  const statuses = ['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'CONVERTED', 'LOST'];

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <PageHeader
        title="Leads Directory"
        subtitle="Manage, qualify, and nurture your inbound & outbound sales leads."
        breadcrumbs={['CRM', 'Leads']}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Filter & View Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Status Filter Tabs */}
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

        {/* Right Search & View Mode Switch */}
        <div className="flex items-center gap-3">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by name, company, email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md cursor-pointer ${viewMode === 'cards' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs' : 'text-slate-400'}`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 rounded-xl text-brand-900 dark:text-brand-100 text-sm font-semibold">
          <span>{selectedLeadIds.length} lead(s) selected</span>
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDeleteSelected}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Leads Content */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={query ? `No leads matching "${query}"` : 'Get started by creating your first sales lead.'}
          actionLabel="Add Lead"
          onAction={() => setIsDrawerOpen(true)}
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
                      className="rounded text-brand-600"
                    />
                  </th>
                  <th className="py-3.5 px-4">Lead Name</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/app/leads/${lead.id}`)}
                  >
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.includes(lead.id)}
                        onChange={() => handleSelectOne(lead.id)}
                        className="rounded text-brand-600"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={getLeadName(lead)} size="sm" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                            {getLeadName(lead)}
                          </div>
                          <div className="text-xs text-slate-500">{lead.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{getCompanyName(lead)}</div>
                      <div className="text-xs text-slate-500">{lead.phone || ''}</div>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={lead.status || 'NEW'} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-black text-brand-600 dark:text-brand-400 text-xs font-mono">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{getScore(lead)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                        {lead.source || 'WEBSITE'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/app/leads/${lead.id}`)}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mobile/Desktop Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <Card
              key={lead.id}
              onClick={() => navigate(`/app/leads/${lead.id}`)}
              className="cursor-pointer hover:border-brand-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={getLeadName(lead)} size="md" />
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{getLeadName(lead)}</h3>
                      <p className="text-xs text-slate-500">{getCompanyName(lead)}</p>
                    </div>
                  </div>
                  <StatusBadge status={lead.status || 'NEW'} />
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.phone || 'No phone'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Source: {lead.source || 'WEBSITE'}</span>
                <span className="px-2 py-0.5 text-xs font-black bg-brand-50 text-brand-600 rounded font-mono">
                  Score: {getScore(lead)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Drawer for Lead Creation */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create New Lead" size="md">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-slate-600">Lead Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg p-2"
              >
                <option value="WEBSITE">Website</option>
                <option value="OUTBOUND">Outbound</option>
                <option value="REFERRAL">Referral</option>
                <option value="EVENT">Event</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-slate-600">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg p-2"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Lead
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default LeadsPage;
