import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  Palette,
  Eye,
} from 'lucide-react';
import { DarkPreFooterSection } from './DarkPreFooterSection';

export const HalftoneGeneratorPage = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Studio Controls State
  const [dotSize, setDotSize] = useState(4);
  const [spacing, setSpacing] = useState(12);
  const [amplitude, setAmplitude] = useState(24);
  const [frequency, setFrequency] = useState(1.2);
  const [contrast, setContrast] = useState(0.85);
  const [crtOverlay, setCrtOverlay] = useState(true);
  const [colorTheme, setColorTheme] = useState('blue');
  const [preset, setPreset] = useState('waveform');
  const [copiedCss, setCopiedCss] = useState(false);

  const colorPalettes = {
    blue: {
      name: 'Electric Blue',
      bg: '#0a0b12',
      primary: '#4f46e5',
      accent: '#818cf8',
      glow: 'rgba(99, 102, 241, 0.4)',
    },
    magenta: {
      name: 'Cyber Magenta',
      bg: '#120a10',
      primary: '#f43f5e',
      accent: '#fda4af',
      glow: 'rgba(244, 63, 94, 0.4)',
    },
    emerald: {
      name: 'Emerald Matrix',
      bg: '#08120c',
      primary: '#10b981',
      accent: '#6ee7b7',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    amber: {
      name: 'Sunset Amber',
      bg: '#120f08',
      primary: '#f59e0b',
      accent: '#fde68a',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
    cyan: {
      name: 'Neon Cyan',
      bg: '#071114',
      primary: '#06b6d4',
      accent: '#67e8f9',
      glow: 'rgba(6, 182, 212, 0.4)',
    },
  };

  const applyPreset = (presetName) => {
    setPreset(presetName);
    if (presetName === 'waveform') {
      setDotSize(4);
      setSpacing(12);
      setAmplitude(24);
      setFrequency(1.2);
      setColorTheme('blue');
    } else if (presetName === 'monolith') {
      setDotSize(5);
      setSpacing(10);
      setAmplitude(10);
      setFrequency(0.6);
      setColorTheme('cyan');
    } else if (presetName === 'helix') {
      setDotSize(3);
      setSpacing(8);
      setAmplitude(35);
      setFrequency(2.0);
      setColorTheme('magenta');
    } else if (presetName === 'torus') {
      setDotSize(6);
      setSpacing(16);
      setAmplitude(28);
      setFrequency(1.5);
      setColorTheme('amber');
    }
  };

  // Canvas animation & rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 0.025;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const theme = colorPalettes[colorTheme];

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      const rows = Math.ceil(height / spacing);
      const cols = Math.ceil(width / spacing);

      for (let r = 0; r < rows; r++) {
        const y = r * spacing + spacing / 2;
        const progressY = r / rows;

        for (let c = 0; c < cols; c++) {
          const x = c * spacing + spacing / 2;
          const progressX = c / cols;

          // Wave equation
          let waveOffset = 0;
          if (preset === 'waveform') {
            waveOffset = Math.sin(progressX * Math.PI * 4 * frequency + time) * amplitude;
          } else if (preset === 'monolith') {
            const distFromCenter = Math.abs(progressX - 0.5);
            waveOffset = Math.cos(distFromCenter * Math.PI * 3 + time * 0.8) * amplitude;
          } else if (preset === 'helix') {
            waveOffset = (Math.sin(progressX * 6 + time) + Math.cos(progressY * 6 - time)) * (amplitude / 2);
          } else if (preset === 'torus') {
            const dx = progressX - 0.5;
            const dy = progressY - 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            waveOffset = Math.sin(dist * 12 * frequency - time * 2) * amplitude;
          }

          const distToWave = Math.abs(y - (height / 2 + waveOffset));
          const maxDist = height * 0.45;
          const intensity = Math.max(0, 1 - distToWave / maxDist) * contrast;

          if (intensity > 0.1) {
            const currentRadius = dotSize * intensity;
            const isHighlight = (r + c) % 3 === 0;

            ctx.fillStyle = isHighlight ? theme.accent : theme.primary;
            ctx.globalAlpha = Math.min(1, intensity + 0.2);

            // Render Segment / Dot
            ctx.beginPath();
            ctx.arc(x, y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [dotSize, spacing, amplitude, frequency, contrast, colorTheme, preset]);

  // Export PNG handler
  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nexus-halftone-${preset}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Copy CSS variables
  const copyCss = () => {
    const theme = colorPalettes[colorTheme];
    const css = `--nexus-halftone-bg: ${theme.bg};
--nexus-halftone-primary: ${theme.primary};
--nexus-halftone-accent: ${theme.accent};
--nexus-halftone-dot-size: ${dotSize}px;
--nexus-halftone-spacing: ${spacing}px;`;
    navigator.clipboard.writeText(css);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-neutral-900 pt-24 sm:pt-32">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Creative Studio</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-neutral-900 tracking-tight leading-[1.08] max-w-3xl mx-auto mb-5">
          Nexus Halftone Generator
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Craft custom dithered scanline waveforms, CRT raster patterns, and halftone visuals in real-time. Export as PNG or embed directly in your layouts.
        </p>
      </section>

      {/* 2. Interactive Generator Studio */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Canvas Preview (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div
              ref={containerRef}
              className="w-full h-[440px] sm:h-[500px] rounded-2xl overflow-hidden border border-neutral-800 relative shadow-2xl bg-[#0a0b12]"
            >
              <canvas ref={canvasRef} className="w-full h-full block" />

              {/* CRT Raster Lines Overlay */}
              {crtOverlay && (
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-60" />
              )}

              {/* Corner crosshairs */}
              <div className="absolute top-3 left-3 text-neutral-600 font-mono text-xs select-none">
                +
              </div>
              <div className="absolute top-3 right-3 text-neutral-600 font-mono text-xs select-none">
                +
              </div>
              <div className="absolute bottom-3 left-3 text-neutral-600 font-mono text-xs select-none">
                +
              </div>
              <div className="absolute bottom-3 right-3 text-neutral-600 font-mono text-xs select-none">
                +
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500">PRESETS:</span>
                {['waveform', 'monolith', 'helix', 'torus'].map((p) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-all cursor-pointer ${
                      preset === p
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCss}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                >
                  {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCss ? 'Copied' : 'Copy CSS'}</span>
                </button>

                <button
                  onClick={downloadPNG}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Controls Panel (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Waveform Controls</span>
              </div>
              <button
                onClick={() => applyPreset('waveform')}
                className="text-xs font-mono text-neutral-400 hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>DOT RADIUS</span>
                  <span className="font-bold text-neutral-900">{dotSize}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dotSize}
                  onChange={(e) => setDotSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>GRID SPACING</span>
                  <span className="font-bold text-neutral-900">{spacing}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>AMPLITUDE</span>
                  <span className="font-bold text-neutral-900">{amplitude}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={amplitude}
                  onChange={(e) => setAmplitude(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>FREQUENCY</span>
                  <span className="font-bold text-neutral-900">{frequency}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-700 mb-1">
                  <span>CONTRAST</span>
                  <span className="font-bold text-neutral-900">{Math.round(contrast * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="pt-4 border-t border-neutral-100">
              <label className="text-xs font-mono text-neutral-500 uppercase block mb-3">
                Color Palette
              </label>
              <div className="grid grid-cols-5 gap-2">
                {Object.keys(colorPalettes).map((key) => {
                  const pal = colorPalettes[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setColorTheme(key)}
                      title={pal.name}
                      className={`h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                        colorTheme === key
                          ? 'border-neutral-900 ring-2 ring-blue-500/20 scale-105'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: pal.primary }}
                    />
                  );
                })}
              </div>
            </div>

            {/* CRT Raster Toggle */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-700">CRT RASTER LINES</span>
              <button
                onClick={() => setCrtOverlay(!crtOverlay)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  crtOverlay ? 'bg-blue-600' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                    crtOverlay ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Design Theory Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
            DESIGN PHILOSOPHY
          </div>
          <h2 className="text-3xl font-serif font-normal text-neutral-900 tracking-tight">
            The math behind Nexus scanlines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Harmonic Sine Propagation</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Scanlines are generated by layering multiple offset sinusoidal harmonics, creating an organic wave motion that breathes at 60 FPS.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Spatial Dither Attenuation</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Dot size and opacity modulate in inverse proportion to distance from the waveform center, producing the signature cybernetic halftone gradient.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">CRT Phosphor Emulation</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Micro-pitch horizontal scanline raster masks recreate the warm physical texture of vintage monochrome computer terminals.
            </p>
          </div>
        </div>
      </section>

      {/* Docked Pre-footer */}
      <DarkPreFooterSection />
    </div>
  );
};

export default HalftoneGeneratorPage;
