import React, { useEffect, useRef } from 'react';

/**
 * ResourcesScanlineArt
 * Renders the signature Twenty-style digital scanline waveform / graphic
 * seen in the Resources hover mega-menu preview card (media_1788610464956.png).
 */
export const ResourcesScanlineArt = ({ activeKey = 'why' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const width = 280;
    const height = 150;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const lineCount = 28;
    const lineSpacing = height / lineCount;

    const render = () => {
      time += 0.035;
      ctx.clearRect(0, 0, width, height);

      // Deep dark background
      ctx.fillStyle = '#0c0d14';
      ctx.fillRect(0, 0, width, height);

      // Draw horizontal digital segmented scanlines
      for (let i = 0; i < lineCount; i++) {
        const y = i * lineSpacing + lineSpacing / 2;
        const progress = i / lineCount;

        // Shape curves to create digital landmass / wave structure
        let leftWidth = 0;
        let rightWidth = 0;

        if (progress > 0.22 && progress < 0.88) {
          // Left cluster
          const curveL = Math.sin((progress - 0.22) * Math.PI * 1.5);
          const waveL = Math.sin(time + progress * 7) * 7;
          leftWidth = Math.max(0, curveL * 98 + waveL);

          // Right cluster
          const curveR = Math.sin((progress - 0.32) * Math.PI * 1.7);
          const waveR = Math.cos(time * 0.85 + progress * 6) * 6;
          rightWidth = Math.max(0, curveR * 78 + waveR);
        }

        const isCenter = progress > 0.35 && progress < 0.75;
        const mainColor = isCenter ? '#6366f1' : '#4338ca'; // Indigo to violet
        const accentColor = '#818cf8'; // Bright blue-violet

        // Draw left segment bars
        if (leftWidth > 0) {
          const barSegments = Math.floor(leftWidth / 6);
          for (let s = 0; s < barSegments; s++) {
            const x = 12 + s * 6;
            const barW = 4;
            const barH = 2.2;
            const alpha = 0.5 + Math.sin(s * 0.4 + time * 2) * 0.4;

            ctx.fillStyle = s % 4 === 0 ? accentColor : mainColor;
            ctx.globalAlpha = Math.min(1, Math.max(0.2, alpha));
            ctx.fillRect(x, y - barH / 2, barW, barH);
          }
        }

        // Draw right segment bars
        if (rightWidth > 0) {
          const barSegments = Math.floor(rightWidth / 6);
          for (let s = 0; s < barSegments; s++) {
            const x = width - 16 - (barSegments - s) * 6;
            const barW = 4;
            const barH = 2.2;
            const alpha = 0.5 + Math.cos(s * 0.3 + time * 1.8) * 0.4;

            ctx.fillStyle = s % 3 === 0 ? accentColor : mainColor;
            ctx.globalAlpha = Math.min(1, Math.max(0.2, alpha));
            ctx.fillRect(x, y - barH / 2, barW, barH);
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeKey]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg bg-[#0c0d14] flex items-center justify-center border border-neutral-800/80 shadow-inner">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        className="block"
      />
      {/* Subtle CRT raster scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />
    </div>
  );
};

export default ResourcesScanlineArt;
