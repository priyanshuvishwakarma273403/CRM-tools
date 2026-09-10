import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Helper to setup a standard lightweight 3D canvas for interactive card artifacts */
const useThreeScene = (canvasRef, initFn) => {
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 180;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 5.5;

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

    // Call custom setup
    const cleanupCustom = initFn({ scene, camera, group, renderer });

    // Mouse interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 0.7;
      targetMouseY = y * 0.7;
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

      // Mouse damping
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Continuous 3D rotation & floating
      group.rotation.y += 0.015;
      group.position.y = Math.sin(t * 1.8) * 0.12;
      group.rotation.x = Math.sin(t * 1.1) * 0.12 + mouseY * 0.5;
      group.rotation.z = Math.cos(t * 0.9) * 0.06 + mouseX * 0.3;

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
      if (cleanupCustom) cleanupCustom();
      renderer.dispose();
    };
  }, [initFn]);
};

/** 1. 3D Diamond / Octahedron with scanline slices & dither vertices */
export const ThreeDiamond = () => {
  const mountRef = useRef(null);

  useThreeScene(mountRef, ({ group }) => {
    const lines = [];
    const dots = [];
    const layers = 36;

    for (let i = 0; i < layers; i++) {
      const ny = i / (layers - 1);
      const y = (ny - 0.5) * 3.4; // -1.7 to 1.7
      const radius = Math.sin(ny * Math.PI) * 1.45;

      const segments = 24;
      for (let j = 0; j < segments; j++) {
        const theta1 = (j / segments) * Math.PI * 2;
        const theta2 = ((j + 1) / segments) * Math.PI * 2;

        const x1 = Math.cos(theta1) * radius;
        const z1 = Math.sin(theta1) * radius;
        const x2 = Math.cos(theta2) * radius;
        const z2 = Math.sin(theta2) * radius;

        if (j % 2 === 0) {
          lines.push(x1, y, z1, x2, y, z2);
        }
        dots.push(x1, y, z1);
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.85,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineMesh);

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.055,
      transparent: true,
      opacity: 0.9,
    });
    const dotMesh = new THREE.Points(dotGeo, dotMat);
    group.add(dotMesh);

    return () => {
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
    };
  });

  return (
    <div
      ref={mountRef}
      className="w-44 h-44 mx-auto cursor-grab active:cursor-grabbing select-none"
      title="3D Diamond (Hover or tilt)"
    />
  );
};

/** 2. 3D Lightning Bolt with depth & raster dither lines */
export const ThreeLightning = () => {
  const mountRef = useRef(null);

  useThreeScene(mountRef, ({ group }) => {
    const lines = [];
    const dots = [];
    const layers = 38;

    for (let i = 0; i < layers; i++) {
      const ny = i / (layers - 1);
      const y = (0.5 - ny) * 3.6; // from top to bottom

      let cx = 0;
      let width = 0.5;

      if (ny < 0.45) {
        // Top slant
        cx = (ny - 0.22) * 1.5;
        width = 0.4 + ny * 0.9;
      } else if (ny < 0.55) {
        // Center hook
        cx = 0.2 - (ny - 0.45) * 3.5;
        width = 1.3;
      } else {
        // Bottom spear
        cx = -0.15 + (ny - 0.55) * 1.1;
        width = Math.max(1.1 - (ny - 0.55) * 2.2, 0.1);
      }

      // Scanline across width
      const pts = 16;
      const x1 = cx - width * 0.5;
      const x2 = cx + width * 0.5;

      // Double layered in z for 3D depth
      [-0.18, 0, 0.18].forEach((z) => {
        lines.push(x1, y, z, x2, y, z);
        for (let j = 0; j < pts; j++) {
          const t = j / (pts - 1);
          dots.push(x1 + (x2 - x1) * t, y, z);
        }
      });
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.85,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineMesh);

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.055,
      transparent: true,
      opacity: 0.9,
    });
    const dotMesh = new THREE.Points(dotGeo, dotMat);
    group.add(dotMesh);

    return () => {
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
    };
  });

  return (
    <div
      ref={mountRef}
      className="w-44 h-44 mx-auto cursor-grab active:cursor-grabbing select-none"
      title="3D Lightning (Hover or tilt)"
    />
  );
};

/** 3. 3D Padlock with cylindrical body & curved shackle */
export const ThreeLock = () => {
  const mountRef = useRef(null);

  useThreeScene(mountRef, ({ group }) => {
    const lines = [];
    const dots = [];

    // Body: horizontal rounded slices
    const bodyLayers = 22;
    for (let i = 0; i < bodyLayers; i++) {
      const ny = i / (bodyLayers - 1);
      const y = -1.4 + ny * 1.5; // -1.4 to 0.1
      const w = 1.3;
      const d = 0.5;

      const pts = 20;
      for (let j = 0; j < pts; j++) {
        const theta = (j / pts) * Math.PI * 2;
        const x = Math.cos(theta) * (w * 0.5);
        const z = Math.sin(theta) * (d * 0.5);
        dots.push(x, y, z);
      }
      lines.push(-w * 0.5, y, 0, w * 0.5, y, 0);
    }

    // Shackle: curved semi-torus arc
    const shackleSteps = 28;
    for (let i = 0; i < shackleSteps; i++) {
      const theta = (i / (shackleSteps - 1)) * Math.PI; // 0 to PI
      const radius = 0.65;
      const x = Math.cos(theta) * radius;
      const y = 0.1 + Math.sin(theta) * 1.1;

      [-0.12, 0.12].forEach((z) => {
        dots.push(x, y, z);
        dots.push(x + 0.05, y, z);
      });
      if (i < shackleSteps - 1) {
        const nextTheta = ((i + 1) / (shackleSteps - 1)) * Math.PI;
        const nx = Math.cos(nextTheta) * radius;
        const ny = 0.1 + Math.sin(nextTheta) * 1.1;
        lines.push(x, y, 0, nx, ny, 0);
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.85,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.055,
      transparent: true,
      opacity: 0.9,
    });
    group.add(new THREE.Points(dotGeo, dotMat));

    return () => {
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
    };
  });

  return (
    <div
      ref={mountRef}
      className="w-44 h-44 mx-auto cursor-grab active:cursor-grabbing select-none"
      title="3D Padlock (Hover or tilt)"
    />
  );
};
