import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Drawer } from '../../components/ui/Drawer';
import { api } from '../../services/api';
import { Plus, Search, Mail, Phone, Building, UserCheck } from 'lucide-react';

export const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', designation: '', companyName: '' });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const data = await api.contacts.getAll();
    setContacts(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.contacts.create({ ...formData, name: `${formData.firstName} ${formData.lastName}` });
    setIsDrawerOpen(false);
    loadContacts();
  };

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.companyName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts Directory"
        subtitle="Individual customer contacts, stakeholders, and decision makers."
        breadcrumbs={['CRM', 'Contacts']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Add Contact</Button>}
      />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-crm border border-slate-200 dark:border-slate-800 shadow-card flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder="Search contact name, company..." value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((contact) => (
          <Card key={contact.id} className="hover:border-brand-400 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar name={contact.name} size="lg" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{contact.name}</h3>
                <p className="text-xs text-slate-500">{contact.designation}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2"><Building className="w-3.5 h-3.5 text-slate-400" /><span className="font-medium">{contact.companyName}</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /><span>{contact.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /><span>{contact.phone}</span></div>
            </div>
          </Card>
        ))}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create Contact" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <Input label="Last Name" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <Input label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Input label="Designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
          <Input label="Company Name" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Contact</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
