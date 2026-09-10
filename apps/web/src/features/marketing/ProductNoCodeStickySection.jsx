import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Zap,
  Layout,
  Building,
  Users,
  Briefcase,
  Layers,
  Filter,
  Search,
  Sparkles,
  Mail,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  ChevronDown,
  ArrowRight,
  Workflow,
  Clock,
} from 'lucide-react';

/** Background scanline ribs for the dark no-code canvas */
const ScanlineGrid = () => (
  <svg className="w-full h-full absolute inset-0 select-none pointer-events-none opacity-20" viewBox="0 0 600 480" fill="none">
    {Array.from({ length: 40 }).map((_, i) => (
      <line
        key={i}
        x1={10}
        y1={12 + i * 12}
        x2={590}
        y2={12 + i * 12}
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeDasharray={i % 3 === 0 ? '16 6 28 6' : '6 4'}
      />
    ))}
  </svg>
);

export const ProductNoCodeStickySection = () => {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  // Measure scroll progress through the 300vh container
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      // Progress from 0 (when top hits top-0) to 1 (when bottom hits bottom of viewport)
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));

      if (progress < 0.35) {
        setActiveStep(0);
      } else if (progress < 0.70) {
        setActiveStep(1);
      } else {
        setActiveStep(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth jump to specific step on click
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

  return (
    <div ref={containerRef} className="relative h-[290vh] bg-white select-none">
      {/* Pinned Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle & Step Navigation */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Tag Badge */}
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-neutral-500 mb-4">
                <span className="w-3.5 h-[2px] bg-blue-600 inline-block" />
                <span className="text-neutral-700 font-sans uppercase font-bold text-xs tracking-wider">
                  Customization
                </span>
              </div>

              {/* Editorial Serif Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] mb-4">
                Go the extra mile<br />with no-code
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 font-sans max-w-md leading-relaxed mb-8">
                Need a quick change? Skip the engineering ticket. Customize your workspace in minutes.
              </p>

              {/* Step Timeline Controls */}
              <div className="flex items-start gap-6">
                {/* Vertical Timeline Indicator (01, 02, 03) */}
                <div className="flex flex-col items-center gap-4 pt-1">
                  {/* Step 1 Indicator */}
                  <div className="flex flex-col items-center">
                    {activeStep === 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-blue-600">01</span>
                        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block" />
                      </div>
                    ) : (
                      <button
                        onClick={() => scrollToStep(0)}
                        className="w-2 h-2 rounded-full bg-neutral-300 hover:bg-neutral-500 transition-colors my-1 cursor-pointer"
                        title="Go to Step 01"
                      />
                    )}
                  </div>

                  {/* Step 2 Indicator */}
                  <div className="flex flex-col items-center">
                    {activeStep === 1 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-blue-600">02</span>
                        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block" />
                      </div>
                    ) : (
                      <button
                        onClick={() => scrollToStep(1)}
                        className="w-2 h-2 rounded-full bg-neutral-300 hover:bg-neutral-500 transition-colors my-1 cursor-pointer"
                        title="Go to Step 02"
                      />
                    )}
                  </div>

                  {/* Step 3 Indicator */}
                  <div className="flex flex-col items-center">
                    {activeStep === 2 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-blue-600">03</span>
                        <span className="w-1 h-7 bg-blue-600 rounded-full inline-block" />
                      </div>
                    ) : (
                      <button
                        onClick={() => scrollToStep(2)}
                        className="w-2 h-2 rounded-full bg-neutral-300 hover:bg-neutral-500 transition-colors my-1 cursor-pointer"
                        title="Go to Step 03"
                      />
                    )}
                  </div>
                </div>

                {/* Step Text Buttons */}
                <div className="space-y-6 flex-1">
                  {/* Step 01: Data model */}
                  <button
                    onClick={() => scrollToStep(0)}
                    className={`w-full text-left transition-all cursor-pointer flex items-start gap-3.5 group ${
                      activeStep === 0 ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
                        activeStep === 0 ? 'bg-blue-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 tracking-tight">
                        Data model
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5 font-sans">
                        Add objects and fields
                      </div>
                    </div>
                  </button>

                  {/* Step 02: Automation */}
                  <button
                    onClick={() => scrollToStep(1)}
                    className={`w-full text-left transition-all cursor-pointer flex items-start gap-3.5 group ${
                      activeStep === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
                        activeStep === 1 ? 'bg-blue-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 tracking-tight">
                        Automation
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5 font-sans">
                        Create a workflow
                      </div>
                    </div>
                  </button>

                  {/* Step 03: Layout */}
                  <button
                    onClick={() => scrollToStep(2)}
                    className={`w-full text-left transition-all cursor-pointer flex items-start gap-3.5 group ${
                      activeStep === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
                        activeStep === 2 ? 'bg-blue-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 tracking-tight">
                        Layout
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5 font-sans">
                        Tailor record pages, menus, and views
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Giant Chamfered Dark Container with Animated Canvas */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 62%, 14px 57%, 14px 43%, 0 38%)',
                }}
                className="w-full h-[460px] sm:h-[520px] rounded-2xl border border-neutral-800 bg-[#0e0e11] relative overflow-hidden shadow-2xl p-4 sm:p-8 flex items-center justify-center"
              >
                {/* Scanline background */}
                <ScanlineGrid />

                <AnimatePresence mode="wait">
                  {/* ========================================================= */}
                  {/* STEP 01: DATA MODEL (ER Diagram) */}
                  {/* ========================================================= */}
                  {activeStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="w-full h-full relative z-10 flex items-center justify-center"
                    >
                      {/* SVG Relationship Connector Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-neutral-700/80 stroke-1">
                        {/* People to Companies */}
                        <path d="M 210 90 L 320 90" fill="none" />
                        {/* Companies to Opportunities */}
                        <path d="M 370 120 L 370 200" fill="none" />
                        {/* People to Employment History */}
                        <path d="M 150 120 L 150 240" fill="none" />
                        {/* Employment History to Demos */}
                        <path d="M 210 270 L 320 330" fill="none" />
                      </svg>

                      {/* Node 1: People · 840 (Top Left) */}
                      <div className="absolute top-6 sm:top-8 left-4 sm:left-10 w-40 sm:w-44 p-3 rounded-xl border border-neutral-200/90 bg-white shadow-lg text-xs space-y-1">
                        <div className="font-bold text-neutral-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-600" /> People</span>
                          <span className="text-[10px] font-mono text-neutral-400">840</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 pl-5">🏢 Company</div>
                        <div className="text-[11px] text-neutral-600 pl-5">💼 Opportunities</div>
                        <div className="text-[10px] text-neutral-400 pl-5 pt-1 border-t border-neutral-100">22 fields</div>
                      </div>

                      {/* Node 2: Companies · 120 (Top Right) */}
                      <div className="absolute top-6 sm:top-8 right-4 sm:right-10 w-40 sm:w-44 p-3 rounded-xl border border-neutral-200/90 bg-white shadow-lg text-xs space-y-1">
                        <div className="font-bold text-neutral-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-blue-600" /> Companies</span>
                          <span className="text-[10px] font-mono text-neutral-400">120</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 pl-5">👥 People</div>
                        <div className="text-[11px] text-neutral-600 pl-5">💼 Opportunities</div>
                        <div className="text-[10px] text-neutral-400 pl-5 pt-1 border-t border-neutral-100">39 fields</div>
                      </div>

                      {/* Node 3: Opportunities · 64 (Middle Right) */}
                      <div className="absolute top-44 sm:top-48 right-4 sm:right-10 w-40 sm:w-44 p-3 rounded-xl border border-neutral-200/90 bg-white shadow-lg text-xs space-y-1">
                        <div className="font-bold text-neutral-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-blue-600" /> Opportunities</span>
                          <span className="text-[10px] font-mono text-neutral-400">64</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 pl-5">🏢 Company</div>
                        <div className="text-[11px] text-neutral-600 pl-5">👤 Point of Contact</div>
                        <div className="text-[10px] text-neutral-400 pl-5 pt-1 border-t border-neutral-100">11 fields</div>
                      </div>

                      {/* Node 4: Employment History · 48 (Middle Left) */}
                      <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-10 w-40 sm:w-44 p-3 rounded-xl border border-neutral-200/90 bg-white shadow-lg text-xs space-y-1">
                        <div className="font-bold text-neutral-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-purple-600" /> Employment</span>
                          <span className="text-[10px] font-mono text-neutral-400">48</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 pl-5">🏢 Company</div>
                        <div className="text-[11px] text-neutral-600 pl-5">👤 Person</div>
                        <div className="text-[10px] text-neutral-400 pl-5 pt-1 border-t border-neutral-100">8 fields</div>
                      </div>

                      {/* Node 5: Demos · 45 (Bottom Center/Right) */}
                      <div className="absolute bottom-6 sm:bottom-8 right-16 sm:right-24 w-40 sm:w-44 p-3 rounded-xl border border-neutral-200/90 bg-white shadow-lg text-xs space-y-1">
                        <div className="font-bold text-neutral-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-600" /> Demos</span>
                          <span className="text-[10px] font-mono text-neutral-400">45</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 pl-5">🏢 Company</div>
                        <div className="text-[11px] text-neutral-600 pl-5">💼 Opportunity</div>
                        <div className="text-[10px] text-neutral-400 pl-5 pt-1 border-t border-neutral-100">6 fields</div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================= */}
                  {/* STEP 02: AUTOMATION (Workflow Builder) */}
                  {/* ========================================================= */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="w-full max-w-md mx-auto z-10 flex flex-col items-center space-y-3.5"
                    >
                      {/* Node 1: Trigger */}
                      <div className="w-56 p-2.5 rounded-lg border border-neutral-700 bg-neutral-900 text-white flex items-center gap-2.5 shadow-sm text-xs">
                        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[10px]">
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="text-[9px] text-neutral-400 uppercase font-mono">Trigger</div>
                          <div className="font-semibold text-[11px]">Record is Created</div>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      <div className="w-[2px] h-4 bg-neutral-700" />

                      {/* Node 2: Filter */}
                      <div className="w-56 p-2.5 rounded-lg border border-neutral-700 bg-neutral-900 text-white flex items-center gap-2.5 shadow-sm text-xs">
                        <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400">
                          <Filter className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="text-[9px] text-neutral-400 uppercase font-mono">Action</div>
                          <div className="font-semibold text-[11px]">Filter</div>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      <div className="w-[2px] h-4 bg-neutral-700" />

                      {/* Node 3: Search Records */}
                      <div className="w-56 p-2.5 rounded-lg border border-neutral-700 bg-neutral-900 text-white flex items-center gap-2.5 shadow-sm text-xs">
                        <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400">
                          <Search className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="text-[9px] text-neutral-400 uppercase font-mono">Action</div>
                          <div className="font-semibold text-[11px]">Search Records</div>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      <div className="w-[2px] h-4 bg-neutral-700" />

                      {/* Node 4: AI Agent */}
                      <div className="w-56 p-2.5 rounded-lg border border-pink-500/80 bg-neutral-900 text-white flex items-center gap-2.5 shadow-md shadow-pink-500/10 text-xs">
                        <div className="w-5 h-5 rounded bg-pink-600 flex items-center justify-center text-[10px]">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="text-[9px] text-pink-400 uppercase font-mono">Action</div>
                          <div className="font-semibold text-[11px] text-pink-200">AI Agent</div>
                        </div>
                      </div>

                      {/* Branching SVG Lines */}
                      <svg className="w-72 h-6 stroke-neutral-700 stroke-2 fill-none overflow-visible">
                        <path d="M 144 0 L 144 12 L 40 12 L 40 24" />
                        <path d="M 144 0 L 144 24" />
                        <path d="M 144 0 L 144 12 L 248 12 L 248 24" />
                      </svg>

                      {/* Child Branch Action Cards */}
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <div className="p-2 rounded border border-neutral-800 bg-neutral-900 text-center text-white">
                          <RefreshCw className="w-3 h-3 mx-auto text-neutral-400 mb-1" />
                          <div className="text-[9px] text-neutral-400 uppercase font-mono">Action</div>
                          <div className="text-[10px] font-medium truncate">Update Record</div>
                        </div>

                        <div className="p-2 rounded border border-neutral-800 bg-neutral-900 text-center text-white">
                          <Mail className="w-3 h-3 mx-auto text-neutral-400 mb-1" />
                          <div className="text-[9px] text-neutral-400 uppercase font-mono">Action</div>
                          <div className="text-[10px] font-medium truncate">Send Email</div>
                        </div>

                        <div className="p-2 rounded border border-neutral-800 bg-neutral-900 text-center text-white">
                          <Plus className="w-3 h-3 mx-auto text-neutral-400 mb-1" />
                          <div className="text-[9px] text-neutral-400 uppercase font-mono">Action</div>
                          <div className="text-[10px] font-medium truncate">Create Record</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================= */}
                  {/* STEP 03: LAYOUT (Layered Windows Customizer) */}
                  {/* ========================================================= */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="w-full h-full relative z-10 flex items-center justify-center"
                    >
                      {/* Back Layer: Workspace Sidebar */}
                      <div className="absolute left-2 sm:left-6 top-8 w-44 p-3 rounded-xl border border-neutral-800 bg-neutral-900/90 text-neutral-400 text-xs shadow-xl space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Workspace
                        </div>
                        <div className="p-1.5 rounded bg-neutral-800 text-white font-medium flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-blue-500" />
                          <span>Companies</span>
                        </div>
                        <div className="p-1 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> People</div>
                        <div className="p-1 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Opportunities</div>
                        <div className="p-1 flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Dashboards</div>
                        <div className="p-1 flex items-center gap-2"><Workflow className="w-3.5 h-3.5" /> Workflows</div>
                      </div>

                      {/* Middle Layer: Record Detail Card */}
                      <div className="absolute left-20 sm:left-28 top-16 w-64 p-4 rounded-xl border border-neutral-700/80 bg-neutral-900 text-white text-xs shadow-2xl space-y-2.5">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <span className="font-semibold text-[11px] text-neutral-300">General</span>
                          <span className="text-[10px] text-blue-400 font-mono">anthropic.com</span>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between text-neutral-400">
                            <span>Account Owner</span>
                            <span className="text-white font-medium">Félix Malfait</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>Address</span>
                            <span className="text-neutral-300 truncate max-w-[120px]">548 Market St, SF</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>ICP</span>
                            <span className="text-emerald-400 font-bold">✓ True</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>Revenue</span>
                            <span className="text-white font-mono">$500,000</span>
                          </div>
                        </div>
                      </div>

                      {/* Front Layer: Fields Layout Editor Modal */}
                      <div className="absolute right-2 sm:right-6 bottom-4 sm:bottom-8 w-72 sm:w-80 p-4 rounded-xl border border-neutral-200 bg-white text-neutral-900 text-xs shadow-2xl space-y-3 z-30">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                            <span className="text-neutral-400">&lt;</span>
                            <span>Fields</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 uppercase font-mono">Layout</span>
                        </div>

                        {/* Editable Field row */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue="General"
                            className="flex-1 px-2.5 py-1 rounded border border-blue-500 text-xs font-semibold text-neutral-900 bg-blue-50/20 outline-none"
                            readOnly
                          />
                          <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-[10px]">
                            Done
                          </button>
                        </div>

                        {/* Toggles List */}
                        <div className="space-y-1.5 text-[11px]">
                          <div className="p-1.5 rounded hover:bg-neutral-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-3 h-3 text-neutral-400" />
                              <span>Account Owner</span>
                              <span className="text-[9px] text-neutral-400 font-mono">Relation</span>
                            </div>
                            <Eye className="w-3.5 h-3.5 text-neutral-500" />
                          </div>

                          <div className="p-1.5 rounded hover:bg-neutral-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-3 h-3 text-neutral-400" />
                              <span>Revenue</span>
                              <span className="text-[9px] text-neutral-400 font-mono">Currency</span>
                            </div>
                            <Eye className="w-3.5 h-3.5 text-neutral-500" />
                          </div>

                          <div className="p-1.5 rounded hover:bg-neutral-50 flex items-center justify-between text-neutral-400">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-3 h-3 text-neutral-300" />
                              <span className="line-through">ICP</span>
                              <span className="text-[9px] text-neutral-400 font-mono">Boolean</span>
                            </div>
                            <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                        </div>

                        <div className="pt-1 border-t border-neutral-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold cursor-pointer">
                          <span>+ Add a Section</span>
                          <span className="text-neutral-400 font-normal text-[10px]">3 fields active</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductNoCodeStickySection;
