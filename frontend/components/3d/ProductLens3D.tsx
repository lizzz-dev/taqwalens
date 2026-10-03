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

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to blend with warm card

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting (Warm Scandinavian Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0eb, 1.2);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 0.8);
    rimLight.position.set(0, -3, 3);
    scene.add(rimLight);

    // 3. Create Canvas Texture for Food Packaging Label (Clean Nordic Aesthetic)
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 1024;
    labelCanvas.height = 1024;
    const ctx = labelCanvas.getContext("2d");
    if (ctx) {
      // Cream background
      ctx.fillStyle = "#F7F4EE";
      ctx.fillRect(0, 0, 1024, 1024);

      // Deep botanical sage band
      ctx.fillStyle = "#1E3A2F";
      ctx.fillRect(60, 60, 904, 180);

      // Brand Title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 52px serif";
      ctx.fillText("TAQWALENS", 100, 150);
      ctx.font = "300 24px sans-serif";
      ctx.fillText("MINDFUL BOTANICAL OATS", 100, 195);

      // Front illustration / graphic
      ctx.fillStyle = "#2D5A46";
      ctx.beginPath();
      ctx.arc(512, 420, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#F7F4EE";
      ctx.beginPath();
      ctx.arc(512, 420, 95, 0, Math.PI * 2);
      ctx.fill();

      // Leaf icon
      ctx.fillStyle = "#2D5A46";
      ctx.beginPath();
      ctx.ellipse(512, 420, 45, 70, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Nutrition & Ingredient Panel
      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("INGREDIENTS / INGRÉDIENTS", 100, 620);

      ctx.fillStyle = "#44403C";
      ctx.font = "20px sans-serif";
      ctx.fillText("Organic Rolled Oats, Mountain Spring Water,", 100, 665);
      ctx.fillText("Cold-Pressed Sunflower Oil, Sea Salt,", 100, 705);
      ctx.fillText("Calcium Carbonate (E170), Riboflavin (E101).", 100, 745);

      // Halal Seal Badge
      ctx.fillStyle = "#1E3A2F";
      ctx.fillRect(100, 810, 360, 70);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("✓ 100% PLANT VERIFIED", 130, 855);

      // Barcode
      ctx.fillStyle = "#1C1917";
      for (let i = 0; i < 48; i++) {
        const barWidth = i % 3 === 0 ? 6 : 3;
        ctx.fillRect(580 + i * 7, 810, barWidth, 70);
      }
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
      color: 0xf4f0e6,
      roughness: 0.6,
      metalness: 0.05,
    });
    const cartonMatFront = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.5,
      metalness: 0.05,
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
      color: 0x1e3a2f,
      roughness: 0.4,
      metalness: 0.1,
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
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
    });
    const lensRing = new THREE.Mesh(ringGeo, brassMat);
    lensGroup.add(lensRing);

    // Glass Lens Element
    const glassGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.02, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 0.85,
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
      color: 0x1e3a2f,
      roughness: 0.35,
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
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

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
      renderer.dispose();
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
    <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl bg-gradient-to-b from-[#F7F4EE] to-[#EFECE4] border border-[#EAE6DF] overflow-hidden flex items-center justify-center shadow-sm">
      {/* Subtle ambient lens flare / glow behind carton */}
      <div className="absolute w-72 h-72 rounded-full bg-[#1E3A2F]/5 blur-3xl pointer-events-none" />

      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Aesthetic Overlay Badge */}
      <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#EAE6DF] text-xs text-[#1E3A2F] backdrop-blur-md shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
        <span className="font-medium tracking-tight">Interactive 3D Inspector</span>
      </div>

      <div className="absolute bottom-4 right-4 text-[11px] text-[#78716C] bg-white/70 px-2.5 py-1 rounded-md border border-[#EAE6DF]/70 backdrop-blur-sm pointer-events-none">
        Hover & move to inspect package
      </div>
    </div>
  );
}
