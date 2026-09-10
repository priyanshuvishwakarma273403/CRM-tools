import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Layout,
  Grid,
  Command,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

/** Background architectural scanlines */
const ArchitecturalScanlineBg = () => (
  <svg className="w-full h-full select-none pointer-events-none opacity-40" viewBox="0 0 500 400" fill="none">
    {Array.from({ length: 48 }).map((_, i) => {
      const y = 8 + i * 8.2;
      return (
        <line
          key={i}
          x1={20}
          y1={y}
          x2={480}
          y2={y}
          stroke="#171717"
          strokeWidth="1.6"
          strokeDasharray={i % 4 === 0 ? '18 6 30 6' : i % 2 === 0 ? '8 4' : '12 4 4 4'}
        />
      );
    })}
  </svg>
);

const stepsData = [
  {
    number: '01',
    tabLabel: 'Building blocks',
    title: 'Begin with production-grade building blocks',
    description:
      'Compose your CRM and internal apps with a single extensibility toolkit. Data model, layout, and automation.',
  },
  {
    number: '02',
    tabLabel: 'Rapid iteration',
    title: 'Continue iteration without friction',
    description:
      'Enjoy unlimited customization using the AI coding tools you already love. Adapt your CRM to fit the way your business grows and wins.',
  },
  {
    number: '03',
    tabLabel: 'Full control',
    title: 'Stay in control with our open-source software',
    description:
      "Don't get locked into someone else's ecosystem. Nexus's developer experience looks like normal software, with local setup, real data, live testing, and no proprietary tooling.",
  },
];

export const StickyStepsSection = () => {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
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

      let step = 0;
      if (progress < 0.35) {
        step = 0;
      } else if (progress < 0.70) {
        step = 1;
      } else {
        step = 2;
      }

      setActiveStep((prev) => {
        if (prev !== step) {
          setDirection(step > prev ? 1 : -1);
        }
        return step;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = (index) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetY = containerTop + (index / 2) * totalScrollable + 10;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const goToStep = (index) => {
    scrollToStep(index);
  };

  const nextStep = () => {
    if (activeStep < 2) {
      scrollToStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      scrollToStep(activeStep - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      id="product-steps"
      className="relative h-[280vh] bg-white select-none"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 text-left py-6 relative">
      {/* Top Header: Step Pills & Next/Prev Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-neutral-100 pb-4">
        {/* Step Pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          {stepsData.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => goToStep(idx)}
              className={`group relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeStep === idx
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70'
              }`}
            >
              <span className={activeStep === idx ? 'text-blue-400 font-bold' : 'text-neutral-400'}>
                {s.number}
              </span>
              <span className="hidden sm:inline font-sans text-[11px] tracking-tight">{s.tabLabel}</span>
              {activeStep === idx && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              )}
            </button>
          ))}
        </div>

        {/* Status indicator & Up/Down Steppers */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 hidden md:inline">
            Scroll or tap to switch: <strong className="text-neutral-700">0{activeStep + 1}/03</strong>
          </span>

          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200/60">
            <button
              onClick={prevStep}
              disabled={activeStep === 0}
              className={`p-1 rounded text-neutral-700 hover:bg-white transition-colors ${
                activeStep === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer shadow-2xs'
              }`}
              title="Previous Step"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={nextStep}
              disabled={activeStep === 2}
              className={`p-1 rounded text-neutral-700 hover:bg-white transition-colors ${
                activeStep === 2 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer shadow-2xs'
              }`}
              title="Next Step"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Text) & Right Column (Visual) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Animated Text */}
        <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeStep}
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
                    duration: 0.32,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
                exit: (dir) => ({
                  opacity: 0,
                  y: dir > 0 ? -32 : 32,
                  transition: {
                    duration: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">
                  {stepsData[activeStep].number}
                </span>
                <div className="w-8 h-[1px] bg-neutral-300"></div>
              </div>

              <h2 className="text-4xl sm:text-5xl font-serif text-neutral-900 tracking-tight leading-[1.08]">
                {stepsData[activeStep].title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans pt-2">
                {stepsData[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Visual Preview Card */}
        <div className="lg:col-span-7 relative bg-neutral-100/70 rounded-2xl p-6 sm:p-10 overflow-hidden min-h-[380px] sm:h-[430px] flex items-center justify-center border border-neutral-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="absolute inset-0 z-0">
            <ArchitecturalScanlineBg />
          </div>

          {/* Animated Card Content */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeStep}
                custom={direction}
                variants={{
                  enter: (dir) => ({
                    opacity: 0,
                    y: dir > 0 ? 40 : -40,
                    scale: 0.98,
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
                    y: dir > 0 ? -40 : 40,
                    scale: 0.98,
                    transition: {
                      duration: 0.24,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex justify-center items-center"
              >
                {/* Visual for Step 01: Data model & Layout cards */}
                {activeStep === 0 && (
                  <div className="flex flex-wrap gap-4 items-start justify-center">
                    {/* Data Model Card */}
                    <div className="w-52 sm:w-56 bg-neutral-900 text-white rounded-xl p-4 shadow-xl space-y-3 border border-neutral-800">
                      <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                        <Box className="w-4 h-4 text-emerald-400" />
                        <span>Data model</span>
                      </div>
                      <div className="space-y-2">
                        <div className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-[11px] font-mono tracking-wider flex items-center gap-2 text-neutral-200">
                          <Box className="w-3.5 h-3.5 text-emerald-400" />
                          <span>CUSTOM OBJECT</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-[11px] font-mono tracking-wider flex items-center gap-2 text-neutral-200">
                          <Grid className="w-3.5 h-3.5 text-neutral-400" />
                          <span>CUSTOM FIELDS</span>
                        </div>
                      </div>
                    </div>

                    {/* Layout Card */}
                    <div className="w-52 sm:w-56 bg-neutral-900 text-white rounded-xl p-4 shadow-xl space-y-3 border border-neutral-800">
                      <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                        <Layout className="w-4 h-4 text-purple-400" />
                        <span>Layout</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="px-2.5 py-1.5 rounded-md bg-neutral-800/80 text-[11px] font-mono tracking-wider flex items-center gap-2 text-neutral-300">
                          <Layout className="w-3 h-3 text-purple-400" />
                          <span>VIEWS</span>
                        </div>
                        <div className="px-2.5 py-1.5 rounded-md bg-neutral-800/80 text-[11px] font-mono tracking-wider flex items-center gap-2 text-neutral-300">
                          <Grid className="w-3.5 h-3.5 text-neutral-400" />
                          <span>WIDGETS</span>
                        </div>
                        <div className="px-2.5 py-1.5 rounded-md bg-neutral-800/80 text-[11px] font-mono tracking-wider flex items-center gap-2 text-neutral-300">
                          <Box className="w-3.5 h-3.5 text-neutral-400" />
                          <span>LAYOUT PAGES</span>
                        </div>
                        <div className="px-2.5 py-1.5 rounded-md bg-neutral-800/80 text-[11px] font-mono tracking-wider flex items-center gap-2 text-neutral-300">
                          <Command className="w-3.5 h-3.5 text-neutral-400" />
                          <span>COMMANDS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual for Step 02: AI Agent Prompt Terminal */}
                {activeStep === 1 && (
                  <div className="w-full max-w-md bg-neutral-900 text-white rounded-2xl p-5 shadow-2xl border border-neutral-800 space-y-4">
                    <div className="p-3 bg-neutral-800/90 rounded-xl text-xs text-neutral-200 leading-relaxed border border-neutral-700">
                      Implement a session replay page — table with user, duration, browser, status
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 px-1">
                      <Box className="w-3.5 h-3.5" />
                      <span>
                        Creating <strong className="text-white">sessionReplay</strong> object...
                      </span>
                    </div>

                    <div className="pt-8 flex items-center justify-between border-t border-neutral-800">
                      <span className="text-[11px] font-mono text-neutral-500">Claude 3.7 Sonnet (AI Agent)</span>
                      <button className="w-7 h-7 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-xs hover:bg-neutral-200">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Visual for Step 03: IDE Code Editor */}
                {activeStep === 2 && (
                  <div className="w-full max-w-lg bg-neutral-950 text-neutral-200 rounded-2xl border border-neutral-800 shadow-2xl p-4 font-mono text-[11px] leading-relaxed">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-500 text-[10px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                        <span>session-replay.page.tsx</span>
                      </div>
                      <span className="text-blue-400">TypeScript</span>
                    </div>

                    <pre className="pt-3 overflow-x-auto text-[11px]">
                      <span className="text-neutral-500">// Nexus Custom Object Definition</span>
                      {'\n'}
                      <span className="text-purple-400">import</span> {'{ NexusObject }'}{' '}
                      <span className="text-purple-400">from</span>{' '}
                      <span className="text-emerald-400">&apos;@nexus/crm-core&apos;</span>;{'\n\n'}
                      <span className="text-blue-400">export default function</span>{' '}
                      <span className="text-yellow-300">SessionReplayPage</span>() {'{'}{'\n'}
                      {'  '}
                      <span className="text-purple-400">return</span> ({'\n'}
                      {'    '}
                      <span className="text-yellow-300">&lt;NexusObject</span>
                      {'\n'}
                      {'      '}
                      <span className="text-blue-300">label</span>=
                      <span className="text-emerald-400">&quot;Session Replays&quot;</span>
                      {'\n'}
                      {'      '}
                      <span className="text-blue-300">type</span>=
                      <span className="text-emerald-400">&quot;table&quot;</span>
                      {'\n'}
                      {'      '}
                      <span className="text-blue-300">groupBy</span>=
                      <span className="text-emerald-400">&quot;status&quot;</span>
                      {'\n'}
                      {'    '}&gt;{'\n'}
                      {'      '}&lt;<span className="text-yellow-300">NexusObject.Field</span>{' '}
                      <span className="text-blue-300">name</span>=
                      <span className="text-emerald-400">&quot;name&quot;</span>{' '}
                      <span className="text-blue-300">type</span>=
                      <span className="text-emerald-400">&quot;text&quot;</span> /&gt;{'\n'}
                      {'      '}&lt;<span className="text-yellow-300">NexusObject.Field</span>{' '}
                      <span className="text-blue-300">name</span>=
                      <span className="text-emerald-400">&quot;duration&quot;</span>{' '}
                      <span className="text-blue-300">type</span>=
                      <span className="text-emerald-400">&quot;number&quot;</span> /&gt;{'\n'}
                      {'      '}&lt;<span className="text-yellow-300">NexusObject.Field</span>{' '}
                      <span className="text-blue-300">name</span>=
                      <span className="text-emerald-400">&quot;browser&quot;</span>{' '}
                      <span className="text-blue-300">type</span>=
                      <span className="text-emerald-400">&quot;text&quot;</span> /&gt;{'\n'}
                      {'      '}&lt;<span className="text-yellow-300">NexusObject.Field</span>{' '}
                      <span className="text-blue-300">name</span>=
                      <span className="text-emerald-400">&quot;status&quot;</span>{' '}
                      <span className="text-blue-300">type</span>=
                      <span className="text-emerald-400">&quot;select&quot;</span> /&gt;{'\n'}
                      {'    '}&lt;/<span className="text-yellow-300">NexusObject</span>&gt;{'\n'}
                      {'  '});{'\n'}
                      {'}'}
                    </pre>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
