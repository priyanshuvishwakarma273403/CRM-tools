import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Lightbulb,
  BookOpen,
  Code2,
  LayoutGrid,
  Users,
  Tag,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ResourcesScanlineArt } from './ResourcesScanlineArt';

const resourceItems = [
  {
    key: 'why',
    title: 'WHY',
    subtitle: 'The story behind Nexus',
    icon: Lightbulb,
    to: '/why',
    cardTitle: 'Why teams choose Nexus',
    cardDesc: 'The principles and product philosophy behind the open source CRM.',
  },
  {
    key: 'guide',
    title: 'USER GUIDE',
    subtitle: 'Learn how to use Nexus',
    icon: BookOpen,
    to: '/docs',
    cardTitle: 'Nexus User Guide',
    cardDesc: 'Master workflows, shortcuts, pipelines, and workspace settings.',
  },
  {
    key: 'developers',
    title: 'DEVELOPERS',
    subtitle: 'Create apps on Nexus',
    icon: Code2,
    to: '/developers',
    isExternal: true,
    cardTitle: 'Extensible Developer Platform',
    cardDesc: 'REST APIs, webhooks, and headless plugins for enterprise customization.',
  },
  {
    key: 'apps',
    title: 'APPS',
    subtitle: 'Extend your CRM',
    icon: LayoutGrid,
    to: '/apps',
    cardTitle: 'Nexus App Directory',
    cardDesc: 'Connect your tools and extend CRM functionality with zero friction.',
  },
  {
    key: 'partners',
    title: 'PARTNERS',
    subtitle: 'Find a Nexus partner',
    icon: Users,
    to: '/partners',
    cardTitle: 'Certified Partner Network',
    cardDesc: 'Collaborate with trusted implementation specialists and CRM architects.',
  },
  {
    key: 'releases',
    title: 'RELEASES',
    subtitle: "Discover what's new",
    icon: Tag,
    to: '/releases',
    cardTitle: 'Release Changelog',
    cardDesc: 'Continuous bi-weekly deployment of speed, reliability, and new features.',
  },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [activeResourceKey, setActiveResourceKey] = useState('why');
  const timeoutRef = useRef(null);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setResourcesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setResourcesOpen(false);
    }, 150);
  };

  const isDarkPage = location.pathname.startsWith('/why');

  const activeItem =
    resourceItems.find((item) => item.key === activeResourceKey) || resourceItems[0];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-150 ${
        isDarkPage
          ? scrolled
            ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-neutral-800/80 py-2.5 shadow-lg'
            : 'bg-[#0b0c10]/80 backdrop-blur-xs py-3 border-b border-neutral-800/40'
          : scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-neutral-200/90 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
          : 'bg-white/80 backdrop-blur-xs py-3 border-b border-neutral-100/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Badge */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm tracking-tighter shadow-xs transition-colors ${
              isDarkPage
                ? 'bg-white text-black group-hover:bg-neutral-200'
                : 'bg-black text-white group-hover:bg-neutral-800'
            }`}
          >
            <span className="font-mono text-xs font-black tracking-tighter">NX</span>
          </div>
          <span
            className={`font-semibold text-sm tracking-tight hidden sm:inline-block ${
              isDarkPage ? 'text-white' : 'text-neutral-900'
            }`}
          >
            Nexus
          </span>
        </Link>

        {/* Center: Editorial Nav Links */}
        <nav
          className={`hidden md:flex items-center text-[11px] font-semibold tracking-[0.1em] uppercase ${
            isDarkPage ? 'text-neutral-300' : 'text-neutral-800'
          }`}
        >
          <NavLink
            to="/product"
            className={({ isActive }) =>
              `relative px-3 py-1 transition-colors ${
                isDarkPage
                  ? isActive
                    ? 'text-white after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-blue-500'
                    : 'text-neutral-400 hover:text-white'
                  : isActive
                  ? 'text-black after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-blue-600'
                  : 'text-neutral-600 hover:text-black'
              }`
            }
          >
            Product
          </NavLink>

          <span
            className={`mx-1 select-none font-light ${
              isDarkPage ? 'text-neutral-700' : 'text-neutral-300'
            }`}
          >
            |
          </span>

          {/* Resources Dropdown (Twenty.com Mega-Menu) */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className={`flex items-center gap-1 px-3 py-1 uppercase transition-colors cursor-pointer ${
                resourcesOpen
                  ? 'text-blue-500 font-bold'
                  : isDarkPage
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <span>Resources</span>
              {resourcesOpen ? (
                <ChevronUp className="w-3 h-3 text-blue-500" />
              ) : (
                <ChevronDown
                  className={`w-3 h-3 ${isDarkPage ? 'text-neutral-500' : 'text-neutral-400'}`}
                />
              )}
            </button>

            {/* Hover Popover Card (media_1788610464956.png) */}
            {resourcesOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[620px] bg-white rounded-2xl border border-neutral-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-3.5 z-50 flex gap-3 animate-in fade-in zoom-in-95 duration-150 normal-case tracking-normal text-left"
              >
                {/* Left: 6 Resource Items */}
                <div className="w-[280px] flex flex-col gap-0.5">
                  {resourceItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeResourceKey === item.key;
                    return (
                      <Link
                        key={item.key}
                        to={item.to}
                        onMouseEnter={() => setActiveResourceKey(item.key)}
                        onClick={() => setResourcesOpen(false)}
                        className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 ${
                          isSelected
                            ? 'bg-neutral-100/90 text-neutral-900 shadow-xs'
                            : 'hover:bg-neutral-50/80 text-neutral-700'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-white text-blue-600 shadow-2xs border border-neutral-200/60'
                              : 'text-neutral-400 group-hover:text-neutral-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-900">
                              {item.title}
                            </span>
                            {item.isExternal && (
                              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 font-normal leading-tight mt-0.5 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Right: Interactive Scanline Preview Card */}
                <div className="w-[310px] flex flex-col bg-neutral-50/80 rounded-xl p-3 border border-neutral-100/90">
                  <div className="h-[150px] w-full rounded-lg overflow-hidden relative shadow-xs">
                    <ResourcesScanlineArt activeKey={activeResourceKey} />
                  </div>
                  <div className="mt-3 px-1">
                    <h4 className="text-xs font-bold text-neutral-900 tracking-tight">
                      {activeItem.cardTitle}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-normal mt-1 leading-relaxed">
                      {activeItem.cardDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <span
            className={`mx-1 select-none font-light ${
              isDarkPage ? 'text-neutral-700' : 'text-neutral-300'
            }`}
          >
            |
          </span>

          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `relative px-3 py-1 transition-colors ${
                isDarkPage
                  ? isActive
                    ? 'text-white after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-blue-500'
                    : 'text-neutral-400 hover:text-white'
                  : isActive
                  ? 'text-black after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-blue-600'
                  : 'text-neutral-600 hover:text-black'
              }`
            }
          >
            Customers
          </NavLink>

          <span
            className={`mx-1 select-none font-light ${
              isDarkPage ? 'text-neutral-700' : 'text-neutral-300'
            }`}
          >
            |
          </span>

          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `px-3 py-1 transition-colors ${
                isDarkPage
                  ? isActive
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white'
                  : isActive
                  ? 'text-black'
                  : 'text-neutral-600 hover:text-black'
              }`
            }
          >
            Pricing
          </NavLink>
        </nav>

        {/* Right: Community Counters & Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* GitHub Star Badge */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold transition-colors ${
              isDarkPage
                ? 'text-neutral-300 hover:text-white'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>56.3K</span>
            <ArrowUpRight
              className={`w-3 h-3 ${isDarkPage ? 'text-neutral-500' : 'text-neutral-400'}`}
            />
          </a>

          {/* Discord Counter Badge */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold transition-colors ${
              isDarkPage
                ? 'text-neutral-300 hover:text-white'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>7.2K</span>
            <ArrowUpRight
              className={`w-3 h-3 ${isDarkPage ? 'text-neutral-500' : 'text-neutral-400'}`}
            />
          </a>

          {/* Log In Button */}
          {isAuthenticated ? (
            <Link
              to="/app"
              className={`px-4 py-1.5 rounded-md border text-[11px] font-bold tracking-wider uppercase transition-colors ${
                isDarkPage
                  ? 'border-neutral-700 text-white hover:bg-neutral-800'
                  : 'border-neutral-900 text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-1.5 rounded-md border text-[11px] font-bold tracking-wider uppercase transition-colors ${
                isDarkPage
                  ? 'border-neutral-700 text-white hover:bg-neutral-800'
                  : 'border-neutral-900 text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Log in
            </Link>
          )}

          {/* Get Started Button */}
          <Link
            to={isAuthenticated ? '/app' : '/login'}
            style={{
              clipPath:
                'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)',
            }}
            className={`px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-colors shadow-xs ${
              isDarkPage
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg ${
            isDarkPage
              ? 'text-neutral-300 hover:bg-neutral-800'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-[52px] bg-black/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden fixed top-[52px] left-0 right-0 z-50 max-h-[calc(100dvh-52px)] overflow-y-auto overscroll-contain shadow-2xl border-b transition-all animate-in slide-in-from-top-2 duration-200 ${
            isDarkPage
              ? 'bg-[#0b0c10]/98 text-white border-neutral-800 backdrop-blur-xl'
              : 'bg-white/98 text-neutral-900 border-neutral-200 backdrop-blur-xl'
          }`}
        >
          <div className="px-4 py-5 space-y-5">
            {/* Top Primary Navigation Links */}
            <div>
              <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold mb-2">
                MAIN NAVIGATION
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Product', to: '/product' },
                  { name: 'Customers', to: '/customers' },
                  { name: 'Pricing', to: '/pricing' },
                  { name: 'About', to: '/about' },
                ].map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        isActive
                          ? isDarkPage
                            ? 'bg-neutral-800 text-white font-bold'
                            : 'bg-neutral-900 text-white font-bold'
                          : isDarkPage
                          ? 'bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800'
                          : 'bg-neutral-50 text-neutral-800 hover:bg-neutral-100 border border-neutral-150'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Platform Resources - 6 Structured Cards */}
            <div className={`pt-3 border-t ${isDarkPage ? 'border-neutral-800' : 'border-neutral-100'}`}>
              <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold mb-2.5">
                PLATFORM RESOURCES
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resourceItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.key}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                        isActive
                          ? isDarkPage
                            ? 'bg-blue-950/40 border border-blue-800/60 text-white'
                            : 'bg-blue-50/70 border border-blue-200 text-neutral-900'
                          : isDarkPage
                          ? 'bg-neutral-900/40 hover:bg-neutral-800/80 border border-neutral-800/60 text-neutral-300'
                          : 'bg-neutral-50/70 hover:bg-neutral-100 border border-neutral-200/60 text-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : isDarkPage
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-white text-neutral-600 shadow-2xs border border-neutral-200/80'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {item.title}
                          </span>
                          {item.isExternal && (
                            <ArrowUpRight className="w-3 h-3 opacity-60" />
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 normal-case leading-tight truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Links / Ecosystem */}
            <div className={`pt-3 border-t ${isDarkPage ? 'border-neutral-800' : 'border-neutral-100'}`}>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                <Link
                  to="/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 px-2 rounded-lg transition-colors ${
                    isDarkPage ? 'hover:text-white bg-neutral-900/50' : 'hover:text-neutral-900 bg-neutral-50'
                  }`}
                >
                  Trust Center
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 px-2 rounded-lg transition-colors ${
                    isDarkPage ? 'hover:text-white bg-neutral-900/50' : 'hover:text-neutral-900 bg-neutral-50'
                  }`}
                >
                  Contact
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1.5 px-2 rounded-lg transition-colors ${
                    isDarkPage ? 'hover:text-white bg-neutral-900/50' : 'hover:text-neutral-900 bg-neutral-50'
                  }`}
                >
                  Privacy
                </Link>
              </div>
            </div>

            {/* GitHub & Discord Social Proof */}
            <div className={`pt-3 border-t flex items-center justify-between ${isDarkPage ? 'border-neutral-800' : 'border-neutral-100'}`}>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDarkPage ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>56.3K stars</span>
                </a>

                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDarkPage ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span>7.2K</span>
                </a>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">v2.4.0</span>
            </div>

            {/* Action CTA Buttons */}
            <div className={`pt-3 border-t ${isDarkPage ? 'border-neutral-800' : 'border-neutral-100'}`}>
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-center py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${
                      isDarkPage
                        ? 'border-neutral-700 text-white hover:bg-neutral-800'
                        : 'border-neutral-800 text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      clipPath:
                        'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)',
                    }}
                    className={`text-center py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-colors ${
                      isDarkPage
                        ? 'bg-white text-black hover:bg-neutral-200'
                        : 'bg-black text-white hover:bg-neutral-800'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors ${
                    isDarkPage ? 'bg-white text-black' : 'bg-black text-white'
                  }`}
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
