import React, { useState } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTenantStore } from '../../store/useTenantStore';
import { Building2, Users, Shield, Key, CreditCard, Sliders, Bell } from 'lucide-react';

export const SettingsPage = () => {
  const { currentOrganization } = useTenantStore();
  const [activeTab, setActiveTab] = useState('Organization');

  const tabs = [
    { label: 'Organization', icon: Building2 },
    { label: 'Users & Team', icon: Users },
    { label: 'Roles & RBAC', icon: Shield },
    { label: 'API Keys', icon: Key },
    { label: 'Billing & Plan', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant & Workspace Settings"
        subtitle="Configure organization parameters, team members, security roles, and API integrations."
        breadcrumbs={['CRM', 'Settings']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <Card className="p-2 space-y-1 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.label
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Setting Panel Details */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'Organization' && (
            <Card className="space-y-4 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
                Organization Profile
              </h3>
              <Input label="Organization Name" defaultValue={currentOrganization.name} />
              <Input label="Domain Subdomain" defaultValue={`${currentOrganization.slug}.nexuscrm.io`} disabled />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Default Currency" defaultValue="USD ($)" />
                <Input label="Timezone" defaultValue="America/New_York (EST)" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'Users & Team' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Members & Seat Licenses</h3>
                <Button variant="primary" size="sm">Invite Member</Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Alex Vance</p>
                    <p className="text-xs text-slate-500">admin@acme.com • Admin Role</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Marcus Chen</p>
                    <p className="text-xs text-slate-500">marcus@acme.com • Manager Role</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded">ACTIVE</span>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'API Keys' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Tenant REST API Keys</h3>
                <Button variant="primary" size="sm">Generate Key</Button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between">
                <span>nx_live_9f82a10b492c8172e90f19842</span>
                <Button variant="ghost" size="sm" className="text-brand-400">Copy</Button>
              </div>
            </Card>
          )}

          {activeTab === 'Billing & Plan' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Subscription & Entitlements</h3>
                  <p className="text-xs text-slate-500">Currently on Acme Enterprise Solutions Tier</p>
                </div>
                <span className="px-3 py-1 text-xs font-extrabold bg-brand-50 text-brand-700 rounded-full border border-brand-200 uppercase">
                  ENTERPRISE
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between"><span>User Seats Used:</span><span className="font-bold">5 / 50</span></div>
                <div className="flex justify-between"><span>Storage Storage:</span><span className="font-bold">8.4 GB / 100 GB</span></div>
                <div className="flex justify-between"><span>AI Copilot Tokens:</span><span className="font-bold">Unlimited</span></div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
