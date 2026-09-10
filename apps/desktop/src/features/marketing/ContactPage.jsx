import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Contact Sales & Support</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Have questions about enterprise deployment, multi-tenant pricing, or custom desktop builds? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
        {/* Contact Form */}
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you for contacting NexusCRM. One of our sales specialists will respond within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Vance"
              />
              <Input
                label="Work Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alex@company.com"
              />
              <Input
                label="Subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Enterprise Desktop Licensing Inquiry"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your sales team size and requirements..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 font-bold">
                Send Message <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6 pt-4">
          <div className="p-6 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-4">
            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-100">Direct Inquiries</h3>
            <div className="space-y-3 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-600" /> sales@nexuscrm.io
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-600" /> +1 (800) 555-NEXUS
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-indigo-600" /> San Francisco, CA & Global
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
