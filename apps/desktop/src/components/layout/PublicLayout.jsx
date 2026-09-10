import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../marketing/Navbar';
import { Footer } from '../marketing/Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
