import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Shield, Sparkles, Layers, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('admin@acme.com');
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email || 'admin@acme.com', password || 'password123');
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-2xl shadow-lg mb-2">
            N
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Nexus<span className="text-brand-500">CRM</span></h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise Multi-Tenant SaaS Platform</p>
        </div>

        {/* Demo Helper Callout */}
        <div className="p-3.5 rounded-2xl bg-brand-950/60 border border-brand-800/80 flex items-center justify-between text-xs text-brand-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Try Demo Tenant (Acme Corp)</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors text-[11px]"
          >
            Autofill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            required
            placeholder="admin@acme.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-brand-600 bg-slate-800 border-slate-700" />
              <span>Remember this device</span>
            </label>
            <a href="#" className="text-brand-400 hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3 text-base font-bold">
            Sign In to Nexus Workspace
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          Enforced Tenant Isolation • JWT Security Protocol
        </div>
      </div>
    </div>
  );
};
