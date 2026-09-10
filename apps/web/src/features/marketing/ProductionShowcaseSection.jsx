import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, ArrowUpRight } from 'lucide-react';
import { ThreeDitherSphere, ThreeDitherRocket, ThreeDitherCoin } from './ThreeProductionArtifacts';

const caseStudies = [
  {
    company: 'W3villa',
    graphic: <ThreeDitherSphere />,
    title: 'Ship a product on Nexus',
    description:
      'W3villa built W3Grads for AI mock interviews at scale, with Nexus as the operational backbone.',
    positionClass: 'lg:justify-end', // Shifted right
  },
  {
    company: 'AC&T',
    graphic: <ThreeDitherRocket />,
    title: 'Own your CRM end to end',
    description:
      'AC&T replaced a shuttered vendor CRM with self-hosted Nexus and cut CRM costs by more than 90%.',
    positionClass: 'lg:justify-start', // Shifted left
  },
  {
    company: 'NetZero',
    graphic: <ThreeDitherCoin />,
    title: 'Grow with a flexible foundation',
    description:
      'NetZero runs a modular Nexus setup across carbon credits, ag products, and industrial systems.',
    positionClass: 'lg:justify-center', // Centered
  },
];

export const ProductionShowcaseSection = () => {
  const containerRef = useRef(null);
  const [activeCase, setActiveCase] = useState(0);
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

      let caseIdx = 0;
      if (progress < 0.35) {
        caseIdx = 0;
      } else if (progress < 0.70) {
        caseIdx = 1;
      } else {
        caseIdx = 2;
      }

      setActiveCase((prev) => {
        if (prev !== caseIdx) {
          setDirection(caseIdx > prev ? 1 : -1);
        }
        return caseIdx;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCase = (index) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetY = containerTop + (index / 2) * totalScrollable + 10;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const nextCase = () => {
    if (activeCase < caseStudies.length - 1) {
      scrollToCase(activeCase + 1);
    }
  };

  const prevCase = () => {
    if (activeCase > 0) {
      scrollToCase(activeCase - 1);
    }
  };

  const current = caseStudies[activeCase];

  return (
    <div
      ref={containerRef}
      id="in-production"
      className="relative h-[280vh] bg-white select-none"
    >
      {/* Pinned Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 relative py-4 sm:py-6">
          {/* Top Crosshair and Tag */}
          <div className="text-center relative mb-2">
            <span className="text-indigo-400 font-mono text-sm select-none inline-block mb-1.5">+</span>
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <span className="w-2.5 h-2.5 bg-blue-600 inline-block" />
              <span>In production.</span>
            </div>
          </div>

          {/* Main Persistent Title */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-serif text-neutral-900 tracking-tight leading-[1.08]">
              Dev teams power company-wide change with Nexus
            </h2>
          </div>

          {/* Interactive Tabs & Steppers */}
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              {caseStudies.map((item, idx) => (
                <button
                  key={item.company}
                  onClick={() => scrollToCase(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                    activeCase === idx
                      ? 'bg-neutral-900 text-white font-bold shadow-xs'
                      : 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70'
                  }`}
                >
                  <span>{item.company}</span>
                  {activeCase === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                Case <strong>0{activeCase + 1} / 0{caseStudies.length}</strong>
              </span>

              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200/60">
                <button
                  onClick={prevCase}
                  disabled={activeCase === 0}
                  className={`p-1 rounded text-neutral-700 hover:bg-white transition-colors ${
                    activeCase === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer shadow-2xs'
                  }`}
                  title="Previous Case"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={nextCase}
                  disabled={activeCase === caseStudies.length - 1}
                  className={`p-1 rounded text-neutral-700 hover:bg-white transition-colors ${
                    activeCase === caseStudies.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer shadow-2xs'
                  }`}
                  title="Next Case"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Animated Card Container */}
          <div className="relative min-h-[380px] sm:min-h-[420px] flex items-center w-full">
            <div className={`w-full flex ${current.positionClass} transition-all duration-500`}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeCase}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      opacity: 0,
                      y: dir > 0 ? 32 : -32,
                      scale: 0.96,
                    }),
                    center: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                    exit: (dir) => ({
                      opacity: 0,
                      y: dir > 0 ? -32 : 32,
                      scale: 0.96,
                      transition: {
                        duration: 0.22,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full max-w-sm sm:max-w-md relative pt-2.5"
                >
                  {/* Folder tab on top */}
                  <div className="inline-flex items-center px-4 py-1 rounded-t-lg border-t border-l border-r border-neutral-800 bg-neutral-900 text-xs font-bold text-white relative -mb-[1px] z-10 shadow-xs">
                    {current.company}
                  </div>

                  {/* Card Body */}
                  <div className="rounded-b-xl rounded-tr-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-7 flex flex-col justify-between text-white shadow-2xl min-h-[360px] sm:min-h-[380px]">
                    {/* Visual 3D Dither Artwork */}
                    <div className="py-2 my-auto flex items-center justify-center">
                      {current.graphic}
                    </div>

                    {/* Text Content */}
                    <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {current.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        {current.description}
                      </p>

                      <div className="pt-2">
                        <Link
                          to="/login"
                          style={{
                            clipPath:
                              'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
                          }}
                          className="inline-block px-4 py-1.5 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                        >
                          Read the case
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionShowcaseSection;
