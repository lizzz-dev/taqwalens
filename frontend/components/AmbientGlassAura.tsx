"use client";

import React, { useEffect, useRef, useState } from "react";

export function AmbientGlassAura() {
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;
      targetOffsetRef.current = {
        x: normX * 24,
        y: normY * 18,
      };
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    const updateMotion = () => {
      const lerp = 0.05;
      currentOffsetRef.current.x +=
        (targetOffsetRef.current.x - currentOffsetRef.current.x) * lerp;
      currentOffsetRef.current.y +=
        (targetOffsetRef.current.y - currentOffsetRef.current.y) * lerp;

      setPointerOffset({
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
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[#FAF8F5]"
    >
      {/* 1. Wide diffused seamless ambient green glow across the hero */}
      <div
        className="absolute top-0 left-0 right-0 h-[680px] sm:h-[780px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-[#FAF8F5]/80 to-[#FAF8F5] transition-transform duration-500 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${pointerOffset.x * 0.4}px, ${pointerOffset.y * 0.3}px, 0)`,
        }}
      />

      {/* 2. Soft feathered emerald aura for seamless blend across entire width */}
      <div
        className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[1100px] sm:w-[1400px] h-[520px] rounded-full bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent blur-3xl pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(calc(-50% + ${pointerOffset.x}px), ${pointerOffset.y}px, 0)`,
        }}
      />

      {/* 3. Subtle warm golden accent shimmer */}
      <div
        className="absolute top-[5%] right-[15%] w-[450px] h-[350px] rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none"
      />
    </div>
  );
}
