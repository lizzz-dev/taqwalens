"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { MadhhabProfile } from "../../lib/types";

interface AuthCard3DProps {
  userName?: string;
  userRole?: string;
  madhhab?: MadhhabProfile;
  className?: string;
}

export function AuthCard3D({
  userName = "Guest Evaluator",
  userRole = "Halal Food Auditor",
  madhhab = "standard",
  className = "w-full h-[400px] sm:h-[480px]",
}: AuthCard3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // References to update 3D elements dynamically
  const cardGroupRef = useRef<THREE.Group | null>(null);
  const frontMeshRef = useRef<THREE.Mesh | null>(null);
  const frontTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const flipAngleRef = useRef(0);
  const targetFlipAngleRef = useRef(0);

  // Helper to draw high-definition 1024x1024 holographic credential card texture
  const drawCardTexture = useCallback(
    (name: string, role: string, juristic: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 640;
      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      // 1. Deep Obsidian-Emerald Gradient Base
      const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640);
      bgGrad.addColorStop(0, "#081C15");
      bgGrad.addColorStop(0.5, "#0D2A20");
      bgGrad.addColorStop(1, "#05130D");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 640);

      // 2. Microscopic Guilloché & Sacred Islamic Geometric Star Pattern
      ctx.save();
      ctx.strokeStyle = "rgba(212, 175, 55, 0.12)";
      ctx.lineWidth = 1.5;

      const centerX = 820;
      const centerY = 320;
      for (let r = 40; r <= 320; r += 32) {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();

      // 3. Gold Accent Rim Border
      ctx.save();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 6;
      ctx.strokeRect(24, 24, 976, 592);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, 952, 568);
      ctx.restore();

      // 4. Metallic Smart Chip Contacts
      ctx.save();
      const chipX = 90;
      const chipY = 160;
      const chipW = 120;
      const chipH = 96;

      // Chip base
      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      chipGrad.addColorStop(0, "#F5E084");
      chipGrad.addColorStop(0.5, "#C89C32");
      chipGrad.addColorStop(1, "#A0761C");
      ctx.fillStyle = chipGrad;
      ctx.beginPath();
      ctx.roundRect(chipX, chipY, chipW, chipH, 12);
      ctx.fill();

      // Chip circuit cuts
      ctx.strokeStyle = "#5C4108";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(chipX + 16, chipY + 16, chipW - 32, chipH - 32);
      ctx.beginPath();
      ctx.moveTo(chipX + chipW / 2, chipY + 16);
      ctx.lineTo(chipX + chipW / 2, chipY + chipH - 16);
      ctx.moveTo(chipX + 16, chipY + chipH / 2);
      ctx.lineTo(chipX + chipW - 16, chipY + chipH / 2);
      ctx.stroke();
      ctx.restore();

      // 5. Header Brand & Protocol
      ctx.save();
      ctx.fillStyle = "#EAE6DF";
      ctx.font = "bold 34px serif";
      ctx.fillText("TAQWALENS", 90, 92);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 17px sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText("HALAL AUDIT PROTOCOL • FIQH AL-AT'IMAH", 90, 126);

      // Live Cryptographic Hash
      ctx.fillStyle = "rgba(234, 230, 223, 0.6)";
      ctx.font = "14px monospace";
      ctx.fillText("CREDENTIAL ID: #TL-2026-X89", 640, 88);
      ctx.fillText("STATUS: CRYPTO-VERIFIED", 640, 112);
      ctx.restore();

      // 6. User Identity Info (Dynamic)
      ctx.save();
      ctx.fillStyle = "#D4AF37";
      ctx.font = "14px sans-serif";
      ctx.fillText("CERTIFIED AUDITOR", 90, 310);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 44px serif";
      const displayName = name.toUpperCase().slice(0, 24);
      ctx.fillText(displayName || "GUEST EVALUATOR", 90, 362);

      ctx.fillStyle = "#A3E635"; // Accent lime-emerald
      ctx.font = "600 20px sans-serif";
      ctx.fillText(role.toUpperCase(), 90, 404);
      ctx.restore();

      // 7. Juristic Profile Badge
      ctx.save();
      const badgeY = 460;
      ctx.fillStyle = "rgba(30, 58, 47, 0.85)";
      ctx.beginPath();
      ctx.roundRect(90, badgeY, 380, 54, 27);
      ctx.fill();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#F5E084";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(`JURISTIC SCHOOL: ${juristic.toUpperCase()}`, 115, badgeY + 33);
      ctx.restore();

      // 8. Holographic Security Stamp & Decorative Seal
      ctx.save();
      ctx.beginPath();
      ctx.arc(840, 480, 70, 0, Math.PI * 2);
      const sealGrad = ctx.createRadialGradient(840, 480, 10, 840, 480, 70);
      sealGrad.addColorStop(0, "rgba(254, 240, 138, 0.8)");
      sealGrad.addColorStop(0.5, "rgba(212, 175, 55, 0.4)");
      sealGrad.addColorStop(1, "rgba(16, 185, 129, 0.1)");
      ctx.fillStyle = sealGrad;
      ctx.fill();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = "#0D2A20";
      ctx.font = "bold 18px serif";
      ctx.textAlign = "center";
      ctx.fillText("TAQWA", 840, 475);
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("VALIDATED", 840, 498);
      ctx.restore();

      // 9. Bottom Barcode / Optical Lines
      ctx.save();
      ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
      const barX = 90;
      const barY = 548;
      const barH = 34;
      const pattern = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0];
      let curX = barX;
      for (const p of pattern) {
        ctx.fillRect(curX, barY, p * 2.2, barH);
        curX += p * 2.2 + 4;
      }
      ctx.restore();

      return canvas;
    },
    []
  );

  // Update dynamic texture whenever props change
  useEffect(() => {
    if (!frontMeshRef.current || !frontTextureRef.current) return;
    const canvas = drawCardTexture(userName, userRole, madhhab);
    const newTex = new THREE.CanvasTexture(canvas);
    newTex.colorSpace = THREE.SRGBColorSpace;
    newTex.needsUpdate = true;

    if (Array.isArray(frontMeshRef.current.material)) {
      frontMeshRef.current.material[4] = new THREE.MeshPhysicalMaterial({
        map: newTex,
        roughness: 0.18,
        metalness: 0.45,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
      });
    }
  }, [userName, userRole, madhhab, drawCardTexture]);

  // Handle click for 360-degree flip
  const handleCardClick = () => {
    targetFlipAngleRef.current += Math.PI * 2;
    setIsFlipped((prev) => !prev);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    // 2. High-Performance WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 3. Luxurious 4-Point Lighting (Emerald, Warm Gold & Key Studio)
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 1.8);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.PointLight(0xffe082, 4.5, 15);
    goldKeyLight.position.set(3, 3, 4);
    scene.add(goldKeyLight);

    const emeraldRimLight = new THREE.PointLight(0x10b981, 4.0, 15);
    emeraldRimLight.position.set(-3, -2.5, 3);
    scene.add(emeraldRimLight);

    const pointerSpecularLight = new THREE.PointLight(0xffffff, 3.2, 10);
    pointerSpecularLight.position.set(0, 1, 3.5);
    scene.add(pointerSpecularLight);

    // 4. Main 3D Card Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    cardGroupRef.current = masterGroup;

    // 4.1 Card Rounded Box Mesh
    const cardWidth = 3.4;
    const cardHeight = 2.12;
    const cardDepth = 0.06;
    const radius = 0.14;

    // Create 2D Rounded Rectangle Shape
    const shape = new THREE.Shape();
    const x = -cardWidth / 2;
    const y = -cardHeight / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + cardWidth - radius, y);
    shape.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
    shape.lineTo(x + cardWidth, y + cardHeight - radius);
    shape.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
    shape.lineTo(x + radius, y + cardHeight);
    shape.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: cardDepth,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.02,
    };

    const cardGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    cardGeometry.center();

    // Textures for Card Faces
    const initialCanvas = drawCardTexture(userName, userRole, madhhab);
    const frontTex = new THREE.CanvasTexture(initialCanvas);
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTextureRef.current = frontTex;

    // Gold metallic edge material
    const goldRimMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb43a,
      metalness: 0.95,
      roughness: 0.15,
    });

    // Holographic Front Face Material
    const frontFaceMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTex,
      roughness: 0.18,
      metalness: 0.45,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    // Back Face Material with Islamic geometric embossing
    const backFaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1f17,
      metalness: 0.7,
      roughness: 0.25,
    });

    const cardMesh = new THREE.Mesh(cardGeometry, [
      goldRimMaterial,
      goldRimMaterial,
      goldRimMaterial,
      goldRimMaterial,
      frontFaceMaterial,
      backFaceMaterial,
    ]);
    frontMeshRef.current = cardMesh;
    masterGroup.add(cardMesh);

    // 4.2 Orbiting Gyroscope Gold Rings
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.022, 16, 90);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xe5c048,
      metalness: 0.96,
      roughness: 0.12,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 4;
    masterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.6, 0.016, 16, 90);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    masterGroup.add(ring2);

    // 4.3 Floating Glowing Emerald Core Gem
    const gemGeo = new THREE.OctahedronGeometry(0.32, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.3,
      roughness: 0.1,
      emissive: 0x059669,
      emissiveIntensity: 0.9,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.set(0, 1.45, 0.25);
    masterGroup.add(gemMesh);

    // 4.4 Particle Field (120 Golden & Emerald Sparkles)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8.0;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
      particleScales[i] = Math.random() * 0.8 + 0.2;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
      pGrad.addColorStop(0, "rgba(255, 235, 150, 1)");
      pGrad.addColorStop(0.3, "rgba(212, 175, 55, 0.8)");
      pGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
      pCtx.fillStyle = pGrad;
      pCtx.beginPath();
      pCtx.arc(32, 32, 30, 0, Math.PI * 2);
      pCtx.fill();
    }
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Interactive Pointer Tracking with Smooth Physics Lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetRotY = mouseX * 0.55;
      targetRotX = -mouseY * 0.4;

      // Move specular light with pointer
      pointerSpecularLight.position.x = mouseX * 3;
      pointerSpecularLight.position.y = mouseY * 2.5 + 1;
    };

    const handlePointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      pointerSpecularLight.position.set(0, 1, 3.5);
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);
    container.addEventListener("touchmove", handlePointerMove, { passive: true });

    // Responsive Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 460;
      const newH = container.clientHeight || 420;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // 6. Animation Loop (60 FPS)
    const clock = new THREE.Clock();
    setIsReady(true);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smoothly interpolate flip angle
      flipAngleRef.current += (targetFlipAngleRef.current - flipAngleRef.current) * 0.08;

      // Smooth pointer tilt interpolation
      masterGroup.rotation.y += (targetRotY + flipAngleRef.current - masterGroup.rotation.y) * 0.07;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.07;

      // Ambient hovering floating bob
      masterGroup.position.y = Math.sin(elapsed * 1.8) * 0.07;
      masterGroup.position.x = Math.cos(elapsed * 1.2) * 0.03;

      // Rotate Orbiting Rings
      ring1.rotation.z += 0.012;
      ring1.rotation.y += 0.008;
      ring2.rotation.x -= 0.01;
      ring2.rotation.z += 0.007;

      // Gem pulse & rotation
      gemMesh.rotation.y += 0.03;
      gemMesh.rotation.x += 0.015;
      gemMesh.position.y = 1.35 + Math.sin(elapsed * 3) * 0.05;

      // Particle floating drift
      particles.rotation.y = elapsed * 0.04;
      particles.rotation.x = Math.sin(elapsed * 0.03) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
      container.removeEventListener("touchmove", handlePointerMove);

      // Clean WebGL Memory
      renderer.dispose();
      cardGeometry.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      gemGeo.dispose();
      particleGeo.dispose();
      goldRimMaterial.dispose();
      frontFaceMaterial.dispose();
      backFaceMaterial.dispose();
      ringMat.dispose();
      gemMat.dispose();
      particleMat.dispose();
      frontTex.dispose();
      pTex.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [drawCardTexture]);

  return (
    <div
      onClick={handleCardClick}
      className={`relative select-none cursor-pointer group flex items-center justify-center ${className}`}
      title="Click card to spin 360° • Drag or move pointer to tilt in 3D space"
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Interactive Controls Chip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 bg-[#0F291E]/80 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-[11px] font-medium text-[#FAF8F5] shadow-lg transition-transform group-hover:scale-105">
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
        <span>Drag to Tilt 3D Credential • Tap to Flip</span>
      </div>

      {/* Ambient Radial Glow Behind Card */}
      <div className="absolute -inset-4 bg-radial from-[#10b981]/15 via-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none -z-10" />
    </div>
  );
}
