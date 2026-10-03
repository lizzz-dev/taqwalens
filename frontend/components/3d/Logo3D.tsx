"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Logo3D({ className = "w-11 h-11 sm:w-12 sm:h-12" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 48;
    const height = container.clientHeight || 48;

    container.innerHTML = "";

    // 1. Scene & Transparent Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    // Camera placed closer to make 3D emblem dramatically fill and POP in the frame
    camera.position.set(0, 0, 2.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 2. High-Impact Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfffdf0, 1.8);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.PointLight(0xffe894, 5.5, 12);
    goldKeyLight.position.set(2, 2.5, 3);
    scene.add(goldKeyLight);

    const emeraldRimLight = new THREE.PointLight(0x22c55e, 4.5, 12);
    emeraldRimLight.position.set(-2, -2, 2);
    scene.add(emeraldRimLight);

    const specularWhite = new THREE.PointLight(0xffffff, 3.5, 10);
    specularWhite.position.set(0, 2, 2.5);
    scene.add(specularWhite);

    // 3. 3D Model Group
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // 3.1 Outer Metallic Gold Beveled Rim (Bold & Eye-catching)
    const rimGeo = new THREE.TorusGeometry(0.92, 0.14, 18, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe0b938,
      metalness: 0.95,
      roughness: 0.15,
    });
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    logoGroup.add(rimMesh);

    // 3.2 Glass Optical Lens Element with High Refraction
    const glassGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.06, 40);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 0.88,
      transparent: true,
      roughness: 0.08,
      ior: 1.55,
      thickness: 0.2,
      reflectivity: 0.8,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.rotation.x = Math.PI / 2;
    logoGroup.add(glassMesh);

    // 3.3 Emerald Islamic Star / Diamond Core (Glowing Emissive Gem)
    const coreGeo = new THREE.OctahedronGeometry(0.46, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.5,
      roughness: 0.12,
      emissive: 0x059669,
      emissiveIntensity: 0.7,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    logoGroup.add(coreMesh);

    // 3.4 Nested Gold Geometric Star Accent
    const innerStarGeo = new THREE.OctahedronGeometry(0.28, 0);
    const innerStarMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xd4af37,
      emissiveIntensity: 0.3,
    });
    const innerStarMesh = new THREE.Mesh(innerStarGeo, innerStarMat);
    innerStarMesh.rotation.z = Math.PI / 4;
    logoGroup.add(innerStarMesh);

    // 3.5 Miniature Lens Handle (Extending from bottom-right)
    const handleGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.75, 18);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a2f,
      metalness: 0.7,
      roughness: 0.25,
    });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.set(0.78, -0.78, 0);
    handleMesh.rotation.z = Math.PI / 4;
    logoGroup.add(handleMesh);

    // 4. Interactive Pointer Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 1.8;
      mouseY = y * 1.8;
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

      // Gentle continuous ambient oscillation & floating rotation
      logoGroup.rotation.y = Math.sin(elapsed * 1.4) * 0.4 + targetX;
      logoGroup.rotation.x = Math.cos(elapsed * 1.1) * 0.25 + targetY;
      logoGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.1;

      // Inner jewel dynamic counter-rotation
      coreMesh.rotation.y = elapsed * 1.0;
      coreMesh.rotation.x = elapsed * 0.8;
      innerStarMesh.rotation.y = -elapsed * 1.4;

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
      try {
        renderer.forceContextLoss();
        renderer.dispose();
      } catch {}
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
      className={`relative rounded-2xl bg-gradient-to-b from-[#1E3A2F] via-[#162C23] to-[#0D1B15] p-1 border-2 border-[#D4AF37]/70 shadow-[0_4px_18px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_25px_rgba(34,197,94,0.45)] transition-all hover:scale-105 active:scale-95 group shrink-0 cursor-pointer overflow-hidden ${className}`}
      title="TaqwaLens 3D Optical Emblem"
    >
      {/* Golden Aura Glow Background */}
      <div className="absolute inset-0 bg-radial from-[#D4AF37]/25 via-transparent to-transparent pointer-events-none rounded-2xl" />

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full flex items-center justify-center relative z-10" />

      {/* Subtle Specular Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none rounded-2xl" />

      {/* Fallback while loading */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37] font-bold text-sm animate-pulse z-20">
          ✦
        </div>
      )}
    </div>
  );
}
