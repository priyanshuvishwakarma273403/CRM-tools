import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ThreeHelixSculpture } from './ThreeHelixSculpture';

/**
 * Parametric Electric Blue 3D Dither Helix / Spiral Sculpture
 * Renders the twisted ribbon raster graphics seen in the screenshots
 */
const DitherHelix = ({ phase = 0 }) => {
  // 48 horizontal scanlines constructing the 3D twisted helical sculpture
  const linesCount = 48;

  return (
    <svg
      className="w-56 sm:w-64 h-64 sm:h-72 mx-auto select-none"
      viewBox="0 0 200 240"
      fill="none"
    >
      {Array.from({ length: linesCount }).map((_, i) => {
        const y = 16 + i * 4.4;
        const normalizedY = i / (linesCount - 1);

        // Phase angle calculation for rotation
        const angle = normalizedY * Math.PI * 2.3 + phase * (Math.PI * 0.68);

        // Helix center-x and dynamic width profile
        let cx = 100;
        let halfWidth = 0;

        if (phase === 0) {
          // Slide 1/3: Flared top and bottom, pinched twisted waist
          cx = 100 + Math.sin(angle) * 22;
          const pinch = Math.sin(normalizedY * Math.PI);
          halfWidth = 24 + Math.abs(Math.cos(angle)) * (36 - pinch * 12);
        } else if (phase === 1) {
          // Slide 2/3: Asymmetric twisted loop
          cx = 100 + Math.sin(angle + 0.8) * 26;
          halfWidth = 22 + Math.abs(Math.cos(angle * 0.95)) * 34;
        } else {
          // Slide 3/3: Diagonal helical sweep
          cx = 100 + Math.sin(angle + 1.6) * 28;
          halfWidth = 20 + Math.abs(Math.cos(angle * 1.1)) * 36;
        }

        // Texture dither pattern
        const dashPattern =
          i % 4 === 0
            ? '3 2 6 2'
            : i % 3 === 0
            ? '5 2 10 2 2 2'
            : i % 2 === 0
            ? '4 2 8 2'
            : '8 3 4 2';

        return (
          <line
            key={i}
            x1={cx - halfWidth}
            y1={y}
            x2={cx + halfWidth}
            y2={y}
            stroke="#2563eb"
            strokeWidth="2.4"
            strokeDasharray={dashPattern}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        );
      })}
    </svg>
  );
};

const quotesData = [
  {
    quote:
      'The flexibility is really what made the difference. Our needs evolve very fast. I discover a new need and in two clicks I can address it. That is a real advantage when you are moving quickly.',
    author: 'Olivier Reinaud',
    role: 'Co-founder at NetZero',
  },
  {
    quote:
      "We didn't want to patch over the problem. We wanted to build something institutions could rely on at scale, and that meant starting from a foundation solid enough to support the full complexity of what we had in mind.",
    author: 'Amrendra Pratap Singh',
    role: 'VP of Engineering at W3villa Technologies',
  },
  {
    quote:
      'It is just such a nicer experience than dealing with a Salesforce or a HubSpot. My mission has been to get every tool API-accessible, so everything talks to each other. Nexus made that possible in a way older CRM platforms simply do not.',
    author: 'Justin Beadle',
    role: 'Director of Digital and Information, Elevate Consulting',
  },
];

export const CustomerQuotesSection = () => {
  const containerRef = useRef(null);
  const [activeQuote, setActiveQuote] = useState(0);
  const [direction, setDirection] = useState(1);

  // Measure scroll progress through the 280vh container
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));

      let quoteIdx = 0;
      if (progress < 0.35) {
        quoteIdx = 0;
      } else if (progress < 0.70) {
        quoteIdx = 1;
      } else {
        quoteIdx = 2;
      }

      setActiveQuote((prev) => {
        if (prev !== quoteIdx) {
          setDirection(quoteIdx > prev ? 1 : -1);
        }
        return quoteIdx;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToQuote = (index) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetY = containerTop + (index / 2) * totalScrollable + 10;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const nextQuote = () => {
    if (activeQuote < quotesData.length - 1) {
      scrollToQuote(activeQuote + 1);
    }
  };

  const prevQuote = () => {
    if (activeQuote > 0) {
      scrollToQuote(activeQuote - 1);
    }
  };

  const current = quotesData[activeQuote];

  return (
    <div
      ref={containerRef}
      id="customer-quotes"
      className="relative h-[280vh] bg-white select-none"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 text-left relative">
      {/* Outer Border Container */}
      <div className="border border-neutral-200 relative bg-white">
        {/* Top and Bottom Center Crosshairs */}
        <span className="absolute -top-2.5 left-0 sm:left-1/3 -translate-x-1/2 text-indigo-400 font-mono text-sm select-none z-10">
          +
        </span>
        <span className="absolute -bottom-2.5 left-0 sm:left-1/3 -translate-x-1/2 text-indigo-400 font-mono text-sm select-none z-10">
          +
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] sm:min-h-[480px]">
          {/* Left Column: Electric Blue Helix Graphic & Counter */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-200 p-8 sm:p-12 flex flex-col justify-between items-center bg-neutral-50/20">
            <div className="my-auto py-4">
              <ThreeHelixSculpture phase={activeQuote} />
            </div>

            {/* Monospace 1/3, 2/3, 3/3 Counter */}
            <div className="text-3xl sm:text-4xl font-mono text-neutral-900 font-bold tracking-wider select-none">
              {activeQuote + 1}/3
            </div>
          </div>

          {/* Right Column: Tag, Big Impactful Quote, Nav Buttons & Author */}
          <div className="lg:col-span-8 p-8 sm:p-14 flex flex-col justify-between">
            {/* Top Tag */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-8">
              <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
              <span>They are the real sales</span>
            </div>

            {/* Animated Testimonial Quote */}
            <div className="my-auto min-h-[180px] sm:min-h-[200px] flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeQuote}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      opacity: 0,
                      y: dir > 0 ? 32 : -32,
                    }),
                    center: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.38,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                    exit: (dir) => ({
                      opacity: 0,
                      y: dir > 0 ? -32 : 32,
                      transition: {
                        duration: 0.24,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-4"
                >
                  <p className="text-xl sm:text-2xl lg:text-[29px] font-normal text-neutral-900 leading-[1.32] tracking-tight font-sans">
                    {current.quote}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Row: [ ← ] [ → ] Buttons on Left, Author on Right */}
            <div className="pt-8 sm:pt-12 border-t border-neutral-100 flex items-end justify-between gap-4">
              {/* Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevQuote}
                  disabled={activeQuote === 0}
                  className={`w-9 h-9 border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition-colors shadow-2xs ${
                    activeQuote === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  aria-label="Previous quote"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={nextQuote}
                  disabled={activeQuote === quotesData.length - 1}
                  className={`w-9 h-9 border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition-colors shadow-2xs ${
                    activeQuote === quotesData.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  aria-label="Next quote"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Author & Organization */}
              <div className="text-right">
                <div className="text-sm font-bold text-neutral-900 font-sans">
                  {current.author}
                </div>
                <div className="text-xs text-neutral-500 font-sans mt-0.5">
                  {current.role}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  );
};
