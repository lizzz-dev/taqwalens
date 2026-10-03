"use client";

import React, { useState } from "react";
import { IngredientItem, VerdictStatus } from "../lib/types";
import { CheckCircle2, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp, BookOpen, Layers } from "lucide-react";

interface IngredientGridProps {
  ingredients: IngredientItem[];
}

export function IngredientGrid({ ingredients }: IngredientGridProps) {
  const [selectedItem, setSelectedItem] = useState<IngredientItem | null>(null);

  const totalCount = ingredients.length;
  const halalCount = ingredients.filter((i) => i.status === "HALAL").length;
  const mushboohCount = ingredients.filter((i) => i.status === "MUSHBOOH").length;
  const haramCount = ingredients.filter((i) => i.status === "HARAM").length;

  const getStatusStyles = (status: VerdictStatus) => {
    switch (status) {
      case "HALAL":
        return {
          chip: "bg-white border-[#EAE6DF] text-[#1C1917] hover:border-[#1E3A2F]/40 hover:bg-[#FAF8F5]",
          badge: "bg-[#F0F5F2] text-[#1E3A2F] border-[#CBE0D4]",
          icon: CheckCircle2,
          iconColor: "text-[#2D5A46]",
        };
      case "HARAM":
        return {
          chip: "bg-[#FEF2F2]/60 border-[#FECACA] text-[#991B1B] hover:border-[#B91C1C]",
          badge: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
          icon: XCircle,
          iconColor: "text-[#B91C1C]",
        };
      case "MUSHBOOH":
        return {
          chip: "bg-[#FCF7ED]/60 border-[#F5DEB3] text-[#92400E] hover:border-[#C28E38]",
          badge: "bg-[#FCF7ED] text-[#B45309] border-[#F5DEB3]",
          icon: AlertTriangle,
          iconColor: "text-[#C28E38]",
        };
      default:
        return {
          chip: "bg-white border-[#EAE6DF] text-[#44403C] hover:border-[#A8A29E]",
          badge: "bg-[#FAF8F5] text-[#78716C] border-[#EAE6DF]",
          icon: Info,
          iconColor: "text-[#78716C]",
        };
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Metric Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif font-bold text-base text-[#1C1917] tracking-tight flex items-center gap-2">
          <span>Detected Ingredients</span>
          <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-white border border-[#EAE6DF] text-[#78716C] shadow-2xs">
            {totalCount} Total
          </span>
        </h3>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F5F2] border border-[#CBE0D4] text-[#1E3A2F] font-medium shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            {halalCount} Permissible
          </span>
          {mushboohCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCF7ED] border border-[#F5DEB3] text-[#B45309] font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              {mushboohCount} Inquire
            </span>
          )}
          {haramCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] font-medium shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              {haramCount} Prohibited
            </span>
          )}
        </div>
      </div>

      {/* Ingredient Chip Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ingredients.map((item, idx) => {
          const styles = getStatusStyles(item.status);
          const isSelected = selectedItem === item;

          return (
            <button
              key={`${item.name}-${idx}`}
              onClick={() => setSelectedItem(isSelected ? null : item)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 shadow-2xs ${styles.chip} ${
                isSelected ? "ring-2 ring-[#1E3A2F]/40" : ""
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <styles.icon className={`w-4 h-4 shrink-0 ${styles.iconColor}`} />
                <div className="truncate">
                  <div className="text-sm font-medium truncate text-[#1C1917]">{item.name}</div>
                  {item.additive_detail?.code && (
                    <span className="text-[11px] text-[#78716C]">
                      Additive Code: {item.additive_detail.code}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${styles.badge}`}
                >
                  {item.status}
                </span>
                {isSelected ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#78716C]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#A8A29E]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Item Expanded Detail Inspector */}
      {selectedItem && (
        <div className="p-6 rounded-2xl border border-[#EAE6DF] bg-white space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0EBE1] pb-3.5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1 font-medium">
                <span>Ingredient Compliance Profile</span>
                {selectedItem.additive_detail?.code && (
                  <span>• E-Number: {selectedItem.additive_detail.code}</span>
                )}
              </div>
              <h4 className="text-xl font-serif font-bold text-[#1C1917]">{selectedItem.name}</h4>
              <p className="text-xs text-[#78716C] mt-0.5">
                Label declaration: &quot;{selectedItem.raw_text}&quot;
              </p>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-xs font-medium text-[#78716C] hover:text-[#1C1917] px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#EAE6DF]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] space-y-1">
              <span className="text-[#78716C] font-semibold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-[#2D5A46]" />
                Source Origin
              </span>
              <p className="font-medium text-[#1C1917] capitalize text-sm">
                {selectedItem.source || selectedItem.additive_detail?.source || "Unstated / Ambiguous"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] space-y-1 md:col-span-2">
              <span className="text-[#78716C] font-semibold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-[#2D5A46]" />
                Dietary Standards & Juristic Rationale
              </span>
              <p className="text-[#44403C] leading-relaxed text-sm">
                {selectedItem.reason ||
                  selectedItem.additive_detail?.description ||
                  "Permissible standard food ingredient. No animal derivatives identified."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
