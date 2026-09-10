import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Torus Vortex / Knot Sculpture for Dark Pre-Footer & FAQ Section
 * - Faithful recreation of the Twenty.com 3D scanline dither sculpture
 * - Horizontal segmented indigo/violet scanlines slicing through a 3D Torus knot
 * - Continuous 3D rotation, undulating sine wave wobble, floating bobbing motion ("hilta rahe ekdam acche se")
 * - Mouse cursor tilt and interactive response
 */
export const ThreeVortexLoop = ({ className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 550;
    let height = container.clientHeight || 650;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

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

    // Knot parameters for the large 3D vortex
    const p = 2;
    const q = 3;
    const majorRadius = 2.4;
    const minorRadius = 0.72;
    const slices = 200;
    const radialSegments = 28;

    const lines = [];
    const dots = [];

    // Helper to compute Torus Knot point
    const getKnotCenter = (phi) => {
      const r = majorRadius * (0.82 + 0.22 * Math.cos(q * phi));
      const x = r * Math.cos(p * phi);
      const y = r * Math.sin(p * phi);
      const z = -majorRadius * 0.65 * Math.sin(q * phi);
      return new THREE.Vector3(x, y, z);
    };

    // Build the horizontal segmented scanline geometry
    for (let i = 0; i < slices; i++) {
      const phi1 = (i / slices) * Math.PI * 2;
      const phi2 = ((i + 1) / slices) * Math.PI * 2;

      const p1 = getKnotCenter(phi1);
      const p2 = getKnotCenter(phi2);

      const tangent = p2.clone().sub(p1).normalize();
      const normal = new THREE.Vector3(0, 1, 0).cross(tangent).normalize();
      const binormal = tangent.clone().cross(normal).normalize();

      for (let j = 0; j < radialSegments; j++) {
        const theta = (j / radialSegments) * Math.PI * 2;
        const ox = normal.x * Math.cos(theta) * minorRadius + binormal.x * Math.sin(theta) * minorRadius;
        const oy = normal.y * Math.cos(theta) * minorRadius + binormal.y * Math.sin(theta) * minorRadius;
        const oz = normal.z * Math.cos(theta) * minorRadius + binormal.z * Math.sin(theta) * minorRadius;

        const pt = new THREE.Vector3(p1.x + ox, p1.y + oy, p1.z + oz);

        // Add dither dot
        dots.push(pt.x, pt.y, pt.z);

        // Horizontal scanline dashed segments (the signature twenty.com dither lines)
        if (j % 2 === 0 && i % 3 === 0) {
          const dashLength = 0.16 + (Math.sin(i * 0.5 + j) + 1) * 0.08;
          lines.push(
            pt.x - dashLength, pt.y, pt.z,
            pt.x + dashLength, pt.y, pt.z
          );
        }

        // Longitudinal ribs
        if (j % 7 === 0 && i % 2 === 0) {
          const nextPhi = ((i + 1) / slices) * Math.PI * 2;
          const np = getKnotCenter(nextPhi);
          lines.push(
            pt.x, pt.y, pt.z,
            np.x + ox, np.y + oy, np.z + oz
          );
        }
      }
    }

    // Line segments with electric indigo/violet palette
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1, // Electric indigo / violet (#6366f1)
      transparent: true,
      opacity: 0.85,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineMesh);

    // Glowing point particles
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x818cf8, // Bright periwinkle / lavender (#818cf8)
      size: 0.038,
      transparent: true,
      opacity: 0.75,
    });
    const dotMesh = new THREE.Points(dotGeo, dotMat);
    group.add(dotMesh);

    // Mouse tracking with smooth damping
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8;
    };

    const onMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Continuous 3D rotation & undulating wobble ("hilta rahe ekdam acche se")
      group.rotation.y = t * 0.32 + mouseX * 0.9;
      group.rotation.x = Math.sin(t * 0.75) * 0.28 + mouseY * 0.9 + 0.2;
      group.rotation.z = Math.cos(t * 0.55) * 0.18;

      // Floating sine oscillation
      group.position.y = Math.sin(t * 1.4) * 0.18;
      group.position.x = Math.cos(t * 1.0) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
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
      className={`w-full ${className || 'h-[520px] sm:h-[620px] lg:h-[680px]'} cursor-grab active:cursor-grabbing select-none`}
      title="3D Scanline Torus Vortex"
    />
  );
};
