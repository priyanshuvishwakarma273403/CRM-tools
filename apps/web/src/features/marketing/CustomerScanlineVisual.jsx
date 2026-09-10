import React, { useEffect, useRef } from 'react';

/**
 * CustomerScanlineVisual
 * Renders the distinctive cybernetic scanline graphics seen on twenty.com/customers:
 * - Nine Dots: Blue scanlines with 3x3 white dots grid.
 * - Alternative: Magenta/rose scanlines with "Alternative" logo.
 * - NetZero: Golden amber scanlines with "NetZero" logo.
 * - AC&T: Emerald green scanlines with "AC&T" logo.
 * - W3villa: Royal blue scanlines with "W3villa" logo.
 * - Elevate: Lilac/violet scanlines with "Elevate" logo.
 */
export const CustomerScanlineVisual = ({
  variant = 'ninedots',
  primaryColor = '#4f46e5',
  accentColor = '#818cf8',
  logoText = '',
  caseTag = '',
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
      time += 0.03;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Deep dark backdrop
      ctx.fillStyle = '#0c0d14';
      ctx.fillRect(0, 0, width, height);

      const lineCount = 28;
      const lineSpacing = height / lineCount;

      for (let i = 0; i < lineCount; i++) {
        const y = i * lineSpacing + lineSpacing / 2;
        const progress = i / lineCount;

        // Custom curve profiles depending on variant
        let leftWidth = 0;
        let rightWidth = 0;

        if (variant === 'ninedots') {
          // Double sweeping horizontal waves
          const wave = Math.sin(time + progress * 6) * 10;
          leftWidth = (Math.sin(progress * Math.PI) * (width * 0.48)) + wave;
          rightWidth = (Math.sin(progress * Math.PI) * (width * 0.48)) - wave;
        } else {
          // Architectural landscape contours
          const wave = Math.sin(time * 0.9 + progress * 7) * 8;
          leftWidth = Math.max(0, Math.sin(progress * Math.PI * 1.4) * (width * 0.45) + wave);
          rightWidth = Math.max(0, Math.cos(progress * Math.PI * 1.3) * (width * 0.45) - wave);
        }

        // Draw left scanline segments
        if (leftWidth > 0) {
          const segments = Math.floor(leftWidth / 6);
          for (let s = 0; s < segments; s++) {
            const bx = 14 + s * 6;
            if (bx > width - 14) continue;
            const barW = 4;
            const barH = 2.2;
            const isBright = (s + i) % 4 === 0;

            ctx.fillStyle = isBright ? accentColor : primaryColor;
            ctx.globalAlpha = 0.4 + Math.sin(s * 0.3 + time * 1.5) * 0.4;
            ctx.fillRect(bx, y - barH / 2, barW, barH);
          }
        }

        // Draw right scanline segments
        if (rightWidth > 0) {
          const segments = Math.floor(rightWidth / 6);
          for (let s = 0; s < segments; s++) {
            const bx = width - 14 - (segments - s) * 6;
            if (bx < 14) continue;
            const barW = 4;
            const barH = 2.2;
            const isBright = (s + i) % 3 === 0;

            ctx.fillStyle = isBright ? accentColor : primaryColor;
            ctx.globalAlpha = 0.4 + Math.cos(s * 0.3 + time * 1.3) * 0.4;
            ctx.fillRect(bx, y - barH / 2, barW, barH);
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
  }, [variant, primaryColor, accentColor]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[220px] relative overflow-hidden bg-[#0c0d14] flex items-center justify-center select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Center 3x3 Dots for Nine Dots */}
      {variant === 'ninedots' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-black/40 backdrop-blur-xs border border-white/10 shadow-2xl">
            {[...Array(9)].map((_, idx) => (
              <div
                key={idx}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"
                style={{ animationDelay: `${idx * 120}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Center Logo Text for other variants */}
      {logoText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-5 py-2 rounded-xl bg-black/40 backdrop-blur-xs border border-white/10 shadow-2xl">
            <span className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight drop-shadow-md">
              {logoText}
            </span>
          </div>
        </div>
      )}

      {/* Case Tag (Bottom Left) */}
      {caseTag && (
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-neutral-700/60 font-semibold">
            {caseTag}
          </span>
        </div>
      )}

      {/* CRT raster lines overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40" />
    </div>
  );
};

export default CustomerScanlineVisual;
