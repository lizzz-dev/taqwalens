"use client";

import React from "react";
import { Zap, CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";
import { soundManager } from "../lib/soundEffects";

export interface DemoPreset {
  id: string;
  name: string;
  brand: string;
  category: string;
  verdictType: "HALAL" | "MUSHBOOH" | "HARAM";
  verdictLabel: string;
  icon: string;
  ingredientsText: string;
  description: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "indomie",
    name: "Indomie Mi Goreng",
    brand: "Indofood",
    category: "Instant Noodles",
    verdictType: "HALAL",
    verdictLabel: "Halal Certified",
    icon: "🍜",
    ingredientsText:
      "Wheat Flour, Refined Palm Oil, Salt, Sodium Carbonate (E500), Potassium Carbonate (E501), Guar Gum (E412), Riboflavin (E101). Seasoning: Sugar, Salt, Monosodium Glutamate (E621), Disodium Inosinate (E631), Disodium Guanylate (E627), Garlic Powder, Onion Powder, Yeast Extract, Caramel IV (E150d), Chili Powder. Chili Sauce: Chili, Water, Sugar, Salt, Acetic Acid (E260). Sweet Soy Sauce: Sugar, Water, Soybeans, Wheat, Salt, Spices, Sesame Oil.",
    description: "JAKIM & MUI approved staple with plant-derived and synthetic approved E-numbers.",
  },
  {
    id: "haribo",
    name: "Haribo Goldbears (EU)",
    brand: "Haribo",
    category: "Gummy Candy",
    verdictType: "HARAM",
    verdictLabel: "Porcine Gelatin (E441)",
    icon: "🐻",
    ingredientsText:
      "Glucose Syrup, Sugar, Gelatine (Porcine E441), Dextrose, Citric Acid, Fruit and Plant Concentrates: Safflower, Spirulina, Apple, Elderberry, Orange, Blackcurrant, Kiwi, Lemon, Aronia, Mango, Passion Fruit, Grape, Flavoring, Elderberry Extract, Glazing Agents: White and Yellow Beeswax (E901), Carnauba Wax (E903).",
    description: "Classic European confection containing porcine (pig) gelatin.",
  },
  {
    id: "doritos",
    name: "Doritos Nacho Cheese",
    brand: "Frito-Lay",
    category: "Snack Chips",
    verdictType: "MUSHBOOH",
    verdictLabel: "Animal Rennet & Whey",
    icon: "🧀",
    ingredientsText:
      "Corn, Vegetable Oil (Corn, Canola, and/or Sunflower Oil), Maltodextrin, Salt, Cheddar Cheese (Milk, Cheese Cultures, Salt, Enzymes), Whey, Monosodium Glutamate (E621), Buttermilk, Romano Cheese (Part-Skim Cow's Milk, Cheese Cultures, Salt, Animal Rennet), Whey Protein Concentrate, Onion Powder, Corn Flour, Natural and Artificial Flavor, Dextrose, Tomato Powder, Lactose, Spices, Artificial Color (Yellow 6, Yellow 5, Red 40), Lactic Acid, Citric Acid, Sugar, Garlic Powder, Skim Milk, Red and Green Bell Pepper Powder, Disodium Inosinate, Disodium Guanylate.",
    description: "Contains microbial vs animal rennet and cross-madhhab doubtful dairy enzymes.",
  },
  {
    id: "macarons",
    name: "Red Velvet Macarons",
    brand: "Maison Pâtisserie",
    category: "French Bakery",
    verdictType: "MUSHBOOH",
    verdictLabel: "Carmine E120 (Hanafi)",
    icon: "🧁",
    ingredientsText:
      "Almond Flour, Powdered Sugar, Egg Whites, Granulated Sugar, Cocoa Powder, Cream of Tartar, Vanilla Extract, Carmine Color (E120 / Cochineal Extract), Red 40, Buttercream Filling: Butter, Confectioners Sugar, Heavy Cream, Vanilla Bean, Soy Lecithin (E322).",
    description: "Contains E120 Carmine (crushed cochineal insect) strictly forbidden in Hanafi fiqh.",
  },
  {
    id: "lotus",
    name: "Lotus Biscoff Spread",
    brand: "Lotus Bakeries",
    category: "Sweet Spreads",
    verdictType: "HALAL",
    verdictLabel: "100% Vegan Halal",
    icon: "🍪",
    ingredientsText:
      "Original Caramelised Biscuits 58% (Wheat Flour, Sugar, Vegetable Oils (Palm, Rapeseed), Candy Sugar Syrup, Raising Agent (Sodium Hydrogen Carbonate), Soy Flour, Salt, Cinnamon), Rapeseed Oil, Sugar, Emulsifier (Soy Lecithin E322), Acid (Citric Acid).",
    description: "Certified vegan plant-based spread completely free of animal fat and dubious emulsifiers.",
  },
];

interface DemoPresetsTrayProps {
  onSelectPreset: (preset: DemoPreset) => void;
  selectedPresetId?: string | null;
}

export function DemoPresetsTray({ onSelectPreset, selectedPresetId }: DemoPresetsTrayProps) {
  const handleSelect = (p: DemoPreset) => {
    soundManager.playClick();
    onSelectPreset(p);
  };

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl p-3 sm:p-4 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 fill-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
              <span>Instant Test Lab Presets</span>
              <span className="text-[10px] font-normal text-[#78716C] bg-white border border-[#EAE6DF] px-1.5 py-0.5 rounded-full">
                1-Click Demo
              </span>
            </h4>
            <p className="text-[11px] text-[#78716C] hidden sm:block">
              Select any real-world sample product to audit without needing physical packaging.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Pills Tray */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {DEMO_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const badgeColor =
            preset.verdictType === "HALAL"
              ? "bg-[#059669]/10 text-[#059669] border-[#059669]/30"
              : preset.verdictType === "HARAM"
              ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30"
              : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30";

          return (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group active:scale-95 ${
                isSelected
                  ? "bg-white border-[#1E3A2F] shadow-sm ring-1 ring-[#1E3A2F]"
                  : "bg-white border-[#EAE6DF] hover:border-[#1E3A2F]/40 hover:bg-[#FAF8F5]"
              }`}
              title={preset.description}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-base sm:text-lg">{preset.icon}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border tracking-tight ${badgeColor}`}
                  >
                    {preset.verdictType}
                  </span>
                </div>
                <div className="font-semibold text-xs text-[#1C1917] truncate leading-tight">
                  {preset.name}
                </div>
                <div className="text-[10px] text-[#78716C] truncate mt-0.5">{preset.brand}</div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-[#EAE6DF]/60 flex items-center justify-between text-[10px] text-[#1E3A2F] font-medium">
                <span className="truncate text-[#78716C] text-[9px]">{preset.verdictLabel}</span>
                <span className="group-hover:translate-x-0.5 transition-transform text-[#1E3A2F] font-bold">
                  Audit →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
