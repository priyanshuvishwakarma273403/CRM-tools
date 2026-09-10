import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Architectural Monolith Skyscraper
 * - Interactive 3D skyscraper tower for "The Problem" section
 * - Continuous slow 3D rotation & floating perspective
 * - Mouse cursor tilt tracking
 */
export const ThreeMonolith = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Build the 3D Monolith Tower with horizontal scanline floors & vertical pillars
    const lines = [];
    const dots = [];
    const floors = 46;

    for (let i = 0; i < floors; i++) {
      const ny = i / (floors - 1);
      const y = (ny - 0.5) * 4.6; // -2.3 to 2.3

      // Main tower width with upward taper & notch
      const baseW = 1.4;
      const taper = 1.0 - ny * 0.28;
      const w = baseW * taper;
      const d = 0.9 * taper;

      // Slice horizontal perimeter
      const p1 = [-w * 0.5, y, -d * 0.5];
      const p2 = [w * 0.5, y, -d * 0.5];
      const p3 = [w * 0.5, y, d * 0.5];
      const p4 = [-w * 0.5, y, d * 0.5];

      // Outer frame segments
      lines.push(...p1, ...p2);
      lines.push(...p2, ...p3);
      lines.push(...p3, ...p4);
      lines.push(...p4, ...p1);

      // Floor grid scanlines
      const pts = 14;
      for (let j = 0; j < pts; j++) {
        const t = j / (pts - 1);
        const px = -w * 0.5 + w * t;
        dots.push(px, y, -d * 0.5);
        dots.push(px, y, d * 0.5);
      }

      // Tower split / architectural slit down the facade
      if (ny > 0.3) {
        const slitX = 0.15 * taper;
        dots.push(slitX, y, d * 0.5 + 0.05);
      }
    }

    // Vertical structural columns
    const columns = [
      [-0.7, -2.3, -0.45, -0.5, 2.3, -0.32],
      [0.7, -2.3, -0.45, 0.5, 2.3, -0.32],
      [-0.7, -2.3, 0.45, -0.5, 2.3, 0.32],
      [0.7, -2.3, 0.45, 0.5, 2.3, 0.32],
      [0.12, -2.3, 0.45, 0.08, 2.3, 0.32], // Central architectural groove
    ];

    columns.forEach((c) => {
      lines.push(...c);
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x171717, // Deep dark obsidian lines
      transparent: true,
      opacity: 0.85,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x2563eb, // Electric blue subtle accent vertices
      size: 0.045,
      transparent: true,
      opacity: 0.85,
    });
    group.add(new THREE.Points(dotGeo, dotMat));

    // Mouse tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.6;
    };

    const onMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Continuous 3D slow rotation
      group.rotation.y = t * 0.35 + mouseX;
      group.rotation.x = Math.sin(t * 0.9) * 0.08 + mouseY;
      group.position.y = Math.sin(t * 1.4) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-80 sm:h-96 mx-auto cursor-grab active:cursor-grabbing select-none"
      title="3D Monolith Architecture (Hover to rotate in 3D)"
    />
  );
};
