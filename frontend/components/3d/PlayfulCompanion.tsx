"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { Sparkles, Bot, Heart, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic Spline import with ssr: false for zero hydration mismatches
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <CompanionSkeleton />,
});

function CompanionSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100/60 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-inner mb-3">
        <Bot className="w-8 h-8 animate-bounce" />
      </div>
      <p className="text-xs font-serif font-bold text-[#1C1917]">
        Waking up 3D Companion...
      </p>
      <p className="text-[10px] text-[#78716C] mt-0.5 font-mono">
        Connecting playful physics engine
      </p>
    </div>
  );
}

// Procedural, joyful bubble-pop sound via Web Audio API (zero audio file dependencies)
function playBubblePopSound(isMuted: boolean) {
  if (isMuted || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;

    // Cheerful bubbly pitch contour: quick rise, soft harmonic pop
    const baseFreq = 340 + Math.random() * 120;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch {
    // Audio synthesis fallback (silent)
  }
}

const PLAYFUL_QUOTES = [
  "Bismillah! Inspecting snacks with you ✨",
  "Boing! Halal vibes only! 💚",
  "Hehe, that tickles! 😋",
  "No hidden pig gelatin on my watch! 🛡️",
  "100% plant-based squish! 🍃",
  "Keep auditing, you're doing amazing! 🌟",
  "Mmm, certifiably mindful snack choices! 🍪",
  "Poked with Taqwa & care! 💫",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  icon: string;
}

export function PlayfulCompanion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [currentQuote, setCurrentQuote] = useState<string>(PLAYFUL_QUOTES[0]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [companionMode, setCompanionMode] = useState<"mascot" | "spline">("mascot");
  const [splineError, setSplineError] = useState<boolean>(false);

  // References for Three.js physics & mouse tracking
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const squashScale = useRef({ x: 1, y: 1, velX: 0, velY: 0 });
  const isPoking = useRef(false);

  // Trigger squishy poke animation
  const handlePoke = useCallback(
    (e?: React.MouseEvent) => {
      // Squash mascot
      squashScale.current.y = 0.58;
      squashScale.current.x = 1.34;
      squashScale.current.velY = 0.12;

      setPokeCount((prev) => prev + 1);
      playBubblePopSound(isMuted);

      // Random cheeky quote
      const nextQuote = PLAYFUL_QUOTES[Math.floor(Math.random() * PLAYFUL_QUOTES.length)];
      setCurrentQuote(nextQuote);

      // Spawn floating celebration particles
      const clientX = e?.clientX || (typeof window !== "undefined" ? window.innerWidth / 2 : 200);
      const clientY = e?.clientY || (typeof window !== "undefined" ? window.innerHeight / 2 : 200);

      const icons = ["✨", "💚", "✦", "🌟", "🍃", "💖"];
      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40,
        icon: icons[Math.floor(Math.random() * icons.length)],
      };

      setParticles((prev) => [...prev.slice(-6), newParticle]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1000);
    },
    [isMuted]
  );

  // Initialize Kawaii Three.js Mascot
  useEffect(() => {
    if (companionMode !== "mascot") return;
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 240;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.6);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f4ea, 1.4);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.2);
    rimLight.position.set(0, -2, -2);
    scene.add(rimLight);

    // 3. Mascot Character Hierarchy
    const mascotGroup = new THREE.Group();
    scene.add(mascotGroup);

    // Body: Soft Glossy Emerald/Jade Marshmallow Sphere
    const bodyGeo = new THREE.SphereGeometry(1.0, 36, 36);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf, // Luminous teal-mint
      roughness: 0.22,
      metalness: 0.08,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    mascotGroup.add(bodyMesh);

    // Left & Right Sclera (White Eyes)
    const scleraGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const scleraMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });
    const leftEyeWhite = new THREE.Mesh(scleraGeo, scleraMat);
    leftEyeWhite.position.set(-0.36, 0.16, 0.88);
    mascotGroup.add(leftEyeWhite);

    const rightEyeWhite = new THREE.Mesh(scleraGeo, scleraMat);
    rightEyeWhite.position.set(0.36, 0.16, 0.88);
    mascotGroup.add(rightEyeWhite);

    // Left & Right Pupils (Deep Glossy Espresso, tracks cursor)
    const pupilGeo = new THREE.SphereGeometry(0.12, 20, 20);
    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.05,
    });
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.36, 0.16, 1.05);
    mascotGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.36, 0.16, 1.05);
    mascotGroup.add(rightPupil);

    // Kawaii Eye Twinkle Highlights
    const glintGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftGlint = new THREE.Mesh(glintGeo, glintMat);
    leftGlint.position.set(-0.32, 0.21, 1.13);
    mascotGroup.add(leftGlint);

    const rightGlint = new THREE.Mesh(glintGeo, glintMat);
    rightGlint.position.set(0.40, 0.21, 1.13);
    mascotGroup.add(rightGlint);

    // Eyelids for Autonomous Blinking
    const eyelidGeo = new THREE.SphereGeometry(0.25, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const eyelidMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      roughness: 0.25,
    });
    const leftEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    leftEyelid.position.set(-0.36, 0.16, 0.89);
    leftEyelid.rotation.x = Math.PI;
    leftEyelid.scale.set(1, 0, 1);
    mascotGroup.add(leftEyelid);

    const rightEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    rightEyelid.position.set(0.36, 0.16, 0.89);
    rightEyelid.rotation.x = Math.PI;
    rightEyelid.scale.set(1, 0, 1);
    mascotGroup.add(rightEyelid);

    // Rosy Blushing Cheeks
    const cheekGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const cheekMat = new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      roughness: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.54, -0.06, 0.82);
    leftCheek.scale.set(1.2, 0.7, 0.4);
    mascotGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.54, -0.06, 0.82);
    rightCheek.scale.set(1.2, 0.7, 0.4);
    mascotGroup.add(rightCheek);

    // Sweet Kawaii Smile
    const mouthGeo = new THREE.TorusGeometry(0.12, 0.026, 12, 24, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.rotation.z = Math.PI;
    mouthMesh.position.set(0, -0.14, 0.96);
    mascotGroup.add(mouthMesh);

    // Golden Halo / Star Antenna
    const stalkGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.45, 12);
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2,
    });
    const stalkMesh = new THREE.Mesh(stalkGeo, stalkMat);
    stalkMesh.position.set(0, 1.15, 0);
    mascotGroup.add(stalkMesh);

    const haloGeo = new THREE.TorusGeometry(0.24, 0.04, 16, 32);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 1.45, 0);
    mascotGroup.add(haloMesh);

    // Soft Ambient Ground Shadow
    const shadowGeo = new THREE.RingGeometry(0, 0.95, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a2f,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.38, 0);
    scene.add(shadowMesh);

    // 4. Mouse Pointer Tracking Listener
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = Math.max(-1.2, Math.min(1.2, x));
      mousePos.current.targetY = Math.max(-1.2, Math.min(1.2, y));
    };

    window.addEventListener("pointermove", handlePointerMove);

    // 5. Animation Loop with Squishy Spring Physics & Blinking
    let animId: number;
    let clock = new THREE.Clock();
    let nextBlinkTime = 2.5;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      // Subtle gentle head rotation
      mascotGroup.rotation.y = mousePos.current.x * 0.45;
      mascotGroup.rotation.x = -mousePos.current.y * 0.35;

      // Eye pupils track cursor physics
      const pupilOffsetX = mousePos.current.x * 0.08;
      const pupilOffsetY = mousePos.current.y * 0.08;
      leftPupil.position.x = -0.36 + pupilOffsetX;
      leftPupil.position.y = 0.16 + pupilOffsetY;
      rightPupil.position.x = 0.36 + pupilOffsetX;
      rightPupil.position.y = 0.16 + pupilOffsetY;

      leftGlint.position.x = -0.32 + pupilOffsetX * 0.6;
      leftGlint.position.y = 0.21 + pupilOffsetY * 0.6;
      rightGlint.position.x = 0.40 + pupilOffsetX * 0.6;
      rightGlint.position.y = 0.21 + pupilOffsetY * 0.6;

      // Idle hovering bob
      const hoverY = Math.sin(elapsedTime * 2.2) * 0.07;
      mascotGroup.position.y = hoverY;

      // Halo spin & wobble
      haloMesh.rotation.z = elapsedTime * 1.8;
      haloMesh.rotation.x = Math.sin(elapsedTime * 2.5) * 0.35;

      // Dynamic ground shadow scaling with hover
      shadowMesh.scale.setScalar(1.0 - hoverY * 0.5);

      // Spring-Damper Squish & Stretch Physics on Poke
      const tension = 0.24;
      const damping = 0.78;

      squashScale.current.velX += (1.0 - squashScale.current.x) * tension;
      squashScale.current.velX *= damping;
      squashScale.current.x += squashScale.current.velX;

      squashScale.current.velY += (1.0 - squashScale.current.y) * tension;
      squashScale.current.velY *= damping;
      squashScale.current.y += squashScale.current.velY;

      mascotGroup.scale.set(
        squashScale.current.x,
        squashScale.current.y,
        squashScale.current.x
      );

      // Autonomous Blinking Logic
      if (elapsedTime > nextBlinkTime) {
        const blinkProgress = (elapsedTime - nextBlinkTime) / 0.16;
        if (blinkProgress <= 1.0) {
          const blinkScale = Math.sin(blinkProgress * Math.PI);
          leftEyelid.scale.y = blinkScale;
          rightEyelid.scale.y = blinkScale;
        } else {
          leftEyelid.scale.y = 0;
          rightEyelid.scale.y = 0;
          nextBlinkTime = elapsedTime + 3.0 + Math.random() * 3.5;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Observer for natural flex filling
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
      bodyGeo.dispose();
      scleraGeo.dispose();
      pupilGeo.dispose();
      glintGeo.dispose();
      eyelidGeo.dispose();
      cheekGeo.dispose();
      mouthGeo.dispose();
      stalkGeo.dispose();
      haloGeo.dispose();
      shadowGeo.dispose();
    };
  }, [companionMode]);

  return (
    <div className="w-full h-full min-h-[220px] bg-white/85 backdrop-blur-md border border-[#EAE6DF] rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between relative overflow-hidden group select-none transition-all hover:border-[#1E3A2F]/30 hover:shadow-sm">
      {/* Background Soft Glow Aura */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#FAF8F5] blur-3xl pointer-events-none" />

      {/* Floating Micro-Header */}
      <div className="w-full flex items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/60 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Anti-Stress Companion</span>
          </span>

          <span
            onClick={handlePoke}
            className="text-[10px] text-[#78716C] bg-white border border-[#EAE6DF] hover:border-[#1E3A2F]/50 hover:text-[#1E3A2F] px-2 py-0.5 rounded-full font-medium cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Click to squish Noor!"
          >
            Poke me! 👆
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-black/5 transition-colors text-xs"
            title={isMuted ? "Unmute bubble pops" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Mode switch (Kawaii Mascot vs Spline Robot) */}
          <button
            type="button"
            onClick={() => {
              setCompanionMode(companionMode === "mascot" ? "spline" : "mascot");
              setSplineError(false);
            }}
            className="text-[10px] font-mono text-[#57534E] hover:text-[#1C1917] bg-[#FAF8F5] border border-[#EAE6DF] hover:border-[#1E3A2F]/40 px-2 py-0.5 rounded-md transition-all active:scale-95"
            title="Switch between 3D Noor Mascot and Spline Robot"
          >
            {companionMode === "mascot" ? "3D Robot ↗" : "Noor Mascot ↗"}
          </button>

          {/* Poke Counter Badge */}
          <span className="text-[11px] font-mono font-bold text-[#1E3A2F] bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md shadow-2xs">
            {pokeCount} {pokeCount === 1 ? "Poke" : "Pokes"}
          </span>
        </div>
      </div>

      {/* Floating Interactive Speech Bubble */}
      <div className="w-full flex justify-center my-1 z-10 shrink-0">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: -4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="px-3 py-1 rounded-full bg-white/95 border border-[#EAE6DF] shadow-2xs text-[11px] text-[#292524] font-medium flex items-center gap-1.5 max-w-[90%] truncate"
        >
          <span className="text-xs">💬</span>
          <span className="truncate">{currentQuote}</span>
        </motion.div>
      </div>

      {/* Main 3D Interactive Viewport */}
      <div
        onClick={handlePoke}
        className="relative w-full flex-1 min-h-[160px] flex items-center justify-center cursor-pointer select-none touch-none"
      >
        {companionMode === "mascot" ? (
          /* Three.js Zero-Dependency Kawaii Mascot */
          <div ref={containerRef} className="w-full h-full cursor-pointer active:cursor-grabbing" />
        ) : !splineError ? (
          /* Spline Interactive Robot Head (Option 1) */
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <Spline
              scene="https://prod.spline.design/kZDDjOSt19WigHQ5/scene.splinecode"
              onError={() => setSplineError(true)}
            />
          </div>
        ) : (
          /* Spline Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <Bot className="w-10 h-10 text-emerald-600 mb-2" />
            <p className="text-xs font-semibold text-[#1C1917]">Spline Offline Mode</p>
            <button
              onClick={() => setCompanionMode("mascot")}
              className="mt-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
            >
              Switch back to Noor Mascot
            </button>
          </div>
        )}

        {/* Floating Celebration Particles on Poke */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.6, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1.4,
                x: p.x,
                y: p.y - 70,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute pointer-events-none text-base z-30 drop-shadow-sm"
            >
              {p.icon}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Subtle Hint Bar at Bottom */}
      <div className="w-full flex items-center justify-between text-[10px] text-[#A8A29E] font-mono pt-1 border-t border-[#F0EBE1] shrink-0">
        <span>Cursor Tracking • Googly Eyes</span>
        <span>Tap / Click to Squish</span>
      </div>
    </div>
  );
}
