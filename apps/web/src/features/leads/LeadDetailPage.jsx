import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { ActivityTimeline } from '../../components/crm/ActivityTimeline';
import { Avatar } from '../../components/ui/Avatar';
import { api } from '../../services/api';
import {
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Edit,
  ArrowLeft,
  Building,
  UserCheck,
  Star,
  Tag,
  Calendar,
  Briefcase,
  CheckSquare,
} from 'lucide-react';

export const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadLeadData();
  }, [id]);

  const loadLeadData = async () => {
    const l = await api.leads.getById(id);
    setLead(l || {
      id,
      name: 'Sophia Martine',
      firstName: 'Sophia',
      lastName: 'Martine',
      email: 'smartine@nexusbiotech.com',
      phone: '+1 (555) 111-2233',
      company: 'Nexus Biotech',
      jobTitle: 'VP Digital Transformation',
      source: 'WEBSITE',
      status: 'QUALIFIED',
      leadScore: 88,
      ownerName: 'Marcus Chen',
      tags: ['Hot Lead', 'Biotech'],
      notes: 'Requested demo of enterprise workflow automation and HIPAA data isolation guidelines.',
    });

    const allActs = await api.activities.getAll();
    setActivities(allActs);
  };

  if (!lead) return null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate('/leads')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Leads
        </Button>
      </div>

      <PageHeader
        title={lead.name}
        subtitle={`${lead.jobTitle || 'Executive'} at ${lead.company || 'Enterprise Corp'}`}
        breadcrumbs={['CRM', 'Leads', lead.name]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Phone className="w-4 h-4 text-blue-600" />}>
              Call
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Mail className="w-4 h-4 text-purple-600" />}>
              Email
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-600" />}>
              WhatsApp
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Activity
            </Button>
          </div>
        }
      />

      {/* Main 2-Column Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Overview Sidebar */}
        <div className="space-y-6">
          {/* Identity Card */}
          <Card className="text-center">
            <Avatar name={lead.name} size="xl" className="mx-auto mb-3" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{lead.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{lead.jobTitle}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <StatusBadge status={lead.status} />
              <span className="px-2 py-0.5 text-xs font-black bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-md">
                Score: {lead.leadScore}
              </span>
            </div>
          </Card>

          {/* Contact Details */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
              Contact Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Email Address</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{lead.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Phone Number</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{lead.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Company</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{lead.company}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Lead Owner</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{lead.ownerName || 'Marcus Chen'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Lead Source</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{lead.source}</p>
              </div>
            </div>
          </Card>

          {/* Tags & Notes */}
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
              Notes & Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(lead.tags)
                ? lead.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-md">
                      {t}
                    </span>
                  ))
                : (lead.tags || 'Hot Lead').split(',').map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 rounded-md">
                      {t}
                    </span>
                  ))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {lead.notes || 'No custom notes provided for this lead.'}
            </p>
          </Card>
        </div>

        {/* Right Column: Timeline & Related Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Related Deals & Quick Actions */}
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-600" />
                Related Deals
              </h3>
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Convert to Deal
              </Button>
            </div>
            <div className="mt-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Apex Global Enterprise CRM Rollout</p>
                <p className="text-[11px] text-slate-500">Value: $185,000 • Stage: PROPOSAL</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/deals')}>
                View
              </Button>
            </div>
          </Card>

          {/* Activity Stream Timeline */}
          <Card>
            <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Activity Timeline & Log</h3>
              <span className="text-xs text-slate-400 font-medium">Chronological</span>
            </div>
            <ActivityTimeline activities={activities} />
          </Card>
        </div>
      </div>
    </div>
  );
};
