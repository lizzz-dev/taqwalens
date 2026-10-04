"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShieldCheck, CheckCircle2, Sparkles, RotateCcw } from "lucide-react";

export function Compliance3DShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // References for mouse / touch interaction & smooth spring physics
  const pointer = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isDown: false,
    startX: 0,
    startY: 0,
    dragYaw: 0,
    targetDragYaw: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 300;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. High-End Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdf7, 2.4);
    scene.add(ambientLight);

    // Warm Key Light for brilliant gold specular glints
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Soft Mint-Emerald Fill Light
    const fillLight = new THREE.DirectionalLight(0xdcfce7, 1.4);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Golden Rim Light from below
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    rimLight.position.set(0, -3, 3);
    scene.add(rimLight);

    // Top glint light
    const topLight = new THREE.PointLight(0xffffff, 1.2, 10);
    topLight.position.set(0, 3, 2);
    scene.add(topLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Disposables holder for clean unmount
    const disposables: { dispose: () => void }[] = [];

    // Helper: Build Perfectly Upright & Crisp Canvas Texture for Medallion Face
    const createMedallionTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Deep Emerald Radial Gradient
        const grad = ctx.createRadialGradient(512, 512, 80, 512, 512, 510);
        grad.addColorStop(0, "#1F3D30");
        grad.addColorStop(0.55, "#162E24");
        grad.addColorStop(0.85, "#0E1F18");
        grad.addColorStop(1, "#07100C");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Outer Double Gold Ring Bezel
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(512, 512, 475, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#FDF8EC";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(512, 512, 452, 0, Math.PI * 2);
        ctx.stroke();

        // Decorative Beaded Inner Ring
        ctx.fillStyle = "#E5C158";
        const totalDots = 48;
        for (let i = 0; i < totalDots; i++) {
          const angle = (i / totalDots) * Math.PI * 2;
          const x = 512 + Math.cos(angle) * 436;
          const y = 512 + Math.sin(angle) * 436;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Concentric Arabesque 8-point star watermark
        ctx.strokeStyle = "rgba(212, 175, 55, 0.22)";
        ctx.lineWidth = 6;
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.translate(512, 512);
          ctx.rotate((i * Math.PI) / 4);
          ctx.strokeRect(-290, -290, 580, 580);
          ctx.restore();
        }

        // Arabic Calligraphy: حلال (HALAL)
        ctx.fillStyle = "#FDF3D6";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 136px 'Cinzel', 'Amiri', 'Playfair Display', serif";
        ctx.fillText("حلال", 512, 385);

        // Primary Brand Name: TAQWALENS
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 58px 'Inter', system-ui, sans-serif";
        ctx.letterSpacing = "6px";
        ctx.fillText("TAQWALENS", 512, 515);

        // Verification Badge Subtitle
        ctx.fillStyle = "#A7F3D0";
        ctx.font = "600 28px 'JetBrains Mono', monospace";
        ctx.letterSpacing = "3px";
        ctx.fillText("VERIFIED INGREDIENT PURITY", 512, 585);

        // Gold divider line
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(330, 625);
        ctx.lineTo(694, 625);
        ctx.stroke();

        // Certification standards alignment
        ctx.fillStyle = "#F5D061";
        ctx.font = "bold 26px 'Inter', sans-serif";
        ctx.letterSpacing = "1px";
        ctx.fillText("★  JAKIM • IFANCA • CODEX ALIGNED  ★", 512, 675);

        // Multi-Madhhab juristic clarity
        ctx.fillStyle = "#E7E5E4";
        ctx.font = "500 21px 'JetBrains Mono', monospace";
        ctx.letterSpacing = "2px";
        ctx.fillText("HANAFI • SHAFI'I • MALIKI • HANBALI", 512, 730);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      disposables.push(tex);
      return tex;
    };

    // Build Halal Trust Seal Group
    const crestGroup = new THREE.Group();
    rootGroup.add(crestGroup);

    // Premium Metallic Gold Material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.16,
    });
    disposables.push(goldMat);

    // Deep Emerald Core Material
    const emeraldRimMat = new THREE.MeshStandardMaterial({
      color: 0x142b21,
      metalness: 0.45,
      roughness: 0.25,
    });
    disposables.push(emeraldRimMat);

    // 1. 8-Pointed Star Medallion (Two overlapping rotated beveled square prisms)
    const boxGeo = new THREE.BoxGeometry(2.35, 2.35, 0.18);
    disposables.push(boxGeo);

    // Square 1: Perfectly straight & level (rotation.z = 0)
    const starSquare1 = new THREE.Mesh(boxGeo, goldMat);
    crestGroup.add(starSquare1);

    // Square 2: Rotated 45° around Z to form 8-pointed Rub el Hizb star
    const starSquare2 = new THREE.Mesh(boxGeo, goldMat);
    starSquare2.rotation.z = Math.PI / 4;
    crestGroup.add(starSquare2);

    // Outer Raised Gold Rim for the Center Seal
    const outerRimGeo = new THREE.TorusGeometry(1.28, 0.05, 16, 64);
    disposables.push(outerRimGeo);
    const outerRimMesh = new THREE.Mesh(outerRimGeo, goldMat);
    outerRimMesh.position.z = 0.11;
    crestGroup.add(outerRimMesh);

    // Cylindrical Gold Edge / Body for Medallion Core
    const cylGeo = new THREE.CylinderGeometry(1.26, 1.26, 0.22, 64);
    disposables.push(cylGeo);
    const cylMesh = new THREE.Mesh(cylGeo, goldMat);
    cylMesh.rotation.x = Math.PI / 2;
    crestGroup.add(cylMesh);

    // Front Face (CircleGeometry guarantees perfectly upright, zero-tilt UV mapping)
    const faceGeo = new THREE.CircleGeometry(1.24, 64);
    disposables.push(faceGeo);

    const medallionTex = createMedallionTexture();
    const frontFaceMat = new THREE.MeshStandardMaterial({
      map: medallionTex,
      roughness: 0.2,
      metalness: 0.35,
    });
    disposables.push(frontFaceMat);

    // Front Face directly facing camera on +Z
    const frontFaceMesh = new THREE.Mesh(faceGeo, frontFaceMat);
    frontFaceMesh.position.z = 0.115;
    crestGroup.add(frontFaceMesh);

    // Back Face (also upright texture on -Z so if rotated it remains elegant)
    const backFaceMesh = new THREE.Mesh(faceGeo, frontFaceMat);
    backFaceMesh.position.z = -0.115;
    backFaceMesh.rotation.y = Math.PI;
    crestGroup.add(backFaceMesh);

    // 2. Dual Gyroscopic Orbital Rings (slowly rotating independently around the star)
    const ringsGroup = new THREE.Group();
    rootGroup.add(ringsGroup);

    const ring1Geo = new THREE.TorusGeometry(1.88, 0.03, 16, 96);
    disposables.push(ring1Geo);
    const ring1Mesh = new THREE.Mesh(ring1Geo, goldMat);
    ring1Mesh.rotation.x = Math.PI / 3.2;
    ringsGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(1.68, 0.024, 16, 96);
    disposables.push(ring2Geo);
    const ring2Mesh = new THREE.Mesh(ring2Geo, goldMat);
    ring2Mesh.rotation.y = Math.PI / 3.4;
    ringsGroup.add(ring2Mesh);

    // 3. Ambient Floating Golden Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 36;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 4.6;
      posArray[i + 1] = (Math.random() - 0.5) * 3.4;
      posArray[i + 2] = (Math.random() - 0.5) * 2.8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    disposables.push(particleGeo);

    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    disposables.push(particleMat);

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    // Pointer Event Listeners:
    // Mouse hover creates subtle 3D lighting tilt; drag allows inspecting yaw up to +/- 50°,
    // and springs smoothly back to center so text is always easy to read!
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();

      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      pointer.current.targetX = Math.max(-1, Math.min(1, nx));
      pointer.current.targetY = Math.max(-1, Math.min(1, ny));

      if (pointer.current.isDown) {
        const deltaX = clientX - pointer.current.startX;
        // Clamp drag yaw to +/- 0.85 rad (~48 degrees) so the crest stays readable and never inverts
        pointer.current.targetDragYaw = Math.max(-0.85, Math.min(0.85, deltaX * 0.007));
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      pointer.current.isDown = true;
      setIsDragging(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      pointer.current.startX = clientX - pointer.current.dragYaw / 0.007;
      pointer.current.startY = clientY;
    };

    const handlePointerUp = () => {
      pointer.current.isDown = false;
      setIsDragging(false);
      // Smoothly spring back to 0 so the crest turns back to face forward!
      pointer.current.targetDragYaw = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    // 4. Smooth Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer interpolation
      pointer.current.currentX += (pointer.current.targetX - pointer.current.currentX) * 0.07;
      pointer.current.currentY += (pointer.current.targetY - pointer.current.currentY) * 0.07;

      // Spring drag yaw back to target
      pointer.current.dragYaw += (pointer.current.targetDragYaw - pointer.current.dragYaw) * 0.08;

      // Gentle, readable oscillation:
      // Turns smoothly left and right by ~18° (0.32 rad), then turns right back to center!
      // This showcases the rich 3D gold bevels while guaranteeing text is always upright & legible.
      const idleYaw = Math.sin(elapsedTime * 0.75) * 0.28;
      const totalYaw = idleYaw + pointer.current.currentX * 0.22 + pointer.current.dragYaw;

      // Subtle pitch tilt from cursor (clamped to +/- 0.15 rad / ~8°)
      const totalPitch = pointer.current.currentY * 0.16 + Math.sin(elapsedTime * 0.5) * 0.03;

      // Apply to crest
      crestGroup.rotation.y = totalYaw;
      crestGroup.rotation.x = totalPitch;
      // STRICTLY ENFORCE ZERO ROLL: Writing remains perfectly horizontal & straight!
      crestGroup.rotation.z = 0;

      // Gentle vertical floating breathing motion
      crestGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.05;

      // Gyroscopic orbital rings rotate smoothly in 3D around the medallion
      ringsGroup.rotation.y += delta * 0.45;
      ringsGroup.rotation.x = Math.sin(elapsedTime * 0.6) * 0.15;
      ringsGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.05;

      // Sparkle particles gentle drift
      particleSystem.rotation.y += delta * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          camera.aspect = cr.width / cr.height;
          camera.updateProjectionMatrix();
          renderer.setSize(cr.width, cr.height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      try {
        renderer.forceContextLoss();
        renderer.dispose();
      } catch {}
      disposables.forEach((d) => d.dispose());
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#EAE6DF] rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden transition-all hover:border-[#1E3A2F]/30 hover:shadow-sm select-none"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

      {/* Main 2-Column Responsive Layout */}
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10">
        {/* Left Information Column */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5 pr-0 lg:pr-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 px-3 py-1 rounded-full w-fit shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Authoritative Halal Trust Seal</span>
          </div>

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] leading-tight">
            Continuous Multi-Jurisdiction Ingredient Audit
          </h3>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Every additive and processing aid audited by TaqwaLens is cross-referenced against authoritative international Halal standards—including{" "}
            <strong className="text-[#1C1917] font-semibold">JAKIM MS 1500:2019</strong>,{" "}
            <strong className="text-[#1C1917] font-semibold">IFANCA</strong>, and{" "}
            <strong className="text-[#1C1917] font-semibold">Codex Alimentarius Class 1</strong>.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-white border border-[#EAE6DF] shadow-2xs">
              <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-wider block">Database Depth</span>
              <span className="text-xs font-bold text-[#1E3A2F]">370+ Indexed Additives</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#EAE6DF] shadow-2xs">
              <span className="text-[10px] font-mono text-[#78716C] uppercase tracking-wider block">Madhhab Coverage</span>
              <span className="text-xs font-bold text-[#1E3A2F]">All 4 Primary Schools</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 text-[11px] text-[#78716C]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Upright Legibility
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Drag to Inspect 3D Luster
            </span>
          </div>
        </div>

        {/* Right 3D Interactive Viewport Stage */}
        <div className="lg:col-span-7 w-full h-[270px] sm:h-[310px] rounded-xl relative cursor-grab active:cursor-grabbing touch-pan-y flex items-center justify-center">
          <div ref={containerRef} className="w-full h-full touch-pan-y" />

          {/* Interactive Hint / Status Badge */}
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#78716C] bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#EAE6DF] shadow-2xs pointer-events-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive 3D Crest • Springs Back to Center</span>
          </div>
        </div>
      </div>
    </div>
  );
}
