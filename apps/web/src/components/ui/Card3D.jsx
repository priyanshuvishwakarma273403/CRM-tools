import React, { useState, useRef, useEffect } from 'react';

/**
 * Card3D — Premium Interactive 3D Parallax Tilt Card
 * Features:
 * - Physics-based 3D cursor tracking tilt (rotateX, rotateY, scale3d)
 * - Dynamic specular light reflection / glare tracking cursor position
 * - Preserves 3D child layering (badges, icons, buttons float forward)
 * - Optional ambient floating bobbing ("hilta rahe ekdam acche se")
 */
export const Card3D = ({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  glare = true,
  ambientFloat = false,
  floatDelay = 0,
  onClick,
  style = {},
}) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normalizedY = (y / rect.height - 0.5) * 2; // -1 to 1

    setRotate({
      x: -normalizedY * maxTilt,
      y: normalizedX * maxTilt,
    });

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className={`relative ${ambientFloat && !isHovered ? 'animate-card-3d-float' : ''}`}
      style={{
        perspective: 1000,
        animationDelay: `${floatDelay}ms`,
      }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${scale}, ${scale}, ${scale}) translateZ(10px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease-out',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `${-rotate.y * 1.5}px ${rotate.x * 1.5 + 12}px 30px -5px rgba(0, 0, 0, 0.12), 0 0 15px rgba(99, 102, 241, 0.08)`
            : '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          ...style,
        }}
        className={`relative overflow-hidden will-change-transform ${className}`}
      >
        {/* Child Content with 3D depth preservation */}
        <div style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>

        {/* Dynamic Specular Glare */}
        {glare && isHovered && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35), transparent 75%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Card3D;
