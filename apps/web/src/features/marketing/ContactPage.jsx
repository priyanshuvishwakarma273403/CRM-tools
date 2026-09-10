import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Building2,
  Clock,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';
import { Card3D } from '../../components/ui/Card3D';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState('Enterprise Sales');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    seats: '10-50 seats',
    message: '',
  });

  const inquiryTypes = [
    'Enterprise Sales',
    'Partnership Network',
    'Migration Consultation',
    'Security & Compliance',
  ];

  const offices = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '548 Market St, Suite 89200, San Francisco, CA 94104',
      phone: '+1 (415) 890-2026',
      hours: '8:00 AM - 6:00 PM PST',
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '100 Bishopsgate, London EC2N 4AG',
      phone: '+44 20 7946 0912',
      hours: '9:00 AM - 6:00 PM GMT',
    },
    {
      city: 'Singapore',
      country: 'Asia-Pacific',
      address: 'Marina Bay Financial Centre Tower 1, Singapore 018981',
      phone: '+65 6789 2026',
      hours: '9:00 AM - 6:00 PM SGT',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Direct Communications</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Talk to the Nexus team
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Whether you need a custom self-hosted quote, advice on migrating away from Salesforce, or want to join our certified partner network, we are here to help.
        </p>

        {/* SLA Guarantee Banner */}
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-mono shadow-xs">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Guaranteed response within 2 business hours for enterprise inquiries</span>
        </div>
      </section>

      {/* 2. Contact Form & Inquiry Type Selector */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card3D maxTilt={4} scale={1.005} className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xs">
          {/* Category Selector Pills */}
          <div className="mb-8">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-3">
              WHAT WOULD YOU LIKE TO DISCUSS?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {inquiryTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInquiryType(type)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
                    inquiryType === type
                      ? 'bg-neutral-900 text-white font-bold shadow-xs'
                      : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-normal text-neutral-900">
                Message Received
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out regarding <strong>{inquiryType}</strong>. A senior solutions architect from our team will contact you at {formData.email || 'your email'} shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-neutral-700 block mb-1.5 font-semibold">
                    YOUR FULL NAME *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-700 block mb-1.5 font-semibold">
                    WORK EMAIL *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-neutral-700 block mb-1.5 font-semibold">
                    COMPANY NAME
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-700 block mb-1.5 font-semibold">
                    TEAM SIZE / SEATS
                  </label>
                  <select
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option>1-5 seats (Starter)</option>
                    <option>10-50 seats (Growing Team)</option>
                    <option>50-250 seats (Mid-Market)</option>
                    <option>250+ seats (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-700 block mb-1.5 font-semibold">
                  HOW CAN WE HELP? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your current CRM setup, timelines, or specific feature requirements..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </Card3D>
      </section>

      {/* 3. Global Offices */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
            GLOBAL LOCATIONS
          </div>
          <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
            Our offices around the world
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offices.map((off, i) => (
            <Card3D
              key={off.city}
              ambientFloat={true}
              floatDelay={i * 200}
              maxTilt={10}
              className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-2xs hover:border-neutral-300 transition-all h-full"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100" style={{ transform: 'translateZ(15px)' }}>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{off.city}</h3>
                  <span className="text-xs text-neutral-500 font-mono">{off.country}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral-600" style={{ transform: 'translateZ(8px)' }}>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{off.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{off.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{off.hours}</span>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default ContactPage;
