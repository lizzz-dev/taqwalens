"use client";

import React, { useEffect, useRef, useState } from "react";

export function AmbientGlassAura() {
  const [pointerPos, setPointerPos] = useState({ x: 50, y: 35 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const targetPointerRef = useRef({ x: 50, y: 35 });
  const currentPointerRef = useRef({ x: 50, y: 35 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const px = (e.clientX / innerWidth) * 100;
      const py = (e.clientY / innerHeight) * 100;
      targetPointerRef.current = { x: px, y: py };

      // Parallax shift for ambient orbs
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;
      targetOffsetRef.current = {
        x: normX * 55,
        y: normY * 40,
      };
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // Smooth spring lerp animation loop (60 FPS)
    const updateMotion = () => {
      const lerpFactor = 0.05;

      currentPointerRef.current.x +=
        (targetPointerRef.current.x - currentPointerRef.current.x) * lerpFactor;
      currentPointerRef.current.y +=
        (targetPointerRef.current.y - currentPointerRef.current.y) * lerpFactor;

      currentOffsetRef.current.x +=
        (targetOffsetRef.current.x - currentOffsetRef.current.x) * lerpFactor;
      currentOffsetRef.current.y +=
        (targetOffsetRef.current.y - currentOffsetRef.current.y) * lerpFactor;

      setPointerPos({
        x: Math.round(currentPointerRef.current.x * 10) / 10,
        y: Math.round(currentPointerRef.current.y * 10) / 10,
      });

      setParallaxOffset({
        x: Math.round(currentOffsetRef.current.x * 10) / 10,
        y: Math.round(currentOffsetRef.current.y * 10) / 10,
      });

      animFrameRef.current = requestAnimationFrame(updateMotion);
    };

    animFrameRef.current = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* Container responding to pointer parallax */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
        }}
      >
        {/* 1. Radiant Sunlit Gold & Amber Caustic (Top-Left / Center Drift) */}
        <div
          className="absolute -top-[10%] left-[5%] w-[600px] sm:w-[850px] h-[550px] sm:h-[750px] rounded-full blur-[90px] sm:blur-[120px] opacity-[0.28] animate-aura-1 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(ellipse at center, #F59E0B 0%, #D4AF37 40%, rgba(212, 175, 55, 0.2) 65%, transparent 80%)",
          }}
        />

        {/* 2. Lush Botanical Emerald & Sage Caustic (Bottom-Right / Center Drift) */}
        <div
          className="absolute bottom-[5%] right-[5%] w-[650px] sm:w-[900px] h-[580px] sm:h-[800px] rounded-full blur-[100px] sm:blur-[130px] opacity-[0.25] animate-aura-2 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(ellipse at center, #10B981 0%, #1E3A2F 45%, rgba(30, 58, 47, 0.2) 68%, transparent 85%)",
          }}
        />

        {/* 3. Prismatic Cyan-Emerald Pearl Shimmer (Center Floating) */}
        <div
          className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full blur-[80px] sm:blur-[110px] opacity-[0.20] animate-aura-3 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(circle at center, #06B6D4 0%, #10B981 35%, #FDE047 60%, transparent 75%)",
          }}
        />

        {/* 4. Interactive Specular Glass Highlight that follows cursor */}
        <div
          className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-[0.35] pointer-events-none transition-opacity duration-500"
          style={{
            left: `${pointerPos.x}%`,
            top: `${pointerPos.y}%`,
            background:
              "radial-gradient(circle at center, rgba(254, 240, 138, 0.6) 0%, rgba(212, 175, 55, 0.3) 35%, rgba(16, 185, 129, 0.15) 55%, transparent 75%)",
          }}
        />

        {/* 5. Micro-Prismatic Caustic Overlay Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #FAF8F5 10%, transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}
