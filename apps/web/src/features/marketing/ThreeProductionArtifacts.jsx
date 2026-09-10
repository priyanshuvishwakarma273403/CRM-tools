import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Common 3D container helper for case study cards */
const useCaseScene = (canvasRef, initFn) => {
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 5.6;

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

    const cleanupCustom = initFn({ scene, camera, group, renderer });

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.7;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.7;
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

      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      group.rotation.y += 0.015;
      group.position.y = Math.sin(t * 1.8) * 0.12;
      group.rotation.x = Math.sin(t * 1.1) * 0.1 + mouseY * 0.5;
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

/** 1. 3D Magenta Globe Sphere with Orbital Ring (W3villa) */
export const ThreeDitherSphere = () => {
  const mountRef = useRef(null);

  useCaseScene(mountRef, ({ group }) => {
    const lines = [];
    const dots = [];
    const layers = 34;
    const radius = 1.45;

    for (let i = 0; i < layers; i++) {
      const ny = i / (layers - 1);
      const y = (ny - 0.5) * (radius * 2);
      const dy = Math.abs(y);
      const sliceR = Math.sqrt(Math.max(0, radius * radius - dy * dy));

      const segments = 28;
      for (let j = 0; j < segments; j++) {
        const theta1 = (j / segments) * Math.PI * 2;
        const theta2 = ((j + 1) / segments) * Math.PI * 2;

        const x1 = Math.cos(theta1) * sliceR;
        const z1 = Math.sin(theta1) * sliceR;
        const x2 = Math.cos(theta2) * sliceR;
        const z2 = Math.sin(theta2) * sliceR;

        if (j % 2 === 0) {
          lines.push(x1, y, z1, x2, y, z2);
        }
        dots.push(x1, y, z1);
      }
    }

    // Orbital ring
    const ringSegs = 48;
    const ringR = 2.0;
    for (let k = 0; k < ringSegs; k++) {
      const a = (k / ringSegs) * Math.PI * 2;
      const rx = Math.cos(a) * ringR;
      const rz = Math.sin(a) * ringR;
      const ry = Math.sin(a) * 0.45;
      dots.push(rx, ry, rz);
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf43f5e, // Rose / magenta
      transparent: true,
      opacity: 0.85,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0xfb7185,
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
      className="w-48 h-48 mx-auto cursor-grab active:cursor-grabbing select-none"
      title="3D Sphere (Hover to tilt)"
    />
  );
};

/** 2. 3D Emerald Green Rocket (AC&T) */
export const ThreeDitherRocket = () => {
  const mountRef = useRef(null);

  useCaseScene(mountRef, ({ group }) => {
    const lines = [];
    const dots = [];
    const layers = 36;

    for (let i = 0; i < layers; i++) {
      const ny = i / (layers - 1);
      const y = 1.9 - ny * 3.6; // from top nose down to tail

      let r = 0.1;
      if (ny < 0.28) {
        // Pointed nosecone
        r = ny * 2.8;
      } else if (ny < 0.75) {
        // Fuselage cylinder
        r = 0.78 + Math.sin(ny * Math.PI) * 0.12;
      } else {
        // Fins expansion
        r = 0.78 + (ny - 0.75) * 2.5;
      }

      const segs = 20;
      for (let j = 0; j < segs; j++) {
        const theta1 = (j / segs) * Math.PI * 2;
        const theta2 = ((j + 1) / segs) * Math.PI * 2;

        const x1 = Math.cos(theta1) * r;
        const z1 = Math.sin(theta1) * r;
        const x2 = Math.cos(theta2) * r;
        const z2 = Math.sin(theta2) * r;

        if (j % 2 === 0) {
          lines.push(x1, y, z1, x2, y, z2);
        }
        dots.push(x1, y, z1);
      }
    }

    // Exhaust thrust flame particles
    for (let f = 0; f < 30; f++) {
      const fy = -1.8 - Math.random() * 0.8;
      const fr = Math.random() * 0.4;
      const fa = Math.random() * Math.PI * 2;
      dots.push(Math.cos(fa) * fr, fy, Math.sin(fa) * fr);
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x10b981, // Emerald green
      transparent: true,
      opacity: 0.85,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x34d399,
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
      className="w-48 h-48 mx-auto cursor-grab active:cursor-grabbing select-none"
      title="3D Rocket (Hover to tilt)"
    />
  );
};

/** 3. 3D Gold Coin with Dollar Emboss (NetZero) */
export const ThreeDitherCoin = () => {
  const mountRef = useRef(null);

  useCaseScene(mountRef, ({ group }) => {
    const lines = [];
    const dots = [];
    const radius = 1.45;
    const thickness = 0.45;

    // Front and Back faces
    [-thickness * 0.5, thickness * 0.5].forEach((z) => {
      const rings = 8;
      for (let r = 1; r <= rings; r++) {
        const ringR = (r / rings) * radius;
        const pts = 24;
        for (let j = 0; j < pts; j++) {
          const a1 = (j / pts) * Math.PI * 2;
          const a2 = ((j + 1) / pts) * Math.PI * 2;
          const x1 = Math.cos(a1) * ringR;
          const y1 = Math.sin(a1) * ringR;
          const x2 = Math.cos(a2) * ringR;
          const y2 = Math.sin(a2) * ringR;

          if (r === rings || j % 3 === 0) {
            lines.push(x1, y1, z, x2, y2, z);
          }
          dots.push(x1, y1, z);
        }
      }

      // Embossed Dollar symbol on faces
      const dollarH = 1.6;
      const ptsS = 18;
      for (let s = 0; s < ptsS; s++) {
        const sy = -dollarH * 0.5 + (s / (ptsS - 1)) * dollarH;
        dots.push(0, sy, z + 0.04);
        if (s % 3 === 0) {
          lines.push(-0.35, sy, z + 0.04, 0.35, sy, z + 0.04);
        }
      }
    });

    // Outer rim cylinder edges
    const rimPts = 32;
    for (let k = 0; k < rimPts; k++) {
      const a = (k / rimPts) * Math.PI * 2;
      const rx = Math.cos(a) * radius;
      const ry = Math.sin(a) * radius;
      lines.push(rx, ry, -thickness * 0.5, rx, ry, thickness * 0.5);
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xeab308, // Gold / yellow
      transparent: true,
      opacity: 0.85,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0xfde047,
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
      className="w-48 h-48 mx-auto cursor-grab active:cursor-grabbing select-none"
      title="3D Gold Coin (Hover to tilt)"
    />
  );
};
