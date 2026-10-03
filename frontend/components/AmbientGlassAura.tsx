"use client";

import React, { useEffect, useRef, useState } from "react";

export function AmbientGlassAura() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Pointer move listener with normalized coordinate mapping (-1 to 1)
    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;

      // Subtle target shift: max 35px horizontal, 25px vertical
      targetOffsetRef.current = {
        x: normX * 35,
        y: normY * 25,
      };
    };

    const handlePointerLeave = () => {
      targetOffsetRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    // Smooth 60fps spring interpolation (lerp) loop
    const updateMotion = () => {
      const lerpFactor = 0.04;
      currentOffsetRef.current.x +=
        (targetOffsetRef.current.x - currentOffsetRef.current.x) * lerpFactor;
      currentOffsetRef.current.y +=
        (targetOffsetRef.current.y - currentOffsetRef.current.y) * lerpFactor;

      setOffset({
        x: Math.round(currentOffsetRef.current.x * 100) / 100,
        y: Math.round(currentOffsetRef.current.y * 100) / 100,
      });

      animFrameRef.current = requestAnimationFrame(updateMotion);
    };

    animFrameRef.current = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-20 transition-transform duration-300 ease-out"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
    >
      {/* 1. Radiant Warm Gold Caustic Orb (Top-Left / Center) */}
      <div
        className="absolute top-[5%] left-[10%] w-[520px] sm:w-[680px] h-[440px] sm:h-[560px] rounded-full blur-[110px] sm:blur-[130px] opacity-[0.07] animate-aura-1"
        style={{
          background:
            "radial-gradient(ellipse at center, #D4AF37 0%, #F5E084 45%, rgba(212, 175, 55, 0) 70%)",
        }}
      />

      {/* 2. Deep Botanical Sage Caustic Orb (Bottom-Right / Center) */}
      <div
        className="absolute bottom-[8%] right-[8%] w-[580px] sm:w-[740px] h-[480px] sm:h-[620px] rounded-full blur-[120px] sm:blur-[140px] opacity-[0.08] animate-aura-2"
        style={{
          background:
            "radial-gradient(ellipse at center, #1E3A2F 0%, #2D5A46 50%, rgba(30, 58, 47, 0) 72%)",
        }}
      />

      {/* 3. Prismatic Frosted Emerald/Pearl Sheen (Floating Center-Offset) */}
      <div
        className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full blur-[100px] sm:blur-[120px] opacity-[0.05] animate-aura-3"
        style={{
          background:
            "radial-gradient(circle at center, #10B981 0%, #FEF08A 35%, rgba(16, 185, 129, 0) 68%)",
        }}
      />

      {/* Subtle Micro-Prismatic Caustic Ribbon for Organic Glass Sheen */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #FAF8F5 10%, transparent 60%)",
        }}
      />
    </div>
  );
}
