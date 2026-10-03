"use client";

import React from "react";
import { ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface NavbarProps {
  isBackendHealthy: boolean;
  indexedCount?: number;
}

export function Navbar({ isBackendHealthy, indexedCount = 372 }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE6DF] bg-[#FAF8F5]/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo & Editorial Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A2F] flex items-center justify-center text-[#F7F4EE] shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#CBE0D4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#1C1917] tracking-tight text-xl sm:text-2xl">
                TaqwaLens
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F5F2] border border-[#CBE0D4] text-[#1E3A2F]">
                Verified
              </span>
            </div>
            <p className="text-xs text-[#78716C] tracking-normal hidden sm:block">
              Mindful Food & Ingredient Auditor
            </p>
          </div>
        </div>

        {/* Status Indicators & Standards Reference */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE6DF] text-[#78716C] shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#2D5A46]" />
            <span>{indexedCount}+ Standard Additives Cataloged</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE6DF] text-[#1C1917] shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendHealthy ? "bg-[#22C55E]" : "bg-[#EF4444]"
              }`}
            />
            <span className="font-medium text-xs">
              {isBackendHealthy ? "Auditor Active" : "Service Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
