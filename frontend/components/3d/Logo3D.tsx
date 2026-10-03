"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Logo3D({ className = "w-10 h-10 sm:w-11 sm:h-11" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 44;
    const height = container.clientHeight || 44;

    // 1. Scene & Transparent Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return; // Gracefully fall back to CSS 3D
    }

    // 2. Lighting Setup (Metallic Studio Reflections)
    const ambientLight = new THREE.AmbientLight(0xfffdf0, 1.4);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.PointLight(0xffe28a, 4.0, 10);
    goldKeyLight.position.set(2, 2.5, 3);
    scene.add(goldKeyLight);

    const emeraldRimLight = new THREE.PointLight(0x22c55e, 3.0, 10);
    emeraldRimLight.position.set(-2, -2, 2);
    scene.add(emeraldRimLight);

    // 3. 3D Model Group
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // 3.1 Outer Metallic Gold Beveled Rim
    const rimGeo = new THREE.TorusGeometry(0.85, 0.12, 16, 48);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.22,
    });
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    logoGroup.add(rimMesh);

    // 3.2 Glass Optical Lens Element
    const glassGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.05, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.15,
      reflectivity: 0.7,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.rotation.x = Math.PI / 2;
    logoGroup.add(glassMesh);

    // 3.3 Emerald Islamic Star / Diamond Core
    const coreGeo = new THREE.OctahedronGeometry(0.42, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.4,
      roughness: 0.15,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    logoGroup.add(coreMesh);

    // 3.4 Second nested gold star ring
    const innerStarGeo = new THREE.OctahedronGeometry(0.24, 0);
    const innerStarMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      metalness: 0.8,
      roughness: 0.2,
    });
    const innerStarMesh = new THREE.Mesh(innerStarGeo, innerStarMat);
    innerStarMesh.rotation.z = Math.PI / 4;
    logoGroup.add(innerStarMesh);

    // 3.5 Miniature Lens Handle (Extending from 4 o'clock)
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.7, 16);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a2f,
      metalness: 0.6,
      roughness: 0.3,
    });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.set(0.72, -0.72, 0);
    handleMesh.rotation.z = Math.PI / 4;
    logoGroup.add(handleMesh);

    // 4. Mouse Tilt Interactions
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 1.5;
      mouseY = y * 1.5;
    };

    const onPointerLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    // 5. Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth damping tilt towards mouse
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      // Gentle continuous ambient oscillation & rotation
      logoGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.35 + targetX;
      logoGroup.rotation.x = Math.cos(elapsed * 0.9) * 0.2 + targetY;
      logoGroup.rotation.z = Math.sin(elapsed * 0.7) * 0.08;

      // Inner star independent counter-rotation
      coreMesh.rotation.y = elapsed * 0.8;
      coreMesh.rotation.x = elapsed * 0.6;
      innerStarMesh.rotation.y = -elapsed * 1.2;

      renderer.render(scene, camera);
    };

    animate();
    setIsReady(true);

    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      rimGeo.dispose();
      glassGeo.dispose();
      coreGeo.dispose();
      innerStarGeo.dispose();
      handleGeo.dispose();
      goldMat.dispose();
      glassMat.dispose();
      coreMat.dispose();
      innerStarMat.dispose();
      handleMat.dispose();
    };
  }, []);

  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-[#1E3A2F] to-[#14261F] p-0.5 shadow-md border border-[#D4AF37]/40 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden ${className}`}
      title="TaqwaLens 3D Optical Emblem"
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full flex items-center justify-center" />

      {/* Subtle Specular Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-xl" />

      {/* Fallback while loading */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37] font-bold text-xs animate-pulse">
          ✦
        </div>
      )}
    </div>
  );
}
