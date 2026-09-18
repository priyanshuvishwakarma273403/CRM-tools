import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Drawer } from '../../components/ui/Drawer';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../services/api';
import { Plus, Search, Mail, Phone, Building, Trash2 } from 'lucide-react';

export const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', designation: '', companyName: '' });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await api.contacts.getAll();
      setContacts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Failed to load contacts:', e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.contacts.create({
      ...formData,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });
    setIsDrawerOpen(false);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', designation: '', companyName: '' });
    loadContacts();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    await api.contacts.delete(id);
    loadContacts();
  };

  const getContactName = (c) => {
    if (c.name) return c.name;
    return `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unnamed Contact';
  };

  const filtered = contacts.filter((c) => {
    const name = getContactName(c).toLowerCase();
    const company = (c.companyName || c.company || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const q = query.toLowerCase();
    return name.includes(q) || company.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Contacts Directory"
        subtitle="Individual customer contacts, stakeholders, and decision makers."
        breadcrumbs={['CRM', 'Contacts']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsDrawerOpen(true)}>Add Contact</Button>}
      />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder="Search contact name, company, email..." value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No contacts found"
          description={query ? `No contacts matching "${query}"` : 'Add your first customer contact to start tracking relationships.'}
          actionLabel="Add Contact"
          onAction={() => setIsDrawerOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contact) => (
            <Card key={contact.id} className="hover:border-brand-400 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={getContactName(contact)} size="lg" />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{getContactName(contact)}</h3>
                      <p className="text-xs text-slate-500">{contact.designation || 'Key Decision Maker'}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(contact.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{contact.companyName || contact.company || 'Direct Contact'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.phone || 'No phone'}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Create Contact" size="md">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <Input label="Last Name" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <Input label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Input label="Designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
          <Input label="Company Name" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Contact</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default ContactsPage;
