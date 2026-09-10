import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Scanline Architectural Towers flanking the Product Hero Window
 * Sliced indigo/violet horizontal dither scanlines matching Twenty.com product hero
 */
export const ThreeProductHeroWing = ({ side = 'left' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 260;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(side === 'left' ? 2 : -2, 0, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const lines = [];
    const dots = [];
    const floors = 50;

    for (let f = 0; f < floors; f++) {
      const y = (f / floors) * 5.2 - 2.6;
      const w = 1.4 + Math.sin(f * 0.15) * 0.35 + (floors - f) * 0.02;
      const depth = 1.2;
      const steps = 18;

      for (let s = 0; s < steps; s++) {
        const x = (s / (steps - 1)) * w - w / 2;
        const z = Math.sin((s / steps) * Math.PI) * depth * 0.6;

        dots.push(x, y, z);

        if (s < steps - 1 && f % 2 === 0) {
          const nx = ((s + 1) / (steps - 1)) * w - w / 2;
          const nz = Math.sin(((s + 1) / steps) * Math.PI) * depth * 0.6;
          lines.push(x, y, z, nx, y, nz);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.75 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.038, transparent: true, opacity: 0.7 });
    group.add(new THREE.Points(dotGeo, dotMat));

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      group.rotation.y = Math.sin(t * 0.4) * 0.12 + (side === 'left' ? 0.2 : -0.2);
      group.rotation.x = Math.sin(t * 0.6) * 0.06;
      group.position.y = Math.sin(t * 1.2) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      renderer.dispose();
    };
  }, [side]);

  return (
    <div
      ref={mountRef}
      className={`absolute bottom-0 ${side === 'left' ? '-left-6 sm:left-4' : '-right-6 sm:right-4'} w-44 sm:w-60 h-[420px] pointer-events-none z-0 opacity-80 select-none`}
    />
  );
};
