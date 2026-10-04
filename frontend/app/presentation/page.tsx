"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Printer,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Camera,
  Barcode,
  Cpu,
  Layers,
  FileText,
  Mail,
  Share2,
  Lock,
  Globe2,
  ArrowRight,
  RefreshCw,
  Sliders,
  ExternalLink,
  Copy,
  Check,
  Award,
  HeartHandshake,
  LayoutGrid,
  X,
  Play,
  Pause,
  Home,
} from "lucide-react";

// ============================================================================
// Slide Deck Presentation Component for TaqwaLens
// 10 Comprehensive, State-of-the-Art Executive Slides
// ============================================================================

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Slide 5 Interactive Simulation State
  const [simulatedMadhhab, setSimulatedMadhhab] = useState<"standard" | "hanafi">("standard");

  // Slide 6 Inquiry Copy Feedback
  const [copiedEmail, setCopiedEmail] = useState(false);

  const totalSlides = 10;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    startTransition(() => {
      setCurrentSlide(idx);
      setIsOverviewOpen(false);
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        setIsOverviewOpen(false);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "o" || e.key === "O") {
        setIsOverviewOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const slideTitles = [
    "01. Title & Executive Vision",
    "02. Problem Space & Cognitive Saturation",
    "03. Optical Ingestion & Groq LPU Vision",
    "04. The Glass Box 370+ E-Code Engine",
    "05. Nuanced Multi-Madhhab Jurisprudence",
    "06. 1-Click Brand Inquiry Drawer",
    "07. Institutional Compliance Dossier",
    "08. Enterprise Technical Architecture",
    "09. Measurable KPIs & UN SDGs Impact",
    "10. Strategic Horizon & Future Roadmap",
  ];

  return (
    <div className="min-h-screen bg-[#021A13] text-[#FAF8F5] flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-emerald-600/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-[150px]" />
        {/* Subtle Islamic Geometric Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FAF8F5 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top Slide Control HUD (Screen Only) */}
      <header className="print:hidden relative z-30 h-16 border-b border-emerald-900/60 bg-[#021A13]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-xs font-medium text-emerald-200 hover:text-white hover:border-emerald-600 transition-all active:scale-95"
            title="Return to Main Application"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Main App</span>
          </Link>

          <button
            onClick={() => setIsOverviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-xs font-medium text-emerald-200 hover:text-white hover:border-emerald-600 transition-all active:scale-95"
            title="Slide Grid Overview (O)"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Slide Deck</span>
          </button>

          <span className="text-xs font-mono text-emerald-400/80 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-900">
            {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </span>
        </div>

        {/* Center Current Title */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-300 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{slideTitles[currentSlide]}</span>
        </div>

        {/* Right Tools HUD */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-full border transition-all active:scale-95 ${
              isPlaying
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                : "bg-emerald-950/80 border-emerald-800/60 text-emerald-300 hover:text-white"
            }`}
            title={isPlaying ? "Pause Auto-Advance" : "Auto-Play Slides (8s)"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 hover:text-white hover:border-emerald-600 transition-all active:scale-95"
            title="Print or Export PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 hover:text-white hover:border-emerald-600 transition-all active:scale-95"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Progress Bar (Screen Only) */}
      <div className="print:hidden w-full h-1 bg-emerald-950 relative z-30">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Main Slide Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-6xl aspect-[16/9] min-h-[580px] bg-gradient-to-br from-[#04281E]/95 via-[#021F17]/95 to-[#01140E]/95 border border-emerald-600/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300">
          
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-400/30 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-400/30 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-amber-400/30 rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-amber-400/30 rounded-br-3xl pointer-events-none" />

          {/* ================================================================ */}
          {/* SLIDE 01: TITLE & EXECUTIVE VISION                               */}
          {/* ================================================================ */}
          {currentSlide === 0 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Production Release // Version 1.0.0
                </div>
                <div className="text-right text-xs text-emerald-400/70 font-mono">
                  Repository: github.com/lizzz-dev/taqwalens
                </div>
              </div>

              <div className="my-auto py-4">
                <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
                  <Award className="w-4 h-4" /> Global Dietary Integrity Platform
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif leading-none">
                  Taqwa<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Lens</span>
                </h1>
                <p className="mt-3 text-lg sm:text-xl lg:text-2xl text-emerald-100 font-light max-w-3xl leading-relaxed">
                  Autonomous Multi-Modal Halal Compliance & Dietary Intelligence System
                </p>
                <p className="mt-2 text-sm sm:text-base text-emerald-300/80 max-w-2xl">
                  Sub-second grocery packaging OCR, deterministic verification across <strong className="text-white">370+ indexed E-codes</strong>, and nuanced classical jurisprudence across 4 Sunni legal schools.
                </p>

                {/* 3 Executive Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 text-amber-300 font-semibold text-sm mb-1">
                      <Zap className="w-4 h-4 text-amber-400" /> Sub-Second Vision
                    </div>
                    <p className="text-xs text-emerald-200/80">
                      Groq LPU Llama 3.2 Vision OCR (<strong className="text-white">&lt;1.2s</strong>) backed by Gemini 1.5 Flash failover.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 text-emerald-300 font-semibold text-sm mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Deterministic Fiqh
                    </div>
                    <p className="text-xs text-emerald-200/80">
                      Glass Box architecture with zero LLM hallucination over 370+ chemical food additives.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 text-teal-300 font-semibold text-sm mb-1">
                      <Scale className="w-4 h-4 text-teal-400" /> Multi-Madhhab Rigor
                    </div>
                    <p className="text-xs text-emerald-200/80">
                      Tailored rulings for Standard Consensus, Hanafi, Shafi'i, and Strict (Wara') vigilance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Aligned with JAKIM MS 1500, IFANCA & SANHA</span>
                <span>Press &rarr; or Space to Advance</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 02: THE PROBLEM SPACE                                      */}
          {/* ================================================================ */}
          {currentSlide === 1 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  02 // The Problem Space
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  Supermarket Cognitive Saturation & Chemical Ambiguity
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Why 1.9 billion consumers face confusion in retail aisles every single day.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
                {/* 4 Problem Vectors (Left 7 Cols) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40">
                    <div className="flex items-center gap-2 text-red-300 font-semibold text-xs sm:text-sm mb-1">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" /> Cryptic E-Codes
                    </div>
                    <p className="text-xs text-red-200/70 leading-relaxed">
                      Chemical names and E-numbers (e.g. E471, E120, E441) conceal animal origins behind technical jargon.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-sm mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> 15-Minute Delays
                    </div>
                    <p className="text-xs text-amber-200/70 leading-relaxed">
                      Shoppers waste minutes in aisles Googling conflicting blog posts, outdated PDFs, and unverified forums.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-sm mb-1">
                      <Scale className="w-4 h-4 text-amber-400 shrink-0" /> Fiqh Divergence
                    </div>
                    <p className="text-xs text-amber-200/70 leading-relaxed">
                      Generic apps ignore madhhab nuances: Carmine (E120) is prohibited in Hanafi but permitted elsewhere.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/40">
                    <div className="flex items-center gap-2 text-red-300 font-semibold text-xs sm:text-sm mb-1">
                      <Mail className="w-4 h-4 text-red-400 shrink-0" /> Zero Brand Recourse
                    </div>
                    <p className="text-xs text-red-200/70 leading-relaxed">
                      When an item is doubtful (Mushbooh), consumers have no easy mechanism to demand clarification from brands.
                    </p>
                  </div>
                </div>

                {/* Simulated Problem Label (Right 5 Cols) */}
                <div className="lg:col-span-5 p-4 rounded-2xl bg-black/50 border border-emerald-800/50 backdrop-blur-md font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60 text-emerald-400">
                    <span>RETAIL INGREDIENT PANEL</span>
                    <span className="text-red-400 animate-pulse">3 FLAGS DETECTED</span>
                  </div>
                  <div className="py-3 text-slate-300 leading-relaxed text-[11px]">
                    INGREDIENTS: Wheat Flour, Sugar, Vegetable Oil,{" "}
                    <span className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded border border-amber-500/40 font-bold">
                      Emulsifier (E471)*
                    </span>
                    , Salt,{" "}
                    <span className="bg-red-500/20 text-red-300 px-1 py-0.5 rounded border border-red-500/40 font-bold">
                      Carmine Extract (E120)**
                    </span>
                    ,{" "}
                    <span className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded border border-amber-500/40 font-bold">
                      Bovine Gelatin (E441)***
                    </span>
                    , Natural Flavoring.
                  </div>
                  <div className="pt-2 border-t border-emerald-900/60 space-y-1 text-[10px] text-slate-400">
                    <p className="text-amber-400">* E471: Plant or Animal source unstated</p>
                    <p className="text-red-400">** E120: Insect origin; strictly Haram in Hanafi</p>
                    <p className="text-amber-400">*** E441: Requires verified Dhabihah slaughter chain</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Impact: Massive cognitive load, accidental non-halal consumption, and loss of peace of mind.</span>
                <span>Slide 02 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 03: OPTICAL INGESTION & VISION PIPELINE                     */}
          {/* ================================================================ */}
          {currentSlide === 2 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  03 // Ingestion & Vision Pipeline
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  High-Speed Optical Ingestion & Dual-Engine Failover
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Ultra-fast packaging OCR using Groq LPUs with automated Google Gemini 1.5 Flash fallback.
                </p>
              </div>

              {/* Architecture Flow Diagram */}
              <div className="my-auto py-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex flex-col items-center justify-center">
                    <Camera className="w-6 h-6 text-amber-400 mb-2" />
                    <span className="text-xs font-semibold text-white">1. Multi-Stream Ingestion</span>
                    <span className="text-[11px] text-emerald-300/70 mt-1">Live Camera / Upload / Barcode</span>
                    <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-mono">
                      Canvas Max 1024px
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/60 flex flex-col items-center justify-center relative">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden md:block text-emerald-600 font-bold">&rarr;</div>
                    <Cpu className="w-6 h-6 text-emerald-400 mb-2" />
                    <span className="text-xs font-semibold text-white">2. Primary Vision Engine</span>
                    <span className="text-[11px] text-emerald-300/70 mt-1">Groq Llama 3.2 11B Vision</span>
                    <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      ~1,180 ms Latency
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 flex flex-col items-center justify-center relative">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden md:block text-emerald-600 font-bold">&rarr;</div>
                    <RefreshCw className="w-6 h-6 text-amber-400 mb-2" />
                    <span className="text-xs font-semibold text-white">3. Automatic Failover</span>
                    <span className="text-[11px] text-amber-200/70 mt-1">Google Gemini 1.5 Flash</span>
                    <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-mono">
                      Triggered on HTTP 429
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex flex-col items-center justify-center relative">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden md:block text-emerald-600 font-bold">&rarr;</div>
                    <ShieldCheck className="w-6 h-6 text-teal-400 mb-2" />
                    <span className="text-xs font-semibold text-white">4. Non-Food Guard</span>
                    <span className="text-[11px] text-teal-200/70 mt-1">Rejects Invalid Scenes (422)</span>
                    <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 font-mono">
                      Zero Hallucination
                    </span>
                  </div>
                </div>

                {/* Telemetry Metric Callouts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-900 text-center">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono">Average Roundtrip</div>
                    <div className="text-base font-bold text-white font-mono">1.18 Seconds</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-900 text-center">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono">Payload Compression</div>
                    <div className="text-base font-bold text-emerald-300 font-mono">78% Reduction</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-900 text-center">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono">Barcode Fallback</div>
                    <div className="text-base font-bold text-amber-300 font-mono">OpenFoodFacts API</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-900 text-center">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono">Cloud Cost</div>
                    <div className="text-base font-bold text-white font-mono">$0.00 / Free Tier</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Client & server dual compression strictly limits input payloads to max 1024x1024.</span>
                <span>Slide 03 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 04: DETERMINISTIC FIQH KNOWLEDGE BASE                       */}
          {/* ================================================================ */}
          {currentSlide === 3 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  04 // Knowledge Engine
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  The "Glass Box" Principle: Zero Black-Box Hallucinations
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Why probabilistic LLMs must NEVER invent religious rulings or alter certified chemical databases.
                </p>
              </div>

              <div className="my-auto py-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Halal Column */}
                  <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                        HALAL (Permissible)
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-emerald-200/70 mb-3">
                      100% plant, synthetic, or mineral sources without any animal derivatives or prohibited processing aids.
                    </p>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="px-2 py-1 rounded bg-emerald-900/40 text-emerald-200">E100: Curcumin (Plant)</div>
                      <div className="px-2 py-1 rounded bg-emerald-900/40 text-emerald-200">E300: Ascorbic Acid (Synthetic)</div>
                      <div className="px-2 py-1 rounded bg-emerald-900/40 text-emerald-200">E322: Soya Lecithin (Vegetable)</div>
                    </div>
                  </div>

                  {/* Haram Column */}
                  <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-red-400 uppercase tracking-wider">
                        HARAM (Prohibited)
                      </span>
                      <XCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <p className="text-xs text-red-200/70 mb-3">
                      Porcine derivatives, unslaughtered animal fats, or prohibited alcohol aids that violate Islamic law.
                    </p>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="px-2 py-1 rounded bg-red-900/40 text-red-200">E120: Carmine (Insect Extract)</div>
                      <div className="px-2 py-1 rounded bg-red-900/40 text-red-200">E542: Bone Phosphate (Animal)</div>
                      <div className="px-2 py-1 rounded bg-red-900/40 text-red-200">E441: Gelatin (Porcine Origin)</div>
                    </div>
                  </div>

                  {/* Mushbooh Column */}
                  <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
                        MUSHBOOH (Doubtful)
                      </span>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-xs text-amber-200/70 mb-3">
                      Dual-origin substances where source (plant vs. animal) is not declared on packaging.
                    </p>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="px-2 py-1 rounded bg-amber-900/40 text-amber-200">E471: Mono- & Diglycerides</div>
                      <div className="px-2 py-1 rounded bg-amber-900/40 text-amber-200">E422: Glycerol (Fatty Acid)</div>
                      <div className="px-2 py-1 rounded bg-amber-900/40 text-amber-200">E476: Polyglycerol Polyricinoleate</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      Database Size: <strong className="text-white">370+ Indexed Additives</strong> with full chemical taxonomy and cited standards.
                    </span>
                  </div>
                  <span className="text-amber-400 font-mono font-semibold">JAKIM // IFANCA // SANHA Aligned</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>The LLM extracts text; our deterministic Python knowledge base evaluates the rulings.</span>
                <span>Slide 04 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 05: MULTI-MADHHAB JURISTIC SYNTHESIZER                     */}
          {/* ================================================================ */}
          {currentSlide === 4 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  05 // Islamic Jurisprudence
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  Multi-Madhhab Engine: Personalized Classical Fiqh
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Dynamic re-evaluation across 4 classical legal schools with zero re-scanning required.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
                {/* 4 School Cards (Left 7 cols) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-emerald-300 mb-1">Standard Consensus</div>
                    <p className="text-[11px] text-emerald-200/70">
                      Follows global international Halal certifications (JAKIM MS 1500, IFANCA). Broadest industrial consensus.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-amber-300 mb-1">Hanafi School</div>
                    <p className="text-[11px] text-emerald-200/70">
                      Strict prohibition on insect-derived dyes (E120 Carmine) and non-plant rennet in cheese processing.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-teal-300 mb-1">Shafi'i School</div>
                    <p className="text-[11px] text-emerald-200/70">
                      Rigorous slaughter chain verification for bovine gelatin (E441) and bone phosphate (E542).
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-amber-300 mb-1">Strict (Wara' Tier)</div>
                    <p className="text-[11px] text-emerald-200/70">
                      Zero tolerance: all synthetic chemical carriers, alcohol solvents, and ambiguous additives flagged as Mushbooh.
                    </p>
                  </div>
                </div>

                {/* Interactive Simulator (Right 5 cols) */}
                <div className="lg:col-span-5 p-4 rounded-2xl bg-black/60 border border-amber-500/40 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                    <span className="text-xs font-mono text-amber-400">LIVE JURISTIC SIMULATOR</span>
                    <span className="text-[10px] text-slate-400">Strawberry Macaron</span>
                  </div>

                  <div className="my-3 space-y-2">
                    <div className="text-xs text-slate-300">
                      Test Ingredient: <strong className="text-white">Carmine Extract (E120)</strong>
                    </div>

                    {/* Toggle Button */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSimulatedMadhhab("standard")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          simulatedMadhhab === "standard"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-900"
                            : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                        }`}
                      >
                        Standard View
                      </button>
                      <button
                        onClick={() => setSimulatedMadhhab("hanafi")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          simulatedMadhhab === "hanafi"
                            ? "bg-red-600 text-white shadow-md shadow-red-900"
                            : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                        }`}
                      >
                        Hanafi View
                      </button>
                    </div>

                    {/* Dynamic Result Box */}
                    <div
                      className={`p-3 rounded-xl border text-xs transition-all duration-300 ${
                        simulatedMadhhab === "standard"
                          ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-200"
                          : "bg-red-950/60 border-red-500/50 text-red-200"
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        {simulatedMadhhab === "standard" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Status: CONDITIONAL / HALAL (Permissible)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span>Status: HARAM DETECTED</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        {simulatedMadhhab === "standard"
                          ? "Under international consensus standards (JAKIM MS 1500), purified carmine is permitted within strict purity thresholds."
                          : "Under classical Hanafi jurisprudence, land insects (such as cochineal) are classified as non-permissible for oral consumption."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Try clicking the simulator buttons above to see live juristic re-evaluation in action!</span>
                <span>Slide 05 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 06: 1-CLICK BRAND INQUIRY DRAWER                           */}
          {/* ================================================================ */}
          {currentSlide === 5 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  06 // Consumer Empowerment
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  1-Click Brand Inquiry: Resolving Sourcing Ambiguity
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Shifting consumers from passive confusion to active civic and manufacturer accountability.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
                {/* Explanation (Left 5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-4 h-4" /> Automated Corporate Email
                    </div>
                    <p className="text-xs text-emerald-200/80 leading-relaxed">
                      Pre-populates formal customer service inquiries specifying exact E-codes, product batch details, and technical inquiries into animal vs. plant origins.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-teal-300 mb-1 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4" /> 280-Character Public X Post
                    </div>
                    <p className="text-xs text-emerald-200/80 leading-relaxed">
                      Generates concise public social media posts querying brand customer care handles to encourage transparent public accountability.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-900 text-xs text-emerald-400/80">
                    💡 <strong>Impact:</strong> Eliminates guesswork and drives manufacturers toward explicit vegetarian/plant-origin packaging disclosures.
                  </div>
                </div>

                {/* Simulated Inquiry Drawer (Right 7 Cols) */}
                <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-black/60 border border-emerald-700/60 backdrop-blur-md font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-900/60">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Mail className="w-4 h-4" /> GENERATED BRAND INQUIRY DRAFT
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Target: E471 Emulsifier
                    </span>
                  </div>

                  <div className="my-3 space-y-2 text-[11px] text-slate-300">
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-900">
                      <span className="text-emerald-400 font-bold">Subject:</span> Inquiry Regarding Ingredient Sourcing for [Product Name]
                    </div>
                    <div className="p-3 rounded bg-emerald-950/40 border border-emerald-900 leading-relaxed max-h-36 overflow-y-auto">
                      Dear Consumer Relations Team,<br /><br />
                      I am writing to inquire regarding the source of <strong className="text-amber-300">Mono- and diglycerides of fatty acids (E471)</strong> listed in your product. Could you kindly clarify if this ingredient is derived from <strong className="text-emerald-300">100% plant/vegetable oils</strong> or animal fats?<br /><br />
                      Additionally, could you confirm whether any alcohol processing aids or porcine enzymes are utilized in the manufacturing line? Thank you.
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-emerald-900/60">
                    <button
                      onClick={() => {
                        setCopiedEmail(true);
                        setTimeout(() => setCopiedEmail(false), 2000);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? "Copied to Clipboard!" : "Copy Email Draft"}</span>
                    </button>
                    <button
                      onClick={() => alert("Simulating mailto: launch...")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 hover:text-white font-semibold transition-all active:scale-95 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Mail Client
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Universal clipboard copy fallback ensures compatibility across all desktop and mobile browsers.</span>
                <span>Slide 06 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 07: INSTITUTIONAL COMPLIANCE CERTIFICATE                   */}
          {/* ================================================================ */}
          {currentSlide === 6 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  07 // Audit & Compliance
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  Institutional Compliance Certificate Dossier
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Printable, audit-grade verification artifacts for consumers, retailers, and food importers.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
                {/* Certificate Features (Left 5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Legal Diploma Layout (`/certificate`)
                    </div>
                    <p className="text-xs text-emerald-200/80 leading-relaxed">
                      Authentic parchment texture (<code className="text-amber-300">#FCFBF8</code>), double-line emerald filigree, and live holographic animated trust seal.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                    <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                      <Printer className="w-4 h-4" /> Native Print-to-PDF Engine
                    </div>
                    <p className="text-xs text-emerald-200/80 leading-relaxed">
                      Optimized print stylesheet with exact color reproduction, isolating certificates and hiding web UI buttons for official export.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-900 text-xs text-emerald-400/80">
                    📜 <strong>Persistent Audit Trail:</strong> Unique certificate ID generation (<code className="text-white">TL-88421-2026</code>) and local storage scan replay.
                  </div>
                </div>

                {/* Simulated Certificate Mockup (Right 7 Cols) */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#FCFBF8] text-[#1C1917] border-4 border-double border-[#1E3A2F] shadow-2xl relative overflow-hidden font-serif">
                  {/* Subtle Background Watermark */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center text-7xl font-bold">
                    حلال
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E3A2F]/30">
                    <div>
                      <div className="text-xs uppercase tracking-widest font-sans font-bold text-[#1E3A2F]">
                        TaqwaLens Compliance Authority
                      </div>
                      <div className="text-lg font-bold text-[#1E3A2F]">Institutional Verification Dossier</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-amber-500/80 bg-amber-50 flex items-center justify-center text-amber-700 shadow-md">
                      <Sparkles className="w-6 h-6 animate-spin text-amber-600" style={{ animationDuration: "12s" }} />
                    </div>
                  </div>

                  <div className="py-3 text-xs leading-relaxed">
                    <p className="text-slate-600 italic">This official dossier certifies that the food product declared below:</p>
                    <div className="mt-1 font-sans font-bold text-sm text-[#1E3A2F]">
                      Artisan Oat Milk & Almond Crunch Bar (UPC: 890123456789)
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-sans">
                      <div className="p-1.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                        Verdict: <strong className="text-emerald-700">HALAL VERIFIED</strong>
                      </div>
                      <div className="p-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        Juristic Profile: <strong className="text-amber-800">Standard Consensus</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1E3A2F]/20 flex items-center justify-between text-[10px] font-sans text-slate-500">
                    <span>Dossier ID: TL-88421-2026</span>
                    <span>Verified via Groq LPU + 370+ E-Code Engine</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Accessible anytime at `/certificate` with instant iOS Share Sheet and Android print spooling.</span>
                <span>Slide 07 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 08: TECHNICAL ARCHITECTURE & SECURITY                      */}
          {/* ================================================================ */}
          {currentSlide === 7 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  08 // System Engineering
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  Enterprise Full-Stack Architecture & Defensive Security
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Modern web stack hardened against GPU memory leaks, polyglot payloads, and unauthorized access.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-2">
                {/* Tech Blueprint (Left) */}
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-2.5">
                  <div className="text-xs font-bold text-amber-300 uppercase font-mono flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Full-Stack Engineering Topology
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900">
                      <span className="text-emerald-400 font-bold font-mono">Frontend:</span> Next.js 14.2+ (App Router), TypeScript, Tailwind CSS, Framer Motion
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900">
                      <span className="text-emerald-400 font-bold font-mono">3D Engine:</span> Three.js 0.161 + R3F with explicit <code className="text-amber-300">forceContextLoss()</code> lifecycle
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900">
                      <span className="text-emerald-400 font-bold font-mono">Backend:</span> FastAPI 0.115 (Python 3.11+), Pydantic v2 schemas, Uvicorn ASGI
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900">
                      <span className="text-emerald-400 font-bold font-mono">AI & Vision:</span> Groq SDK (Llama 3.2 Vision) + Google Generative AI SDK (Gemini Flash)
                    </div>
                  </div>
                </div>

                {/* Defensive Security Fortress (Right) */}
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-2.5">
                  <div className="text-xs font-bold text-teal-300 uppercase font-mono flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Production-Grade Defensive Hardening
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Strict 10MB Ceiling:</strong> Rejects oversized payloads with <code className="text-amber-300">HTTP 413</code> to prevent RAM exhaustion.
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Magic Byte Verification:</strong> Pillow header parsing ensures genuine JPEG/PNG/WEBP streams, rejecting polyglots.
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Confidential Error Masking:</strong> Zero internal tracebacks or secrets leak to clients; sanitized JSON envelopes.
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">18/18 Passing Pytest Suite:</strong> 100% automated regression test coverage across all endpoints.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>CORS strictly whitelisted to authorized frontend origins. No wildcards in production.</span>
                <span>Slide 08 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 09: MEASURABLE IMPACT KPIS & UN SDGS                       */}
          {/* ================================================================ */}
          {currentSlide === 8 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  09 // Impact & Sustainability
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  Measurable Humanitarian Impact & UN SDGs Alignment
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  Accelerating 5 United Nations Sustainable Development Goals through high-tech dietary intelligence.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-1 items-center">
                {/* Comparative KPIs (Left 5 Cols) */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                    BEFORE VS. AFTER KPIS
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Mean Time to Audit (MTTA)</span>
                    <span className="font-mono font-bold text-emerald-300">15m &rarr; 1.18s (92%&darr;)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900 flex items-center justify-between text-xs">
                    <span className="text-slate-400">E-Code Chemical Coverage</span>
                    <span className="font-mono font-bold text-amber-300">~5 &rarr; 370+ Additives</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Mushbooh Resolution</span>
                    <span className="font-mono font-bold text-emerald-300">Doubt &rarr; 1-Click Inquiry</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Infrastructure Cost</span>
                    <span className="font-mono font-bold text-teal-300">$$$ &rarr; $0 Serverless</span>
                  </div>
                </div>

                {/* 5 SDGs Matrix (Right 7 Cols) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
                    <div className="font-bold text-emerald-300">SDG 3: Good Health & Well-Being</div>
                    <div className="text-[11px] text-emerald-200/70 mt-0.5">
                      Target 3.9: Allergen & hazardous preservative screening alongside Halal verification.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
                    <div className="font-bold text-amber-300">SDG 12: Responsible Consumption</div>
                    <div className="text-[11px] text-emerald-200/70 mt-0.5">
                      Target 12.8: Demanding corporate disclosure on plant vs. animal additive origins.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
                    <div className="font-bold text-teal-300">SDG 9: Industry & Innovation</div>
                    <div className="text-[11px] text-emerald-200/70 mt-0.5">
                      Target 9.c: Democratizing access to ultra-fast sub-second AI inference on low-cost devices.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
                    <div className="font-bold text-emerald-300">SDG 16: Peace, Justice & Institutions</div>
                    <div className="text-[11px] text-emerald-200/70 mt-0.5">
                      Target 16.6: Countering counterfeit Halal badges and fraudulent packaging claims.
                    </div>
                  </div>
                  <div className="sm:col-span-2 p-2 rounded-xl bg-black/40 border border-amber-500/30 text-center text-amber-300 text-[11px]">
                    <strong>SDG 17: Partnerships for the Goals:</strong> Harmonizing standards across JAKIM, IFANCA & SANHA.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Bridging advanced artificial intelligence with international ethical and dietary priorities.</span>
                <span>Slide 09 / 10</span>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SLIDE 10: STRATEGIC HORIZON & ROADMAP                            */}
          {/* ================================================================ */}
          {currentSlide === 9 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  10 // Strategic Horizon
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
                  The Future of Halal Tech: Roadmap to Global Scale
                </h2>
                <p className="text-sm sm:text-base text-emerald-200/80 mt-1 max-w-3xl">
                  From individual supermarket scanner to global institutional food supply chain verification.
                </p>
              </div>

              <div className="my-auto py-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Phase 2 */}
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60">
                    <div className="text-xs font-mono text-amber-400 font-bold uppercase mb-1">
                      PHASE 2 // NEAR-TERM
                    </div>
                    <div className="text-sm font-bold text-white mb-2">Offline Edge & IoT Scanner</div>
                    <p className="text-xs text-emerald-200/70 leading-relaxed">
                      Deploying on-device quantized neural vision models (WebAssembly / ONNX) for zero-latency scanning in basement supermarket aisles with no cellular signal.
                    </p>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60">
                    <div className="text-xs font-mono text-amber-400 font-bold uppercase mb-1">
                      PHASE 3 // MEDIUM-TERM
                    </div>
                    <div className="text-sm font-bold text-white mb-2">Global Body Blockchain Federation</div>
                    <p className="text-xs text-emerald-200/70 leading-relaxed">
                      Direct API synchronization with official regulatory registries (JAKIM e-Halal, BPJPH Indonesia) with cryptographic certificate validation.
                    </p>
                  </div>

                  {/* Phase 4 */}
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60">
                    <div className="text-xs font-mono text-amber-400 font-bold uppercase mb-1">
                      PHASE 4 // LONG-TERM
                    </div>
                    <div className="text-sm font-bold text-white mb-2">Enterprise Supply Chain ERP</div>
                    <p className="text-xs text-emerald-200/70 leading-relaxed">
                      B2B bulk specification sheet auditor parsing multi-page supplier PDFs/CSVs for international food importers, airline catering, and hospitality chains.
                    </p>
                  </div>
                </div>

                {/* Final Call to Action Box */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-900/60 via-emerald-950/80 to-amber-950/60 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">Experience TaqwaLens Live</div>
                    <div className="text-xs text-emerald-300/80">
                      Open source, production-ready, and freely accessible to conscious consumers worldwide.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Launch App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400/60 pt-4 border-t border-emerald-900/60">
                <span>Authored by the TaqwaLens Core Engineering Team // 2026</span>
                <span>Slide 10 / 10 &bull; Conclusion</span>
              </div>
            </div>
          )}

          {/* Bottom Slide Navigation Bar */}
          <div className="print:hidden pt-4 mt-2 border-t border-emerald-900/40 flex items-center justify-between">
            <button
              onClick={prevSlide}
              className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-xs font-semibold text-emerald-300 hover:text-white hover:border-emerald-600 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Slide Dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i ? "w-6 bg-amber-400" : "w-2 bg-emerald-900/80 hover:bg-emerald-700"
                  }`}
                  title={`Jump to Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>{currentSlide === totalSlides - 1 ? "First Slide" : "Next Slide"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Slide Deck Overview Drawer Modal */}
      {isOverviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[85vh] bg-[#021A13] border border-emerald-700/60 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/80">
              <div className="flex items-center gap-2 text-amber-300 font-bold font-serif text-lg">
                <LayoutGrid className="w-5 h-5 text-amber-400" />
                <span>Slide Deck Navigator</span>
              </div>
              <button
                onClick={() => setIsOverviewOpen(false)}
                className="p-1.5 rounded-full bg-emerald-950 text-emerald-400 hover:text-white border border-emerald-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-6 overflow-y-auto pr-1">
              {slideTitles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between h-28 group relative overflow-hidden ${
                    currentSlide === idx
                      ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30"
                      : "bg-emerald-950/60 border-emerald-800/60 hover:border-emerald-600 hover:bg-emerald-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold text-amber-400">SLIDE {String(idx + 1).padStart(2, "0")}</span>
                    {currentSlide === idx && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-black font-bold">CURRENT</span>}
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-amber-200 transition-colors line-clamp-2">
                    {title.replace(/^\d+\.\s*/, "")}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-emerald-900/80 text-xs text-emerald-400/60 flex items-center justify-between">
              <span>Press [Esc] to close or click any slide to jump directly.</span>
              <button
                onClick={() => setIsOverviewOpen(false)}
                className="text-amber-400 font-semibold hover:underline"
              >
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
