import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">Reset Your Password</h1>
          <p className="text-xs text-slate-400">Enter your email and we'll send password reset instructions.</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-300">Reset instructions sent to <span className="font-bold text-white">{email}</span></p>
            <Link to="/login" className="inline-block text-xs font-bold text-indigo-400 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@acme.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            />
            <Button type="submit" variant="primary" className="w-full py-3 font-bold text-xs">
              Send Reset Link
            </Button>
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white pt-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};
