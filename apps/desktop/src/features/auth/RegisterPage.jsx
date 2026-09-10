import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, Mail, User, Building, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Authenticate and redirect to onboarding step
    await login(form.email, form.password);
    setIsLoading(false);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-lg mb-2">
            N
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create your NexusCRM Account</h1>
          <p className="text-xs text-slate-400 font-medium">Free 14-day trial • No credit card required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="Alex Vance"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            leftIcon={<User className="w-4 h-4 text-slate-500" />}
          />

          <Input
            label="Work Email"
            type="email"
            required
            placeholder="alex@acme.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
          />

          <Input
            label="Company / Organization Name"
            required
            placeholder="Acme Enterprise Solutions"
            value={form.organizationName}
            onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
            leftIcon={<Building className="w-4 h-4 text-slate-500" />}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3 text-sm font-bold">
            Create Account & Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-bold">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};
