import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';

/**
 * Top decorative halftone matrix scanline bars
 * Peeking behind the chamfered contour of the white footer
 */
const HalftoneBarPattern = () => (
  <svg className="w-full h-24 select-none pointer-events-none opacity-25" viewBox="0 0 1200 96" fill="none">
    {Array.from({ length: 12 }).map((_, row) => {
      const y = 8 + row * 7.5;
      return (
        <line
          key={row}
          x1={40}
          y1={y}
          x2={1160}
          y2={y}
          stroke="#818cf8"
          strokeWidth="1.8"
          strokeDasharray={row % 2 === 0 ? '6 4 14 4 28 4' : '12 4 4 4 20 4'}
        />
      );
    })}
  </svg>
);

export const Footer = () => {
  return (
    <footer className="w-full relative bg-[#0a0a0c] text-neutral-900 select-none overflow-hidden">
      {/* 1. Background Halftone & Dither Area behind the Chamfered Notch */}
      <div className="w-full pt-4 pb-14 relative overflow-hidden flex items-center justify-center">
        <HalftoneBarPattern />
      </div>

      {/* 2. Main White Footer Card with Signature Chamfered Crown Contour */}
      <div
        className="w-full bg-white relative -mt-10 sm:-mt-14"
        style={{
          clipPath: 'polygon(0 38px, 16% 38px, 20% 0, 80% 0, 84% 38px, 100% 38px, 100% 100%, 0 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-14 pb-12">
          {/* Top Brand Monogram Badge matching 20's square icon */}
          <div className="mb-10">
            <Link to="/" className="inline-block group">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm group-hover:bg-neutral-800 transition-colors">
                <span className="font-mono text-xs font-black tracking-tight">NX</span>
              </div>
            </Link>
          </div>

          {/* 4-Column Grid with Lavender Crosshairs at Column Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 relative border-b border-neutral-200/80 pb-12">
            {/* Column 1: Sitemap */}
            <div className="lg:pr-8 lg:border-r border-neutral-200/80 relative">
              <h4 className="text-xs font-semibold text-neutral-900 mb-5 tracking-tight">
                Sitemap
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-600 font-sans">
                <li><Link to="/" className="hover:text-black transition-colors">Home</Link></li>
                <li><Link to="/product" className="hover:text-black transition-colors">Product</Link></li>
                <li><Link to="/pricing" className="hover:text-black transition-colors">Pricing</Link></li>
                <li><Link to="/customers" className="hover:text-black transition-colors">Customers</Link></li>
                <li><Link to="/partners" className="hover:text-black transition-colors">Partners</Link></li>
                <li><Link to="/why" className="hover:text-black transition-colors">Why Nexus</Link></li>
              </ul>
              {/* Bottom Lavender Crosshair */}
              <span className="absolute -bottom-[57px] left-0 hidden lg:inline text-indigo-400 font-mono text-sm select-none">+</span>
            </div>

            {/* Column 2: Help */}
            <div className="lg:px-8 lg:border-r border-neutral-200/80 relative">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-indigo-400 font-mono text-xs select-none">+</span>
                <h4 className="text-xs font-semibold text-neutral-900 tracking-tight">
                  Help
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-600 font-sans">
                <li><Link to="/developers" className="hover:text-black transition-colors">Developers</Link></li>
                <li><Link to="/docs" className="hover:text-black transition-colors">User Guide</Link></li>
                <li><Link to="/releases" className="hover:text-black transition-colors">Release Notes</Link></li>
                <li><Link to="/halftone" className="hover:text-black transition-colors">Halftone generator</Link></li>
              </ul>
              {/* Bottom Lavender Crosshair */}
              <span className="absolute -bottom-[57px] left-0 hidden lg:inline text-indigo-400 font-mono text-sm select-none">+</span>
            </div>

            {/* Column 3: Legal */}
            <div className="lg:px-8 lg:border-r border-neutral-200/80 relative">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-indigo-400 font-mono text-xs select-none">+</span>
                <h4 className="text-xs font-semibold text-neutral-900 tracking-tight">
                  Legal
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-600 font-sans">
                <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-black transition-colors">Terms and Conditions</Link></li>
                <li><Link to="/trust" className="hover:text-black transition-colors">Trust Center</Link></li>
              </ul>
              {/* Bottom Lavender Crosshair */}
              <span className="absolute -bottom-[57px] left-0 hidden lg:inline text-indigo-400 font-mono text-sm select-none">+</span>
            </div>

            {/* Column 4: Connect & Action Buttons */}
            <div className="lg:pl-8 flex flex-col justify-between relative">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-indigo-400 font-mono text-xs select-none">+</span>
                  <h4 className="text-xs font-semibold text-neutral-900 tracking-tight">
                    Connect
                  </h4>
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-600 font-sans mb-8">
                  <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">LinkedIn</a></li>
                </ul>
              </div>

              {/* Chamfered CTAs matching twenty.com */}
              <div className="space-y-2.5 pt-2">
                <Link
                  to="/contact"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
                  }}
                  className="w-full sm:w-36 py-2 px-4 bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider text-center block transition-colors shadow-xs cursor-pointer"
                >
                  Talk To Us
                </Link>

                <Link
                  to="/login"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
                  }}
                  className="w-full sm:w-36 py-2 px-4 border border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-900 text-[11px] font-bold uppercase tracking-wider text-center block transition-colors shadow-2xs cursor-pointer"
                >
                  Get Started
                </Link>
              </div>

              {/* Bottom Right Lavender Crosshair */}
              <span className="absolute -bottom-[57px] right-0 hidden lg:inline text-indigo-400 font-mono text-sm select-none">+</span>
            </div>
          </div>

          {/* 3. Bottom Row: Copyright + Language Selector + Social Media Links */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            {/* Left: Copyright & Language Selector */}
            <div className="flex items-center gap-5">
              <span className="font-mono text-[11px] text-neutral-600 tracking-wider">
                © 2026 — NEXUS
              </span>

              <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-neutral-200/90 hover:border-neutral-400 bg-white text-[11px] text-neutral-700 transition-colors shadow-2xs cursor-pointer">
                <Globe className="w-3 h-3 text-neutral-500" />
                <span>English</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>
            </div>

            {/* Right: Social Media Icons with Vertical Dividers matching screenshot 3 */}
            <div className="flex items-center text-neutral-700">
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-black transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              <span className="text-neutral-300 font-light mx-2">|</span>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-black transition-colors"
                aria-label="Discord"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>

              <span className="text-neutral-300 font-light mx-2">|</span>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-black transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>

              <span className="text-neutral-300 font-light mx-2">|</span>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-black transition-colors"
                aria-label="X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
