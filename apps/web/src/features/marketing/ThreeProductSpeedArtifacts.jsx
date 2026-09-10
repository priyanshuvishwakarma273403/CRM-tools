import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Scanline Sphere for "Built for speed" (Card 1)
 * Horizontal sliced indigo scanline sphere with continuous 3D rotation and bobbing
 */
export const ThreeSpeedSphere = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Build horizontal sliced scanlines across a sphere
    const lines = [];
    const dots = [];
    const layers = 36;
    const radius = 1.45;

    for (let i = 0; i < layers; i++) {
      const v = (i / (layers - 1)) * 2 - 1; // -1 to 1
      const y = v * radius;
      const r = Math.sqrt(Math.max(0, radius * radius - y * y));
      const segments = 48;

      for (let j = 0; j < segments; j++) {
        const theta1 = (j / segments) * Math.PI * 2;
        const theta2 = ((j + 1) / segments) * Math.PI * 2;

        const x1 = Math.cos(theta1) * r;
        const z1 = Math.sin(theta1) * r;
        const x2 = Math.cos(theta2) * r;
        const z2 = Math.sin(theta2) * r;

        dots.push(x1, y, z1);

        // Dashed scanlines
        if (j % 2 === 0) {
          lines.push(x1, y, z1, x2, y, z2);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.85 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.035, transparent: true, opacity: 0.8 });
    group.add(new THREE.Points(dotGeo, dotMat));

    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8;
    };
    const onMouseLeave = () => { targetMouseX = 0; targetMouseY = 0; };
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      group.rotation.y = t * 0.45 + mouseX * 1.2;
      group.rotation.x = Math.sin(t * 0.8) * 0.25 + mouseY * 1.2;
      group.rotation.z = Math.cos(t * 0.6) * 0.15;
      group.position.y = Math.sin(t * 1.8) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
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
    <div ref={mountRef} className="w-full h-48 cursor-grab active:cursor-grabbing select-none" />
  );
};

/**
 * 3D Scanline Eye / Lens for "Real-time data" (Card 2)
 * Elliptical almond eye with horizontal scanlines and central iris/pupil in 3D
 */
export const ThreeSpeedEye = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const lines = [];
    const dots = [];
    const layers = 32;

    for (let i = 0; i < layers; i++) {
      const v = (i / (layers - 1)) * 2 - 1; // -1 to 1
      const y = v * 1.0;
      // Almond curve envelope: x varies from -w to +w
      const w = Math.cos((v * Math.PI) / 2) * 1.85;
      const numPoints = 36;

      for (let j = 0; j < numPoints; j++) {
        const u = (j / (numPoints - 1)) * 2 - 1;
        const x = u * w;
        // Depth curve for lens convex surface
        const z = Math.cos((u * Math.PI) / 2) * Math.cos((v * Math.PI) / 2) * 0.75;

        dots.push(x, y, z);

        if (j < numPoints - 1 && (i + j) % 2 === 0) {
          const nextU = ((j + 1) / (numPoints - 1)) * 2 - 1;
          const nextX = nextU * w;
          const nextZ = Math.cos((nextU * Math.PI) / 2) * Math.cos((v * Math.PI) / 2) * 0.75;
          lines.push(x, y, z, nextX, y, nextZ);
        }
      }
    }

    // Iris circle
    const irisR = 0.45;
    for (let k = 0; k < 24; k++) {
      const a1 = (k / 24) * Math.PI * 2;
      const a2 = ((k + 1) / 24) * Math.PI * 2;
      lines.push(
        Math.cos(a1) * irisR, Math.sin(a1) * irisR, 0.76,
        Math.cos(a2) * irisR, Math.sin(a2) * irisR, 0.76
      );
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.85 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.035, transparent: true, opacity: 0.8 });
    group.add(new THREE.Points(dotGeo, dotMat));

    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.9;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.9;
    };
    const onMouseLeave = () => { targetMouseX = 0; targetMouseY = 0; };
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Tilts and looks around like an intelligent eye
      group.rotation.y = Math.sin(t * 0.7) * 0.35 + mouseX * 1.3;
      group.rotation.x = Math.sin(t * 1.1) * 0.2 + mouseY * 1.1;
      group.rotation.z = Math.cos(t * 0.8) * 0.12;
      group.position.y = Math.sin(t * 1.6) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
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
    <div ref={mountRef} className="w-full h-48 cursor-grab active:cursor-grabbing select-none" />
  );
};

/**
 * 3D Scanline Cross / Cursor Arrows for "Stay in Flow" (Card 3)
 * 3D Multidirectional navigational cross with horizontal scanlines in continuous rotation
 */
export const ThreeSpeedCross = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const lines = [];
    const dots = [];
    const layers = 34;

    for (let i = 0; i < layers; i++) {
      const v = (i / (layers - 1)) * 2 - 1; // -1 to 1
      const y = v * 1.35;
      const depthSteps = 12;

      for (let d = 0; d < depthSteps; d++) {
        const z = ((d / (depthSteps - 1)) * 2 - 1) * 0.35;

        // Cross geometry: horizontal bar or vertical stem
        const isCenter = Math.abs(y) < 0.45;
        const xHalf = isCenter ? 1.4 : 0.45;

        const p1x = -xHalf;
        const p2x = xHalf;

        dots.push(p1x, y, z, p2x, y, z);

        if (d % 2 === 0 && i % 2 === 0) {
          lines.push(p1x, y, z, p2x, y, z);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.85 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.035, transparent: true, opacity: 0.8 });
    group.add(new THREE.Points(dotGeo, dotMat));

    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.9;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.9;
    };
    const onMouseLeave = () => { targetMouseX = 0; targetMouseY = 0; };
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      group.rotation.y = t * 0.5 + mouseX * 1.2;
      group.rotation.x = Math.sin(t * 0.9) * 0.25 + mouseY * 1.2;
      group.rotation.z = Math.cos(t * 0.7) * 0.2;
      group.position.y = Math.sin(t * 1.5) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
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
    <div ref={mountRef} className="w-full h-48 cursor-grab active:cursor-grabbing select-none" />
  );
};
