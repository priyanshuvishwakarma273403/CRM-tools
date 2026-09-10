import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileBottomNav } from './MobileBottomNav';
import { NotificationDrawer } from './NotificationDrawer';
import { CommandPalette } from '../ui/CommandPalette';
import { Drawer } from '../ui/Drawer';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { X } from 'lucide-react';

export const AppLayout = () => {
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [leadForm, setLeadForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    source: 'WEBSITE',
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + N -> Quick Create
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setQuickCreateOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickLeadSubmit = async (e) => {
    e.preventDefault();
    await api.leads.create({
      ...leadForm,
      name: `${leadForm.firstName} ${leadForm.lastName}`,
    });
    setQuickCreateOpen(false);
    setLeadForm({ firstName: '', lastName: '', email: '', phone: '', company: '', source: 'WEBSITE' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      <div className="flex flex-1 overflow-hidden h-screen">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Slide-over Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-slate-900/60" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 bg-white dark:bg-slate-900 h-full shadow-2xl z-10 overflow-y-auto">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold">NexusCRM Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar onOpenQuickCreate={() => setQuickCreateOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenQuickCreate={() => setQuickCreateOpen(true)}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette />

      {/* Global Notifications Slide-over Drawer */}
      <NotificationDrawer />

      {/* Global Quick Create Lead Drawer (Ctrl + N) */}
      <Drawer
        isOpen={quickCreateOpen}
        onClose={() => setQuickCreateOpen(false)}
        title="Quick Create Lead (Ctrl + N)"
        size="md"
      >
        <form onSubmit={handleQuickLeadSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={leadForm.firstName}
              onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              required
              value={leadForm.lastName}
              onChange={(e) => setLeadForm({ ...leadForm, lastName: e.target.value })}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            required
            value={leadForm.email}
            onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={leadForm.phone}
            onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
          />
          <Input
            label="Company"
            value={leadForm.company}
            onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setQuickCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Lead
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
