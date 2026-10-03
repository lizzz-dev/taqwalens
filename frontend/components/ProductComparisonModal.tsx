"use client";

import React, { useState } from "react";
import { X, Scale, CheckCircle2, AlertTriangle, XCircle, ArrowRightLeft, Shield, Sparkles } from "lucide-react";
import { soundManager } from "../lib/soundEffects";
import { AuditResponse } from "../lib/types";

interface ComparisonProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  verdict: "HALAL" | "MUSHBOOH" | "HARAM";
  verdictScore: number;
  gelatinOrigin: string;
  emulsifierStatus: string;
  colorings: string;
  madhhabSupport: {
    standard: boolean;
    hanafi: boolean;
    shafii: boolean;
    strict: boolean;
  };
  keyRisk: string;
}

const COMPARISON_PRESETS: Array<{ label: string; prodA: ComparisonProduct; prodB: ComparisonProduct }> = [
  {
    label: "Haribo EU (Porcine) vs Haribo Turkey (Halal Certified)",
    prodA: {
      id: "haribo-eu",
      name: "Haribo Goldbears (European)",
      brand: "Haribo GmbH",
      category: "Gummy Candy",
      verdict: "HARAM",
      verdictScore: 12,
      gelatinOrigin: "E441 Porcine (Pig Skin / Bones)",
      emulsifierStatus: "None declared",
      colorings: "Fruit concentrates (Safflower, Spirulina)",
      madhhabSupport: { standard: false, hanafi: false, shafii: false, strict: false },
      keyRisk: "Contains direct porcine gelatin strictly forbidden under all 4 Sunni Madhhabs.",
    },
    prodB: {
      id: "haribo-tr",
      name: "Haribo Goldbears (Turkish Import)",
      brand: "Haribo Turkey",
      category: "Gummy Candy",
      verdict: "HALAL",
      verdictScore: 98,
      gelatinOrigin: "Certified 100% Halal Bovine Gelatin (Beef)",
      emulsifierStatus: "None declared",
      colorings: "Plant & fruit extracts",
      madhhabSupport: { standard: true, hanafi: true, shafii: true, strict: true },
      keyRisk: "None. Slaughtered according to Islamic Zabiha Shariah standards (TSE Certified).",
    },
  },
  {
    label: "Doritos Nacho (Animal Rennet) vs Walkers Sensations (Halal)",
    prodA: {
      id: "doritos-us",
      name: "Doritos Nacho Cheese",
      brand: "Frito-Lay",
      category: "Corn Chips",
      verdict: "MUSHBOOH",
      verdictScore: 48,
      gelatinOrigin: "None",
      emulsifierStatus: "E471 Mono- & Diglycerides (Doubtful)",
      colorings: "Yellow 6, Red 40",
      madhhabSupport: { standard: false, hanafi: false, shafii: false, strict: false },
      keyRisk: "Animal rennet and doubtful whey derived from non-zabiha calves.",
    },
    prodB: {
      id: "sensations-uk",
      name: "Sensations Sweet Chili",
      brand: "Walkers / PepsiCo",
      category: "Potato Crisps",
      verdict: "HALAL",
      verdictScore: 95,
      gelatinOrigin: "None",
      emulsifierStatus: "Sunflower Lecithin (Plant-Derived)",
      colorings: "Paprika extract (E160c)",
      madhhabSupport: { standard: true, hanafi: true, shafii: true, strict: true },
      keyRisk: "No animal fats or animal rennet. Verified vegetarian & Halal permissible.",
    },
  },
  {
    label: "Red Velvet Bakery (Carmine) vs Artisan Berry Treat (Beetroot)",
    prodA: {
      id: "redvelvet-carmine",
      name: "Bakery Red Velvet Cake",
      brand: "Commercial Bakery",
      category: "Pastry",
      verdict: "MUSHBOOH",
      verdictScore: 55,
      gelatinOrigin: "None",
      emulsifierStatus: "E471 (Vegetable source confirmed)",
      colorings: "E120 Carmine (Cochineal Extract)",
      madhhabSupport: { standard: true, hanafi: false, shafii: true, strict: false },
      keyRisk: "E120 Carmine is strictly Haram in Hanafi fiqh (derived from crushed insect).",
    },
    prodB: {
      id: "artisan-beetroot",
      name: "Artisan Beetroot Velvet",
      brand: "Mindful Bakery",
      category: "Pastry",
      verdict: "HALAL",
      verdictScore: 99,
      gelatinOrigin: "None",
      emulsifierStatus: "E322 Soy Lecithin",
      colorings: "E162 Beetroot Red (Plant)",
      madhhabSupport: { standard: true, hanafi: true, shafii: true, strict: true },
      keyRisk: "All colors are pure plant anthocyanins. 100% compliant across all 4 Madhhabs.",
    },
  },
];

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAuditResult?: AuditResponse | null;
}

export function ProductComparisonModal({
  isOpen,
  onClose,
  currentAuditResult,
}: ProductComparisonModalProps) {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);

  if (!isOpen) return null;

  const currentPair = COMPARISON_PRESETS[selectedPairIndex];

  const handleSelectPair = (idx: number) => {
    soundManager.playClick();
    setSelectedPairIndex(idx);
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="bg-white border-b border-[#EAE6DF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] flex items-center gap-2">
                <span>Side-by-Side Product Comparison</span>
                <span className="text-[11px] font-sans font-semibold bg-[#1E3A2F]/10 text-[#1E3A2F] px-2 py-0.5 rounded-full">
                  Fiqh Matrix
                </span>
              </h3>
              <p className="text-xs text-[#78716C]">
                Compare additive origins, madhhab compliance, and risk divergences side by side.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE6DF] hover:bg-[#FAF8F5] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pair Selector Tabs */}
        <div className="px-6 py-3 bg-white/70 border-b border-[#EAE6DF] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider shrink-0">
            Compare Pairs:
          </span>
          {COMPARISON_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPair(idx)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                selectedPairIndex === idx
                  ? "bg-[#1E3A2F] text-white shadow-2xs"
                  : "bg-white border border-[#EAE6DF] text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Comparison Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* PRODUCT A */}
            <div className="bg-white border border-[#EAE6DF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#78716C] block">
                      Sample A • {currentPair.prodA.category}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#1C1917]">
                      {currentPair.prodA.name}
                    </h4>
                    <p className="text-xs text-[#78716C]">{currentPair.prodA.brand}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      currentPair.prodA.verdict === "HALAL"
                        ? "bg-[#059669]/10 text-[#059669] border-[#059669]/30"
                        : currentPair.prodA.verdict === "HARAM"
                        ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30"
                        : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30"
                    }`}
                  >
                    {currentPair.prodA.verdict}
                  </span>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#EAE6DF] text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-[#78716C] block uppercase">
                      Gelatin Status
                    </span>
                    <span className="font-medium text-[#1C1917]">
                      {currentPair.prodA.gelatinOrigin}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-[#78716C] block uppercase">
                      Emulsifier Source
                    </span>
                    <span className="font-medium text-[#1C1917]">
                      {currentPair.prodA.emulsifierStatus}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-[#78716C] block uppercase">
                      Food Colorings
                    </span>
                    <span className="font-medium text-[#1C1917]">
                      {currentPair.prodA.colorings}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAE6DF] bg-[#FEF2F2]/60 p-3 rounded-xl border border-[#FECACA]/60">
                <span className="text-[10px] font-bold text-[#991B1B] uppercase tracking-wider block mb-1">
                  Primary Risk Factor
                </span>
                <p className="text-xs text-[#991B1B] leading-normal">{currentPair.prodA.keyRisk}</p>
              </div>
            </div>

            {/* PRODUCT B */}
            <div className="bg-white border-2 border-[#1E3A2F]/30 rounded-2xl p-5 shadow-2xs flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 bg-[#1E3A2F] text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-[#D4AF37]/40 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-[#D4AF37]" /> Halal Alternative
              </div>

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#78716C] block">
                      Sample B • {currentPair.prodB.category}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#1C1917]">
                      {currentPair.prodB.name}
                    </h4>
                    <p className="text-xs text-[#78716C]">{currentPair.prodB.brand}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      currentPair.prodB.verdict === "HALAL"
                        ? "bg-[#059669]/10 text-[#059669] border-[#059669]/30"
                        : currentPair.prodB.verdict === "HARAM"
                        ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30"
                        : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30"
                    }`}
                  >
                    {currentPair.prodB.verdict}
                  </span>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#EAE6DF] text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-[#78716C] block uppercase">
                      Gelatin Status
                    </span>
                    <span className="font-medium text-[#1C1917]">
                      {currentPair.prodB.gelatinOrigin}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-[#78716C] block uppercase">
                      Emulsifier Source
                    </span>
                    <span className="font-medium text-[#1C1917]">
                      {currentPair.prodB.emulsifierStatus}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-[#78716C] block uppercase">
                      Food Colorings
                    </span>
                    <span className="font-medium text-[#1C1917]">
                      {currentPair.prodB.colorings}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAE6DF] bg-[#ECFDF5] p-3 rounded-xl border border-[#A7F3D0]">
                <span className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider block mb-1">
                  Compliance Assessment
                </span>
                <p className="text-xs text-[#065F46] leading-normal">{currentPair.prodB.keyRisk}</p>
              </div>
            </div>
          </div>

          {/* 4-Madhhab Juristic Compliance Comparison Matrix */}
          <div className="bg-white border border-[#EAE6DF] rounded-2xl p-5 shadow-2xs">
            <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#1E3A2F]" />
              <span>Cross-Madhhab Juristic Acceptance Matrix</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#EAE6DF] text-[#78716C]">
                    <th className="py-2 px-3 font-semibold">Juristic School (Madhhab)</th>
                    <th className="py-2 px-3 font-semibold">{currentPair.prodA.name}</th>
                    <th className="py-2 px-3 font-semibold">{currentPair.prodB.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF]">
                  <tr>
                    <td className="py-2.5 px-3 font-medium">Standard (Consensus / Ijma')</td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodA.madhhabSupport.standard ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Impermissible
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodB.madhhabSupport.standard ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Impermissible
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium">Hanafi (Strict Carmine / Rennet)</td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodA.madhhabSupport.hanafi ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Impermissible / Doubtful
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodB.madhhabSupport.hanafi ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Impermissible
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium">Shafi'i (Marine Permitted)</td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodA.madhhabSupport.shafii ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Impermissible
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodB.madhhabSupport.shafii ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#DC2626] font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Impermissible
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium">Strict Wara' (Precautionary)</td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodA.madhhabSupport.strict ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#D97706] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Avoid (Precaution)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {currentPair.prodB.madhhabSupport.strict ? (
                        <span className="text-[#059669] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Permitted
                        </span>
                      ) : (
                        <span className="text-[#D97706] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Avoid (Precaution)
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
