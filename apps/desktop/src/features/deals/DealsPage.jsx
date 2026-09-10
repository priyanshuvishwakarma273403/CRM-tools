import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { Avatar } from '../../components/ui/Avatar';
import { Drawer } from '../../components/ui/Drawer';
import { api } from '../../services/api';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  DollarSign,
  Calendar,
  Building,
  User,
  MoreVertical,
  Star,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const stages = [
    { code: 'NEW', title: 'New', color: 'border-blue-500' },
    { code: 'QUALIFIED', title: 'Qualified', color: 'border-emerald-500' },
    { code: 'DEMO', title: 'Demo', color: 'border-purple-500' },
    { code: 'PROPOSAL', title: 'Proposal', color: 'border-amber-500' },
    { code: 'NEGOTIATION', title: 'Negotiation', color: 'border-indigo-500' },
    { code: 'WON', title: 'Closed Won', color: 'border-emerald-600' },
    { code: 'LOST', title: 'Closed Lost', color: 'border-rose-500' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    value: 50000,
    stage: 'NEW',
    probability: 50,
    expectedCloseDate: '2026-10-01',
    companyName: '',
    contactName: '',
  });

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    const data = await api.deals.getAll();
    setDeals(data);
  };

  const handleStageChange = async (dealId, newStage) => {
    const updated = await api.deals.updateStage(dealId, newStage);
    loadDeals();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await api.deals.create(formData);
    setIsDrawerOpen(false);
    loadDeals();
  };

  const filteredDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.companyName?.toLowerCase().includes(query.toLowerCase())
  );

  const calculateStageTotal = (stageCode) => {
    return deals
      .filter((d) => d.stage === stageCode)
      .reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Sales Deals Pipeline"
        subtitle="Manage deal pipeline stages, close probabilities, and revenue forecasts."
        breadcrumbs={['CRM', 'Deals']}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>
              New Deal
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search deal name or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs' : 'text-slate-400'}`}
              title="Kanban View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs' : 'text-slate-400'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage.code);
            const totalVal = calculateStageTotal(stage.code);

            return (
              <div
                key={stage.code}
                className="w-72 sm:w-80 shrink-0 bg-slate-100/70 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col max-h-[750px]"
              >
                {/* Stage Header */}
                <div className={`pb-3 mb-3 border-b-2 ${stage.color} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{stage.title}</h3>
                    <span className="text-[11px] font-bold text-slate-500">
                      ${totalVal.toLocaleString()} • {stageDeals.length} deal(s)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, stage: stage.code });
                      setIsDrawerOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageDeals.map((deal) => (
                    <Card
                      key={deal.id}
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      className="cursor-pointer hover:border-brand-500 transition-all p-4 border border-slate-200/80 dark:border-slate-800 shadow-subtle group"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                          {deal.title}
                        </h4>
                      </div>

                      <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5" />
                        <span>{deal.companyName || 'Apex Global'}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          ${Number(deal.value).toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {deal.probability}% Prob
                        </span>
                      </div>

                      {/* Quick Move Select for instant stage switching */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <Avatar name={deal.ownerName || 'Marcus Chen'} size="sm" />
                        <select
                          value={deal.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStageChange(deal.id, e.target.value);
                          }}
                          className="bg-slate-100 dark:bg-slate-800 border-none text-[11px] font-semibold rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          {stages.map((s) => (
                            <option key={s.code} value={s.code}>
                              Move to: {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                      No deals in {stage.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 font-semibold text-xs uppercase">
                <th className="py-3.5 px-4">Deal Title</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Value</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4">Probability</th>
                <th className="py-3.5 px-4">Close Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => navigate(`/deals/${deal.id}`)}>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{deal.title}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">{deal.companyName}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-600">${Number(deal.value).toLocaleString()}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={deal.stage} /></td>
                  <td className="py-3.5 px-4 font-semibold">{deal.probability}%</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{deal.expectedCloseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer for Deal Creation */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create New Deal" size="md">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Deal Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deal Value ($)"
              type="number"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
            <Input
              label="Probability (%)"
              type="number"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <Input
              label="Primary Contact"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Deal</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
