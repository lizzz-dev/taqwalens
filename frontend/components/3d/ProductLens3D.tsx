"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ProductLens3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    container.innerHTML = "";

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to blend with warm card

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Adjusted camera position to enlarge the carton ~25% within existing container boundary
    camera.position.set(0, 0.22, width < 480 ? 4.8 : 4.15);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "default",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // 2. Lighting (Warm Scandinavian Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.5);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0eb, 1.3);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.0);
    rimLight.position.set(0, -3, 3);
    scene.add(rimLight);

    // 3. Create Canvas Texture for Food Packaging Label (Clean Nordic & Mindful Halal Aesthetic)
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 1024;
    labelCanvas.height = 1024;
    const ctx = labelCanvas.getContext("2d");
    if (ctx) {
      // Warm Natural Ivory Background
      ctx.fillStyle = "#FAF7F0";
      ctx.fillRect(0, 0, 1024, 1024);

      // Deep Botanical Emerald Header Band
      ctx.fillStyle = "#1E3A2F";
      ctx.fillRect(50, 50, 924, 195);

      // Gold Trim Underneath Header
      ctx.fillStyle = "#D4AF37";
      ctx.fillRect(50, 245, 924, 6);

      // Header Top Micro-Tag
      ctx.fillStyle = "#A7F3D0";
      ctx.font = "600 20px 'JetBrains Mono', monospace";
      ctx.fillText("HALALAN TAYYIBAN • CERTIFIED AUDIT", 85, 95);

      // Primary Brand Title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 58px 'Playfair Display', serif";
      ctx.fillText("TAQWALENS", 85, 160);

      // Sub-brand
      ctx.fillStyle = "#EAE6DF";
      ctx.font = "500 24px 'Inter', sans-serif";
      ctx.fillText("BOTANICAL OATS & GRAINS", 85, 205);

      // Calligraphy badge in header
      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 46px 'Amiri', serif";
      ctx.fillText("حلال", 860, 165);

      // Center Graphic: Emerald & Gold Halal Emblem
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(512, 395, 105, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#1E3A2F";
      ctx.beginPath();
      ctx.arc(512, 395, 98, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(512, 395, 88, 0, Math.PI * 2);
      ctx.stroke();

      // Arabic Calligraphy in Center Emblem
      ctx.fillStyle = "#FDF8EC";
      ctx.textAlign = "center";
      ctx.font = "bold 64px 'Amiri', serif";
      ctx.fillText("حلال", 512, 385);

      ctx.fillStyle = "#D4AF37";
      ctx.font = "bold 18px 'Inter', sans-serif";
      ctx.fillText("100% VERIFIED", 512, 435);
      ctx.textAlign = "left"; // reset

      // Nutrition & Ingredient Panel
      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 28px 'Playfair Display', serif";
      ctx.fillText("AUDITED INGREDIENTS / INGRÉDIENTS", 85, 570);

      ctx.fillStyle = "#1E3A2F";
      ctx.font = "600 17px 'JetBrains Mono', monospace";
      ctx.fillText("[JAKIM MS 1500 & IFANCA SCREENED]", 640, 568);

      ctx.fillStyle = "#44403C";
      ctx.font = "500 22px 'Inter', sans-serif";
      ctx.fillText("Organic Whole Rolled Oats, Mountain Spring Water,", 85, 620);
      ctx.fillText("Cold-Pressed Sunflower Seed Oil, Ancient Sea Salt,", 85, 665);

      ctx.fillStyle = "#1E3A2F";
      ctx.font = "bold 22px 'Inter', sans-serif";
      ctx.fillText("Plant Calcium Carbonate (E170), Riboflavin (E101).", 85, 710);

      // Purity Guarantee Note
      ctx.fillStyle = "#059669";
      ctx.font = "600 20px 'Inter', sans-serif";
      ctx.fillText("✓ Zero Porcine Derivatives • Zero Synthetic Alcohols", 85, 755);

      // Bottom Badges Section
      // Left Status Pill
      ctx.fillStyle = "#1E3A2F";
      ctx.beginPath();
      ctx.roundRect(85, 810, 420, 80, 16);
      ctx.fill();

      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#FDF8EC";
      ctx.font = "bold 25px 'Inter', sans-serif";
      ctx.fillText("✓ 100% HALAL CERTIFIED", 115, 848);

      ctx.fillStyle = "#A7F3D0";
      ctx.font = "500 16px 'JetBrains Mono', monospace";
      ctx.fillText("Multi-Madhhab Sourcing Transparency", 115, 874);

      // Right Side: Barcode
      ctx.fillStyle = "#1C1917";
      for (let i = 0; i < 46; i++) {
        const barWidth = i % 4 === 0 ? 7 : i % 2 === 0 ? 4 : 2.5;
        ctx.fillRect(570 + i * 8, 805, barWidth, 68);
      }
      ctx.fillStyle = "#57534E";
      ctx.font = "500 17px 'JetBrains Mono', monospace";
      ctx.fillText("8  901234  567890", 630, 892);
    }

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.anisotropy = 8;

    // 4. Group for Product Package & Lens
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 4.1 Packaging Container (Artisan Grocery Carton)
    const cartonWidth = 1.6;
    const cartonHeight = 2.4;
    const cartonDepth = 1.1;

    const cartonGeo = new THREE.BoxGeometry(cartonWidth, cartonHeight, cartonDepth);
    const cartonMatSide = new THREE.MeshStandardMaterial({
      color: 0xfaf7f0,
      roughness: 0.55,
      metalness: 0.04,
    });
    const cartonMatFront = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.45,
      metalness: 0.04,
    });

    const materials = [
      cartonMatSide, // right
      cartonMatSide, // left
      cartonMatSide, // top
      cartonMatSide, // bottom
      cartonMatFront, // front
      cartonMatSide, // back
    ];

    const carton = new THREE.Mesh(cartonGeo, materials);
    carton.castShadow = true;
    carton.receiveShadow = true;
    carton.position.set(0, -0.1, 0);
    mainGroup.add(carton);

    // Carton Gable/Roof Top (Angled juice/milk style top fold)
    const roofGeo = new THREE.ConeGeometry(cartonWidth * 0.72, 0.45, 4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x143024,
      roughness: 0.35,
      metalness: 0.15,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, cartonHeight / 2 + 0.22 - 0.1, 0);
    roof.castShadow = true;
    mainGroup.add(roof);

    // 4.2 Magnifying "TaqwaLens"
    const lensGroup = new THREE.Group();

    // Metallic Brass Ring Frame
    const ringGeo = new THREE.TorusGeometry(0.55, 0.045, 24, 64);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe5bf4c,
      roughness: 0.18,
      metalness: 0.9,
    });
    const lensRing = new THREE.Mesh(ringGeo, brassMat);
    lensGroup.add(lensRing);

    // Glass Lens Element
    const glassGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.02, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 0.88,
      transparent: true,
      roughness: 0.1,
      ior: 1.52,
      thickness: 0.2,
      reflectivity: 0.5,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.x = Math.PI / 2;
    lensGroup.add(glass);

    // Lens Handle
    const handleGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.6, 24);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x143024,
      roughness: 0.3,
      metalness: 0.2,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0.45, -0.5, 0);
    handle.rotation.z = Math.PI / 4;
    lensGroup.add(handle);

    // Position lens inspecting the ingredient panel
    lensGroup.position.set(0.55, -0.2, 0.85);
    lensGroup.rotation.set(0.1, -0.2, 0.05);
    mainGroup.add(lensGroup);

    // 4.3 Soft Botanical Scanning Laser Beam (Subtle Sage Sweep)
    const scanBeamGeo = new THREE.PlaneGeometry(1.5, 0.05);
    const scanBeamMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    const scanBeam = new THREE.Mesh(scanBeamGeo, scanBeamMat);
    scanBeam.position.set(0, 0, cartonDepth / 2 + 0.02);
    mainGroup.add(scanBeam);

    // 4.4 Shadow Catcher Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.5;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Interactive Mouse Orbit / Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.8;
      mouseY = y * 0.5;
    };

    window.addEventListener("pointermove", handlePointerMove);

    // 6. Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth damping on mouse movement
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Gentle floating levitation
      mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      mainGroup.rotation.y = -0.25 + targetX * 0.6;
      mainGroup.rotation.x = targetY * 0.4;

      // Subtle lens independent hovering
      lensGroup.position.y = -0.2 + Math.cos(elapsedTime * 2.0) * 0.04;
      lensGroup.position.x = 0.55 + Math.sin(elapsedTime * 1.2) * 0.05;

      // Laser sweep down the ingredient panel
      const laserY = 0.4 - ((elapsedTime * 0.6) % 1.2);
      scanBeam.position.y = laserY;
      scanBeamMat.opacity = 0.4 + Math.sin(elapsedTime * 6) * 0.25;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // 7. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.position.z = newW < 480 ? 4.8 : 4.15;
          camera.position.y = 0.22;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      try {
        renderer.forceContextLoss();
        renderer.dispose();
      } catch {}
      cartonGeo.dispose();
      roofGeo.dispose();
      ringGeo.dispose();
      glassGeo.dispose();
      handleGeo.dispose();
      scanBeamGeo.dispose();
      shadowPlaneGeo.dispose();
      labelTexture.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[440px] rounded-2xl bg-gradient-to-b from-[#F7F4EE] to-[#EFECE4] border border-[#EAE6DF] overflow-hidden flex items-center justify-center shadow-sm touch-pan-y">
      {/* Subtle ambient lens flare / glow behind carton */}
      <div className="absolute w-72 h-72 rounded-full bg-[#1E3A2F]/5 blur-3xl pointer-events-none" />

      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y" />
    </div>
  );
}
