import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Interactive 3D Cyber Waveform Ribbon for Hero Section
 * - Replaces static 2D SVG waveforms with animated 3D undulating wave ribbons
 * - Continuous wave propagation & floating oscillation
 * - Mouse cursor tilt & turbulence
 */
export const ThreeHeroWave = ({ side = 'left' }) => {
  const mountRef = useRef(null);
  const isLeft = side === 'left';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.8;

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

    // Build 3D undulating wave grid of horizontal scanlines
    const rows = 40;
    const cols = 22;
    const lines = [];
    const dots = [];

    const xSpan = 3.6;
    const ySpan = 5.2;

    for (let r = 0; r < rows; r++) {
      const ny = r / (rows - 1);
      const y = (0.5 - ny) * ySpan;

      for (let c = 0; c < cols; c++) {
        const nx = c / (cols - 1);
        const x = (isLeft ? nx - 1.0 : 1.0 - nx) * xSpan;

        // Wave displacement
        const z = Math.sin(ny * Math.PI * 2 + nx * Math.PI) * 0.45;

        dots.push(x, y, z);

        if (c < cols - 1) {
          const nextNx = (c + 1) / (cols - 1);
          const nextX = (isLeft ? nextNx - 1.0 : 1.0 - nextNx) * xSpan;
          const nextZ = Math.sin(ny * Math.PI * 2 + nextNx * Math.PI) * 0.45;

          if (r % 2 === 0 || c % 3 === 0) {
            lines.push(x, y, z, nextX, y, nextZ);
          }
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.75,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineMesh);

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
    });
    const dotMesh = new THREE.Points(dotGeo, dotMat);
    group.add(dotMesh);

    // Mouse tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Gentle continuous 3D wave undulation
      group.rotation.y = Math.sin(t * 0.6) * 0.15 + (isLeft ? -0.2 : 0.2) + mouseX * 0.4;
      group.rotation.x = Math.cos(t * 0.5) * 0.1 + mouseY * 0.4;
      group.position.y = Math.sin(t * 1.2) * 0.1;

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
      window.removeEventListener('mousemove', onMouseMove);
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
  }, [isLeft]);

  return (
    <div
      ref={mountRef}
      className={`absolute top-20 ${
        isLeft ? '-left-6 sm:left-0' : '-right-6 sm:right-0'
      } w-44 sm:w-64 lg:w-80 h-[440px] pointer-events-none z-0 select-none opacity-90`}
    />
  );
};
