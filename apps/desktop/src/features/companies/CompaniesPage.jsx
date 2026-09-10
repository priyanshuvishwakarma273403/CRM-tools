import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import { api } from '../../services/api';
import { Plus, Search, Building2, Globe, Users, DollarSign, MapPin } from 'lucide-react';

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', industry: '', website: '', employees: 100, annualRevenue: 1000000, city: '', country: 'USA' });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const data = await api.companies.getAll();
    setCompanies(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.companies.create(formData);
    setIsDrawerOpen(false);
    loadCompanies();
  };

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.industry?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies Directory"
        subtitle="Accounts, organizations, industry segments, and corporate profiles."
        breadcrumbs={['CRM', 'Companies']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Add Company</Button>}
      />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder="Search company name, industry..." value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((comp) => (
          <Card key={comp.id} className="hover:border-brand-400 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 font-black text-xl border border-brand-200">
                {comp.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{comp.name}</h3>
                <p className="text-xs text-slate-500">{comp.industry}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-slate-400" /><a href={comp.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">{comp.website}</a></div>
              <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-slate-400" /><span>{comp.employees} employees</span></div>
              <div className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-slate-400" /><span>${(Number(comp.annualRevenue) / 1000000).toFixed(1)}M Annual Rev</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{comp.city}, {comp.country}</span></div>
            </div>
          </Card>
        ))}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create Company" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Company Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Industry" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
          <Input label="Website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Employees" type="number" value={formData.employees} onChange={(e) => setFormData({ ...formData, employees: e.target.value })} />
            <Input label="Annual Revenue ($)" type="number" value={formData.annualRevenue} onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <Input label="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Company</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
