"use client";

import React from "react";
import { ShieldCheck, Sparkles, BookOpen, Clock, ChevronDown, Scale } from "lucide-react";
import { MadhhabProfile } from "../lib/types";

interface NavbarProps {
  isBackendHealthy: boolean;
  indexedCount?: number;
  historyCount?: number;
  onOpenHistory?: () => void;
  selectedMadhhab?: MadhhabProfile;
  onChangeMadhhab?: (m: MadhhabProfile) => void;
}

export function Navbar({
  isBackendHealthy,
  indexedCount = 372,
  historyCount = 0,
  onOpenHistory,
  selectedMadhhab = "standard",
  onChangeMadhhab,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE6DF] bg-[#FAF8F5]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-0 sm:h-18 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Logo & Editorial Title */}
        <div className="flex items-center justify-between sm:justify-start gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1E3A2F] flex items-center justify-center text-[#F7F4EE] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#CBE0D4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-[#1C1917] tracking-tight text-xl sm:text-2xl">
                  TaqwaLens
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F5F2] border border-[#CBE0D4] text-[#1E3A2F]">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] tracking-normal hidden md:block">
                Mindful Food & Ingredient Auditor
              </p>
            </div>
          </div>

          {/* Mobile-only History Quick Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE6DF] text-xs font-medium text-[#1C1917] shadow-2xs active:scale-95 min-h-[38px]"
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

        {/* Right Controls: Madhhab Selector, History Button, and Health Status */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3 text-xs">
          {/* Madhhab Juristic Profile Selector */}
          {onChangeMadhhab && (
            <div className="flex items-center gap-1.5 bg-white border border-[#EAE6DF] rounded-full px-2.5 py-1 shadow-2xs">
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

          {/* Catalog Count Chip (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EAE6DF] text-[#78716C] shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-[#2D5A46]" />
            <span>{indexedCount}+ Additives</span>
          </div>

          {/* Desktop History Button */}
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE6DF] text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] transition-colors shadow-2xs active:scale-95"
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

          {/* Auditor Service Readiness Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EAE6DF] text-[#1C1917] shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendHealthy ? "bg-[#22C55E]" : "bg-[#EF4444]"
              }`}
            />
            <span className="font-medium text-[11px] sm:text-xs">
              {isBackendHealthy ? "Active" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
