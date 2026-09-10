import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Drawer } from '../../components/ui/Drawer';
import { api } from '../../services/api';
import { Sliders, Plus, Check } from 'lucide-react';

export const CustomFieldsPage = () => {
  const [fields, setFields] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    moduleName: 'LEAD',
    label: '',
    fieldType: 'TEXT',
    isRequired: false,
    options: '',
  });

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    const data = await api.customFields.getAll();
    setFields(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.customFields.create({
      ...formData,
      fieldName: formData.label.toLowerCase().replace(/\s+/g, '_'),
    });
    setIsDrawerOpen(false);
    loadFields();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Fields Schema Engine"
        subtitle="Extend CRM entity schemas with tenant-specific custom fields without code changes."
        breadcrumbs={['CRM', 'Custom Fields']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Add Custom Field</Button>}
      />

      <div className="bg-white dark:bg-slate-900 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 font-semibold text-xs uppercase">
              <th className="py-3.5 px-4">Entity Module</th>
              <th className="py-3.5 px-4">Field Label</th>
              <th className="py-3.5 px-4">Field Key</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {fields.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-4 px-4"><span className="px-2 py-0.5 text-xs font-bold bg-brand-50 text-brand-700 rounded">{f.moduleName}</span></td>
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">{f.label}</td>
                <td className="py-4 px-4 font-mono text-xs text-slate-500">{f.fieldName}</td>
                <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">{f.fieldType}</td>
                <td className="py-4 px-4 font-bold text-xs">{f.isRequired ? 'YES' : 'NO'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Custom Field Schema" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600">Target Module</label>
            <select
              value={formData.moduleName}
              onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 text-sm rounded-lg p-2"
            >
              <option value="LEAD">Lead</option>
              <option value="CONTACT">Contact</option>
              <option value="COMPANY">Company</option>
              <option value="DEAL">Deal</option>
            </select>
          </div>

          <Input label="Field Label" required value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="e.g. Budget Range" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600">Field Type</label>
            <select
              value={formData.fieldType}
              onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 text-sm rounded-lg p-2"
            >
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="SELECT">Select Dropdown</option>
              <option value="DATE">Date</option>
              <option value="CHECKBOX">Checkbox</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="req"
              checked={formData.isRequired}
              onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
              className="rounded text-brand-600"
            />
            <label htmlFor="req" className="text-sm font-medium text-slate-700 dark:text-slate-300">Required Field</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Custom Field</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
