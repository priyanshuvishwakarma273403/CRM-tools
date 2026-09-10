import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Monitor, Terminal, Apple, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-900">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base">
                N
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Nexus<span className="text-indigo-400">CRM</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Production-ready multi-tenant CRM SaaS platform engineered with Tauri 2, Rust, React, and Spring Boot for high performance offline-first desktop operations.
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-xs pt-2">
              <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5" /> Windows</span>
              <span className="flex items-center gap-1"><Apple className="w-3.5 h-3.5" /> macOS</span>
              <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> Linux</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/download" className="hover:text-white transition-colors">Desktop Download</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security Architecture</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tenancy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NexusCRM Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400 font-mono text-[11px] border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API v1.0.0 Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
