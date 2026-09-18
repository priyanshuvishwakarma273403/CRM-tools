import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../services/api';
import { Plus, Search, Building2, Globe, Users, DollarSign, MapPin, Trash2 } from 'lucide-react';

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', industry: '', website: '', employees: 100, annualRevenue: 1000000, city: '', country: 'USA' });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await api.companies.getAll();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Failed to load companies:', e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.companies.create(formData);
    setIsDrawerOpen(false);
    setFormData({ name: '', industry: '', website: '', employees: 100, annualRevenue: 1000000, city: '', country: 'USA' });
    loadCompanies();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    await api.companies.delete(id);
    loadCompanies();
  };

  const filtered = companies.filter((c) =>
    (c.name || '').toLowerCase().includes(query.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Companies Directory"
        subtitle="Accounts, organizations, industry segments, and corporate profiles."
        breadcrumbs={['CRM', 'Companies']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Add Company</Button>}
      />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder="Search company name, industry..." value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No companies found"
          description={query ? `No companies matching "${query}"` : 'Add your first company account to start organizing your B2B relationships.'}
          actionLabel="Add Company"
          onAction={() => setIsDrawerOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => (
            <Card key={comp.id} className="hover:border-brand-400 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 font-black text-xl border border-brand-200">
                      {(comp.name || 'C')[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{comp.name}</h3>
                      <p className="text-xs text-slate-500">{comp.industry || 'General Industry'}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(comp.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {comp.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <a href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                        {comp.website}
                      </a>
                    </div>
                  )}
                  {comp.employees !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp.employees} employees</span>
                    </div>
                  )}
                  {comp.annualRevenue !== undefined && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span>${(Number(comp.annualRevenue) / 1000000).toFixed(1)}M Annual Rev</span>
                    </div>
                  )}
                  {(comp.city || comp.country) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{[comp.city, comp.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create Company" size="md">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
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
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Company</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default CompaniesPage;
