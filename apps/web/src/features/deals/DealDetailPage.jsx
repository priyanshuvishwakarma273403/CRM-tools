import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { ActivityTimeline } from '../../components/crm/ActivityTimeline';
import { api } from '../../services/api';
import { ArrowLeft, Building, DollarSign, Calendar, Star, CheckSquare, FileText, Package, Plus } from 'lucide-react';

export const DealDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDeal();
  }, [id]);

  const loadDeal = async () => {
    const list = await api.deals.getAll();
    const found = list.find((d) => d.id === id) || list[0];
    setDeal(found);
    const allActs = await api.activities.getAll();
    setActivities(allActs);
  };

  if (!deal) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate('/deals')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Deals Pipeline
        </Button>
      </div>

      <PageHeader
        title={deal.title}
        subtitle={`Target Close: ${deal.expectedCloseDate || '2026-09-30'} • Owner: ${deal.ownerName || 'Marcus Chen'}`}
        breadcrumbs={['CRM', 'Deals', deal.title]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={deal.stage} />
            <Button variant="primary" size="sm">
              Edit Deal
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Overview Card */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            Deal Summary
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Total Contract Value</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                ${Number(deal.value).toLocaleString()} USD
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Stage & Probability</span>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={deal.stage} />
                <span className="font-bold text-slate-800 dark:text-slate-200">{deal.probability}%</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Associated Company</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{deal.companyName || 'Apex Global'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Primary Contact</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{deal.contactName || 'David Kovac'}</p>
            </div>
          </div>
        </Card>

        {/* Timeline Stream */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Deal Progress & Timeline</h3>
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Log Meeting
              </Button>
            </div>
            <ActivityTimeline activities={activities} />
          </Card>
        </div>
      </div>
    </div>
  );
};
