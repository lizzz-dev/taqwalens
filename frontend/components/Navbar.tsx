"use client";

import React, { useEffect } from "react";
import { Search, Clock, Scale, User, LogOut } from "lucide-react";
import { MadhhabProfile, UserProfile } from "../lib/types";
import { Logo3D } from "./3d/Logo3D";

interface NavbarProps {
  isBackendHealthy?: boolean;
  indexedCount?: number;
  historyCount?: number;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
  selectedMadhhab?: MadhhabProfile;
  onChangeMadhhab?: (m: MadhhabProfile) => void;
  currentUser?: UserProfile | null;
  onOpenAuthGateway?: () => void;
}

export function Navbar({
  historyCount = 0,
  onOpenHistory,
  onOpenSearch,
  selectedMadhhab = "standard",
  onChangeMadhhab,
  currentUser,
  onOpenAuthGateway,
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

            {/* Elegant Subtle Islamic Editorial Typography */}
            <div className="flex flex-col justify-center">
              <span className="font-serif font-bold text-2xl sm:text-3xl lg:text-[34px] tracking-[0.025em] text-[#1C1917] leading-none select-none">
                TaqwaLens
              </span>
              <p className="text-[10px] sm:text-[11px] text-[#78716C] tracking-[0.08em] uppercase font-medium mt-1 hidden sm:block">
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

            {onOpenAuthGateway && (
              <button
                onClick={onOpenAuthGateway}
                className="w-10 h-10 rounded-full bg-[#1E3A2F] text-[#D4AF37] font-serif text-xs font-bold flex items-center justify-center border border-[#D4AF37]/50 shadow-2xs active:scale-95"
                title="Switch Auditor Profile or Sign Out"
              >
                {currentUser?.avatarInitials || "TL"}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Controls: Instant Additive Search, Fiqh Profile Selector, History Drawer, User Profile */}
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

          {/* Auditor Profile Chip / Switch Profile Button */}
          {onOpenAuthGateway && (
            <button
              onClick={onOpenAuthGateway}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D4AF37]/60 hover:border-[#1E3A2F] text-xs font-semibold text-[#1C1917] shadow-2xs transition-all active:scale-95 min-h-[40px] group"
              title="Click to view 3D Auditor Credential, switch profile, or sign out"
            >
              <div className="w-6 h-6 rounded-full bg-[#1E3A2F] text-[#D4AF37] font-serif text-[11px] font-bold flex items-center justify-center border border-[#D4AF37]/50 group-hover:scale-105 transition-transform">
                {currentUser?.avatarInitials || "⚡"}
              </div>
              <span className="max-w-[120px] truncate text-[11px]">
                {currentUser?.name || "Guest Pass"}
              </span>
              <LogOut className="w-3 h-3 text-[#78716C] group-hover:text-[#1E3A2F] transition-colors ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
