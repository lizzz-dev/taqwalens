"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export function Disclaimer() {
  return (
    <footer className="w-full mt-16 pt-8 pb-14 border-t border-[#EAE6DF] text-[#78716C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#F0F5F2] text-[#1E3A2F] shrink-0 mt-0.5 border border-[#CBE0D4]">
              <Info className="w-5 h-5 text-[#2D5A46]" />
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <h4 className="font-serif font-bold text-[#1C1917] text-sm">
                Educational & Informational Dietary Notice
              </h4>
              <p className="text-[#57534E]">
                TaqwaLens is an automated ingredient transparency auditor built to help mindful consumers review packaging labels. It provides educational classification and is{" "}
                <strong className="text-[#1C1917] font-semibold">not</strong> a formal religious decree (fatwa) or a replacement for direct certification board audits. Additive classifications are derived from recognized international authorities including JAKIM MS 1500, IFANCA, and Codex Alimentarius.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#78716C]">
                <span>Authoritative Standards: JAKIM MS 1500:2019 / Codex Class 1</span>
                <span>•</span>
                <span>370+ Indexed Additives</span>
                <span>•</span>
                <span>Multi-Madhhab Sourcing Transparency</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-3">
          <p>© {new Date().getFullYear()} TaqwaLens. Mindful Living & Ingredient Clarity.</p>
          <p className="text-[11px]">
            Designed for conscious consumers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
