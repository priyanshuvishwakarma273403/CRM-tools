import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Interactive 3D Electric Blue Helix Sculpture
 * - Continuous 3D rotation & floating bobbing motion ("hamesa rounda jaisa kro yaa idhr udhr hilta rhe")
 * - Interactive mouse tilt responsiveness
 * - Smooth camera / rotation shift on step transitions (1/3, 2/3, 3/3)
 */
export const ThreeHelixSculpture = ({ phase = 0 }) => {
  const mountRef = useRef(null);
  const phaseRef = useRef(phase);
  const targetRotationRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
    targetRotationRef.current = phase * (Math.PI * 0.65);
  }, [phase]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 280;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 6.2;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Group for sculpture
    const group = new THREE.Group();
    scene.add(group);

    // 4. Construct 3D Helical Scanline Ribbon Geometry
    const slicesCount = 56;
    const pointsPerSlice = 28;
    const linePositions = [];
    const dotPositions = [];

    for (let i = 0; i < slicesCount; i++) {
      const normalizedY = i / (slicesCount - 1);
      const y = (normalizedY - 0.5) * 4.4; // Height from -2.2 to 2.2

      // Helix angle and radius
      const twistAngle = normalizedY * Math.PI * 3.0;
      const radius = 0.85 + Math.sin(normalizedY * Math.PI) * 0.35;
      const cx = Math.sin(twistAngle) * radius;
      const cz = Math.cos(twistAngle) * radius;

      // Slice width & orientation
      const sliceWidth = 1.1 + Math.cos(twistAngle * 1.5) * 0.4;
      const perpAngle = twistAngle + Math.PI / 2;

      const x1 = cx - Math.cos(perpAngle) * (sliceWidth / 2);
      const z1 = cz - Math.sin(perpAngle) * (sliceWidth / 2);
      const x2 = cx + Math.cos(perpAngle) * (sliceWidth / 2);
      const z2 = cz + Math.sin(perpAngle) * (sliceWidth / 2);

      // Add horizontal scanline segments
      linePositions.push(x1, y, z1, x2, y, z2);

      // Add dither dots along each scanline
      for (let j = 0; j < pointsPerSlice; j++) {
        const t = j / (pointsPerSlice - 1);
        const px = x1 + (x2 - x1) * t;
        const pz = z1 + (z2 - z1) * t;
        // Jitter subtly for raster dither look
        const jitter = (Math.random() - 0.5) * 0.03;
        dotPositions.push(px + jitter, y + jitter, pz + jitter);
      }
    }

    // Line segments geometry & material
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2563eb, // Electric blue
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // Dot particles geometry & material for authentic dither texture
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(dotPositions, 3)
    );
    const dotMat = new THREE.PointsMaterial({
      color: 0x3b82f6, // Bright blue dither points
      size: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    group.add(dots);

    // 5. Mouse Interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 0.8;
      targetMouseY = y * 0.8;
    };

    container.addEventListener('mousemove', onMouseMove);

    // 6. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();
    let currentStepRotation = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Smooth interpolation to target phase rotation
      currentStepRotation += (targetRotationRef.current - currentStepRotation) * 0.08;

      // A. Continuous slow 3D rotation ("hamesa rounda jaisa kro")
      const continuousY = elapsedTime * 0.55;
      group.rotation.y = continuousY + currentStepRotation + mouseX * 0.6;

      // B. Floating bobbing sine wave ("idhr udhr hilta rhe ek hi jagah pe")
      group.position.y = Math.sin(elapsedTime * 1.8) * 0.14;
      group.position.x = Math.cos(elapsedTime * 1.2) * 0.06;

      // C. Subtle 3D wobble / tilt
      group.rotation.x = Math.sin(elapsedTime * 1.1) * 0.15 + mouseY * 0.6;
      group.rotation.z = Math.cos(elapsedTime * 0.9) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', onMouseMove);
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
      className="w-56 sm:w-64 h-64 sm:h-72 mx-auto cursor-grab active:cursor-grabbing select-none relative"
      title="Interactive 3D Helix (Drag or Hover)"
    />
  );
};
