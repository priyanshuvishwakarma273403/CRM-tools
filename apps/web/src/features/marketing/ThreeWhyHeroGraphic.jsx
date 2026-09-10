import React, { useEffect, useRef } from 'react';

/**
 * ThreeWhyHeroGraphic
 * Exact reproduction of Twenty's hero scanline artwork from media_1788610888355.png:
 * - Electric blue / indigo horizontal segmented scanline wings flanking the sides.
 * - Prominent central column of pure white horizontal segmented bars.
 * - Smooth breathing wave undulation and interactive cursor tilt.
 */
export const ThreeWhyHeroGraphic = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.025;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const lineCount = 38;
      const lineSpacing = height / lineCount;
      const centerX = width / 2 + mouseRef.current.x * 20;

      // Draw horizontal segmented scanlines
      for (let i = 0; i < lineCount; i++) {
        const y = i * lineSpacing + lineSpacing / 2;
        const progress = i / lineCount;

        // Wave dynamics
        const wave = Math.sin(time + progress * 7) * 8;
        const wave2 = Math.cos(time * 0.8 + progress * 5) * 6;

        // --- 1. Center White Block Column (seen in media_1788610888355.png) ---
        if (progress > 0.18 && progress < 0.88) {
          const centerProg = (progress - 0.18) / 0.7;
          // Pillar width with stepped tapering
          const pillarWidth = 84 + Math.sin(centerProg * Math.PI) * 16;
          const segments = Math.floor(pillarWidth / 6);

          for (let s = 0; s < segments; s++) {
            const barW = 4;
            const barH = 2.4;
            const bx = centerX - pillarWidth / 2 + s * 6;
            const alpha = 0.85 + Math.sin(s * 0.3 + time * 2) * 0.15;

            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.min(1, Math.max(0.4, alpha));
            ctx.fillRect(bx, y - barH / 2, barW, barH);
          }
        }

        // --- 2. Left Electric Blue Wing ---
        if (progress > 0.22 && progress < 0.94) {
          const wingProg = (progress - 0.22) / 0.72;
          const curveL = Math.sin(wingProg * Math.PI) * (width * 0.44) + wave;
          const leftStart = centerX - 60;
          const barCount = Math.floor(curveL / 6);

          for (let s = 0; s < barCount; s++) {
            const bx = leftStart - (barCount - s) * 6;
            if (bx < 8) continue;
            const barW = 4;
            const barH = 2.2;

            // Gradient: indigo to electric violet
            const distFromCenter = (leftStart - bx) / (width * 0.44);
            const isBright = (s + i) % 5 === 0;
            const color = isBright ? '#818cf8' : distFromCenter > 0.6 ? '#3730a3' : '#4f46e5';

            const alpha = (1 - distFromCenter * 0.5) * (0.6 + Math.sin(s * 0.2 + time) * 0.3);
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.min(1, Math.max(0.15, alpha));
            ctx.fillRect(bx, y - barH / 2, barW, barH);
          }
        }

        // --- 3. Right Electric Blue Wing ---
        if (progress > 0.28 && progress < 0.96) {
          const wingProg = (progress - 0.28) / 0.68;
          const curveR = Math.sin(wingProg * Math.PI) * (width * 0.44) + wave2;
          const rightStart = centerX + 60;
          const barCount = Math.floor(curveR / 6);

          for (let s = 0; s < barCount; s++) {
            const bx = rightStart + s * 6;
            if (bx > width - 12) continue;
            const barW = 4;
            const barH = 2.2;

            const distFromCenter = (bx - rightStart) / (width * 0.44);
            const isBright = (s + i) % 4 === 0;
            const color = isBright ? '#818cf8' : distFromCenter > 0.6 ? '#3730a3' : '#4f46e5';

            const alpha = (1 - distFromCenter * 0.5) * (0.6 + Math.cos(s * 0.2 + time * 1.2) * 0.3);
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.min(1, Math.max(0.15, alpha));
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
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-56 sm:h-72 lg:h-80 relative overflow-hidden flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Raster CRT scanline grain effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40" />
    </div>
  );
};

export default ThreeWhyHeroGraphic;
