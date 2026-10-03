"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Sparkles, RefreshCw } from "lucide-react";

// Dynamic import with ssr: false to prevent Next.js server rendering mismatch
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SplineLoadingSkeleton />,
});

function SplineLoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[460px] flex flex-col items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.8),transparent_70%)]" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 animate-pulse">
          <Box className="w-6 h-6 animate-spin" style={{ animationDuration: "6s" }} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-300">
            Mounting 3D Spatial Canvas
          </p>
          <p className="text-[11px] font-mono text-slate-500">
            Connecting Spline Runtime Engine...
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeroSpline() {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl group transition-all duration-300 hover:border-slate-700/80">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-slate-800/40 blur-3xl pointer-events-none" />

      {/* Cybernetic HUD Frame Markers */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-20 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
          Spatial 3D Model • TaqwaLens Core
        </span>
      </div>

      <div className="absolute bottom-3 right-3 z-20 pointer-events-none text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80 backdrop-blur-sm">
        Drag to Rotate • Mouse Orbit
      </div>

      {/* Main 3D Spline Canvas */}
      {!hasError ? (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
          <Spline
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              console.warn("Spline CDN load error, falling back to procedural mesh:", e);
              setHasError(true);
            }}
          />
        </div>
      ) : (
        /* Graceful fallback if offline or restricted CDN */
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950/80">
          <div className="w-28 h-28 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center text-emerald-400 mb-4 relative animate-pulse">
            <Box className="w-12 h-12" />
            <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/40 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            Interactive 3D Optical Matrix
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs font-mono">
            3D WebGL Holographic Scanner Ready
          </p>
        </div>
      )}
    </div>
  );
}
