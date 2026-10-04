"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Clock,
  Scale,
  User,
  LogOut,
  ArrowRightLeft,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";
import { MadhhabProfile, UserProfile } from "../lib/types";
import { Logo3D } from "./3d/Logo3D";
import { soundManager } from "../lib/soundEffects";

interface NavbarProps {
  isBackendHealthy?: boolean;
  indexedCount?: number;
  historyCount?: number;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
  onOpenCompare?: () => void;
  selectedMadhhab?: MadhhabProfile;
  onChangeMadhhab?: (m: MadhhabProfile) => void;
  currentUser?: UserProfile | null;
  onOpenAuthGateway?: () => void;
  onResetToStart?: () => void;
}

export function Navbar({
  historyCount = 0,
  onOpenHistory,
  onOpenSearch,
  onOpenCompare,
  selectedMadhhab = "standard",
  onChangeMadhhab,
  currentUser,
  onOpenAuthGateway,
  onResetToStart,
}: NavbarProps) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSoundOn(soundManager.getSoundEnabled());
  }, []);

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

  // Click outside listener for Tools dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundManager.toggleSound();
    setIsSoundOn(nextState);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-[#FAF8F5]/90 backdrop-blur-md transition-all">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto w-full">
        {/* Brand Logo & Editorial Title (Click to return to start) */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            if (onResetToStart) {
              onResetToStart();
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-3 shrink-0 group text-left cursor-pointer transition-transform active:scale-95 focus:outline-none"
          title="Return to start"
        >
          <Logo3D className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col justify-center">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-[0.02em] text-slate-900 leading-none select-none group-hover:text-[#1E3A2F] transition-colors">
              TaqwaLens
            </span>
            <p className="text-[9px] sm:text-[10px] text-slate-500 tracking-[0.08em] uppercase font-medium mt-0.5 hidden xl:block">
              Mindful Food & Ingredient Auditor
            </p>
          </div>
        </button>

        {/* Right-Side Cluster: Single Horizontal Row */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 flex-nowrap">
          {/* 1. Instant E-Code Search Button */}
          {onOpenSearch && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSearch();
              }}
              className="h-9 w-9 sm:w-auto px-0 sm:px-3.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-xs text-xs text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
              title="Search certified E-numbers and ingredients (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#1E3A2F]" />
              <span className="font-medium hidden sm:inline">Search Additives...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-50 border border-slate-200/80 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>
          )}

          {/* 2. Madhhab Juristic Profile Selector */}
          {onChangeMadhhab && (
            <div className="h-9 px-2.5 sm:px-3 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-xs flex items-center gap-1.5 text-xs shrink-0">
              <Scale className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" />
              <label htmlFor="madhhab-select" className="text-[11px] text-slate-500 font-medium hidden md:inline">
                Fiqh:
              </label>
              <select
                id="madhhab-select"
                value={selectedMadhhab}
                onChange={(e) => {
                  soundManager.playClick();
                  onChangeMadhhab(e.target.value as MadhhabProfile);
                }}
                className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer pr-0.5 sm:pr-1"
                title="Select juristic school of thought for additive rulings"
              >
                <option value="standard">Standard</option>
                <option value="hanafi">Hanafi</option>
                <option value="shafii">Shafi'i</option>
                <option value="strict">Strict (Wara')</option>
              </select>
            </div>
          )}

          {/* 3. Combined Compact Tools Dropdown Button (Compare & History) */}
          {(onOpenCompare || onOpenHistory) && (
            <div ref={toolsMenuRef} className="relative shrink-0">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsToolsOpen((prev) => !prev);
                }}
                className={`h-9 px-2.5 sm:px-3 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-xs flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95 ${
                  isToolsOpen ? "border-[#1E3A2F] bg-white ring-1 ring-[#1E3A2F]/20" : ""
                }`}
                title="Tools: History & Product Comparison"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span className="hidden md:inline font-medium text-xs">Tools</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    isToolsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Tools Dropdown Menu */}
              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {onOpenCompare && (
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        soundManager.playClick();
                        onOpenCompare();
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-[#1E3A2F]" />
                      <span>Compare Products ⚖️</span>
                    </button>
                  )}
                  {onOpenHistory && (
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        soundManager.playClick();
                        onOpenHistory();
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-[#1E3A2F]" />
                      <span>Recent History 🕒</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. Compact Tactile Audio Mute/Unmute Toggle */}
          <button
            onClick={handleToggleSound}
            className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-xs text-slate-700 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition-all active:scale-95 shrink-0"
            title={isSoundOn ? "Sound Effects: ON (Click to Mute)" : "Sound Effects: MUTED (Click to Enable)"}
          >
            {isSoundOn ? (
              <Volume2 className="w-3.5 h-3.5 text-[#1E3A2F]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* 5. Guest Evaluator / Auditor Profile (EXACT SAME LINE, FAR RIGHT) */}
          {onOpenAuthGateway && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAuthGateway();
              }}
              className="h-9 px-2 sm:px-4 rounded-full text-xs font-medium flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-xs hover:border-[#1E3A2F] text-slate-900 shrink-0 transition-all active:scale-95"
              title="Click to view 3D Auditor Credential, switch profile, or sign out"
            >
              <div className="w-5 h-5 rounded-full bg-[#1E3A2F] text-[#D4AF37] font-serif text-[10px] font-bold flex items-center justify-center shrink-0">
                {currentUser?.avatarInitials || "⚡"}
              </div>
              <span className="font-semibold text-xs whitespace-nowrap hidden sm:inline">
                {currentUser?.name || "Guest Evaluator"}
              </span>
              <LogOut className="w-3 h-3 text-slate-400 ml-0.5 shrink-0 hidden sm:inline" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
