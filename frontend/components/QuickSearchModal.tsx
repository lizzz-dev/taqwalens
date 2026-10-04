"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CheckCircle2, AlertTriangle, XCircle, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { AdditiveDetail, VerdictStatus } from "../lib/types";
import { getApiBaseUrl } from "../lib/api";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_ADDITIVES = [
  { code: "E120", name: "Carmine / Cochineal", status: "HARAM" as VerdictStatus },
  { code: "E471", name: "Mono- & Diglycerides of Fatty Acids", status: "MUSHBOOH" as VerdictStatus },
  { code: "E441", name: "Gelatin", status: "MUSHBOOH" as VerdictStatus },
  { code: "E100", name: "Curcumin (Turmeric Extract)", status: "HALAL" as VerdictStatus },
  { code: "E300", name: "Ascorbic Acid (Vitamin C)", status: "HALAL" as VerdictStatus },
  { code: "E904", name: "Shellac (Resin Glaze)", status: "MUSHBOOH" as VerdictStatus },
];

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AdditiveDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResult(null);
      setSearchError(null);
    }
  }, [isOpen]);

  const handleSearch = async (searchTerm: string) => {
    const clean = searchTerm.trim().toUpperCase();
    if (!clean) return;

    setIsLoading(true);
    setSearchError(null);
    setResult(null);

    const API_BASE = getApiBaseUrl();

    try {
      const res = await fetch(`${API_BASE}/api/ecode/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setSearchError(`Additive '${clean}' was not found in the compliance database. Try searching 'E120', 'E471', 'E100', or 'Gelatin'.`);
      }
    } catch {
      setSearchError("Unable to reach additive catalog service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl rounded-2xl bg-white border border-[#EAE6DF] shadow-2xl overflow-hidden"
        >
          {/* Search Input Bar */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-b border-[#F0EBE1] bg-[#FAF8F5]">
            <Search className="w-5 h-5 text-[#1E3A2F] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by E-code or name (e.g. E120, E471, Lecithin)..."
              className="w-full bg-transparent text-sm sm:text-base text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResult(null);
                  setSearchError(null);
                }}
                className="text-xs text-[#78716C] hover:text-[#1C1917] px-2"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          {/* Modal Content */}
          <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
            {isLoading && (
              <div className="py-8 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#1E3A2F] border-t-transparent animate-spin" />
                <span>Searching catalog...</span>
              </div>
            )}

            {searchError && (
              <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                {searchError}
              </div>
            )}

            {/* Found Result Card */}
            {result && (
              <div className="p-4 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-3 border-b border-[#EAE6DF] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#78716C] block">
                      {result.code} • {result.category}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#1C1917]">
                      {result.name}
                    </h4>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      result.status === "HALAL"
                        ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                        : result.status === "HARAM"
                        ? "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
                        : "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                    }`}
                  >
                    {result.status === "HALAL" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : result.status === "HARAM" ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>{result.status}</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#44403C]">
                  <p>
                    <strong className="text-[#1C1917]">Origin:</strong>{" "}
                    <span className="capitalize">{result.source}</span>
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-[#1C1917]">Fiqh Rationale:</strong>{" "}
                    {result.fiqh_notes || result.description}
                  </p>
                  {result.reference_authority && (
                    <p className="text-[11px] text-[#78716C] pt-1">
                      Authority: {result.reference_authority}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Browse Chips */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#78716C] font-semibold uppercase tracking-wider block">
                Popular Additive Inquiries:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {COMMON_ADDITIVES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setQuery(item.code);
                      handleSearch(item.code);
                    }}
                    className="p-2.5 rounded-xl border border-[#EAE6DF] bg-white hover:border-[#1E3A2F]/40 hover:bg-[#FAF8F5] transition-all flex items-center justify-between text-left group"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#1C1917]">
                        {item.code}
                      </span>
                      <p className="text-[11px] text-[#78716C] line-clamp-1">
                        {item.name}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === "HALAL"
                          ? "bg-[#ECFDF5] text-[#065F46]"
                          : item.status === "HARAM"
                          ? "bg-[#FEF2F2] text-[#991B1B]"
                          : "bg-[#FFFBEB] text-[#92400E]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
