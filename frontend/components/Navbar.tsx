"use client";

import React, { useEffect } from "react";
import { Search, Clock, Scale } from "lucide-react";
import { MadhhabProfile } from "../lib/types";
import { Logo3D } from "./3d/Logo3D";

interface NavbarProps {
  isBackendHealthy?: boolean;
  indexedCount?: number;
  historyCount?: number;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
  selectedMadhhab?: MadhhabProfile;
  onChangeMadhhab?: (m: MadhhabProfile) => void;
}

export function Navbar({
  historyCount = 0,
  onOpenHistory,
  onOpenSearch,
  selectedMadhhab = "standard",
  onChangeMadhhab,
}: NavbarProps) {
  // Global Ctrl+K / Cmd+K listener for instant search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE6DF] bg-[#FAF8F5]/92 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Editorial Stylish Title */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-3.5">
            {/* Pop-up 3D Interactive Emblem */}
            <Logo3D className="w-12 h-12 sm:w-13 sm:h-13" />

            {/* Elegant Stylish Editorial Typography */}
            <div>
              <div className="flex items-baseline">
                <span className="font-serif font-black text-2xl sm:text-3xl lg:text-[34px] tracking-tight text-[#1C1917] leading-none">
                  Taqwa
                </span>
                <span className="font-serif italic font-normal text-2xl sm:text-3xl lg:text-[34px] tracking-normal text-[#1E3A2F] leading-none ml-1">
                  Lens
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#78716C] tracking-wide font-normal mt-1 hidden md:block">
                Mindful Food & Ingredient Auditor
              </p>
            </div>
          </div>

          {/* Mobile Actions: Search & History */}
          <div className="sm:hidden flex items-center gap-2">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-full bg-white border border-[#EAE6DF] text-[#1C1917] shadow-2xs active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Search E-codes"
              >
                <Search className="w-4 h-4 text-[#1E3A2F]" />
              </button>
            )}

            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#EAE6DF] text-xs font-medium text-[#1C1917] shadow-2xs active:scale-95 min-h-[40px]"
              >
                <Clock className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span>History</span>
                {historyCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#1E3A2F] text-white text-[10px] flex items-center justify-center font-bold">
                    {historyCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Controls: Instant Additive Search, Fiqh Profile Selector, History Drawer */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3 text-xs">
          {/* Instant E-Code Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#EAE6DF] text-xs text-[#78716C] hover:text-[#1C1917] hover:border-[#1E3A2F]/40 shadow-2xs transition-all active:scale-95 min-h-[40px]"
              title="Search certified E-numbers and ingredients (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#1E3A2F]" />
              <span className="font-medium">Search Additives...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#FAF8F5] border border-[#EAE6DF] rounded-md text-[#A8A29E]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Madhhab Juristic Profile Selector */}
          {onChangeMadhhab && (
            <div className="flex items-center gap-1.5 bg-white border border-[#EAE6DF] rounded-full px-3 py-1.5 shadow-2xs min-h-[40px]">
              <Scale className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" />
              <label htmlFor="madhhab-select" className="text-[11px] text-[#78716C] font-medium hidden lg:inline">
                Fiqh:
              </label>
              <select
                id="madhhab-select"
                value={selectedMadhhab}
                onChange={(e) => onChangeMadhhab(e.target.value as MadhhabProfile)}
                className="bg-transparent text-xs font-semibold text-[#1C1917] focus:outline-none cursor-pointer pr-1"
                title="Select juristic school of thought for additive rulings"
              >
                <option value="standard">Standard (Consensus)</option>
                <option value="hanafi">Hanafi (Strict Carmine)</option>
                <option value="shafii">Shafi'i (Strict Marine)</option>
                <option value="strict">Strict / Wara' (Precautionary)</option>
              </select>
            </div>
          )}

          {/* Desktop History Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#EAE6DF] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] hover:border-[#1E3A2F]/40 transition-colors shadow-2xs active:scale-95 min-h-[40px]"
            >
              <Clock className="w-3.5 h-3.5 text-[#1E3A2F]" />
              <span>Recent History</span>
              {historyCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#1E3A2F] text-white text-[10px] flex items-center justify-center font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
