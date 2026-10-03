"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Trash2, ArrowRight, Barcode, Camera, Sparkles, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { AuditResponse, HistoryItem, VerdictStatus } from "../lib/types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectAudit: (audit: AuditResponse) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectAudit,
  onClearHistory,
  onDeleteItem,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  const getVerdictBadge = (status: VerdictStatus) => {
    switch (status) {
      case "HALAL":
        return {
          label: "Halal",
          bg: "bg-[#ECFDF5]",
          border: "border-[#A7F3D0]",
          text: "text-[#065F46]",
          icon: CheckCircle2,
        };
      case "HARAM":
        return {
          label: "Haram",
          bg: "bg-[#FEF2F2]",
          border: "border-[#FECACA]",
          text: "text-[#991B1B]",
          icon: XCircle,
        };
      case "MUSHBOOH":
        return {
          label: "Mushbooh",
          bg: "bg-[#FFFBEB]",
          border: "border-[#FDE68A]",
          text: "text-[#92400E]",
          icon: AlertTriangle,
        };
      default:
        return {
          label: "Review",
          bg: "bg-[#F8FAFC]",
          border: "border-[#E2E8F0]",
          text: "text-[#475569]",
          icon: HelpCircle,
        };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Responsive Drawer Container:
            On mobile (<640px): Bottom Sheet sliding from bottom
            On desktop (>=640px): Slide-over drawer sliding from right
        */}
        <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto flex max-h-[85vh] sm:max-h-full w-full sm:max-w-md">
          <motion.div
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%", x: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="w-full flex flex-col rounded-t-3xl sm:rounded-none sm:rounded-l-3xl bg-white border-t sm:border-t-0 sm:border-l border-[#EAE6DF] shadow-2xl overflow-hidden"
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <span className="w-12 h-1.5 rounded-full bg-[#EAE6DF]" />
            </div>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE1] bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1E3A2F]/10 flex items-center justify-center text-[#1E3A2F]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1C1917]">
                    Recent Audits
                  </h3>
                  <p className="text-[11px] text-[#78716C]">
                    Stored locally in your browser
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your scan history?")) {
                        onClearHistory();
                      }
                    }}
                    className="p-2 rounded-full text-[#78716C] hover:text-[#991B1B] hover:bg-[#FEF2F2] transition-colors"
                    title="Clear All History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* History Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {history.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center mx-auto text-[#A8A29E]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-[#1C1917]">
                      No Past Audits Yet
                    </h4>
                    <p className="text-xs text-[#78716C] max-w-xs mx-auto mt-1 leading-relaxed">
                      Products and barcodes you scan will be automatically remembered here for instant offline recall.
                    </p>
                  </div>
                </div>
              ) : (
                history.map((item) => {
                  const badge = getVerdictBadge(item.audit.overall_verdict);
                  const BadgeIcon = badge.icon;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative p-3.5 rounded-2xl border border-[#EAE6DF] bg-white hover:border-[#1E3A2F]/40 hover:shadow-xs transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          onClick={() => {
                            onSelectAudit(item.audit);
                            onClose();
                          }}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-[10px] text-[#A8A29E] font-medium uppercase tracking-wider mb-0.5">
                            <span className="flex items-center gap-1 text-[#78716C]">
                              {item.inputType === "barcode" ? (
                                <>
                                  <Barcode className="w-3 h-3 text-[#1E3A2F]" />
                                  <span>Barcode: {item.barcode}</span>
                                </>
                              ) : (
                                <>
                                  <Camera className="w-3 h-3 text-[#1E3A2F]" />
                                  <span>Photo Scan</span>
                                </>
                              )}
                            </span>
                            <span>•</span>
                            <span>{timeAgo(item.timestamp)}</span>
                          </div>

                          <h5 className="font-serif font-bold text-sm text-[#1C1917] group-hover:text-[#1E3A2F] transition-colors line-clamp-1">
                            {item.audit.product_name}
                          </h5>

                          {item.audit.brand && (
                            <p className="text-xs text-[#78716C] line-clamp-1">
                              {item.audit.brand}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${badge.border} ${badge.bg} ${badge.text}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>

                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 rounded-full text-[#A8A29E] hover:text-[#991B1B] hover:bg-[#FEF2F2] transition-colors"
                            title="Remove from history"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Tap to Reload indicator */}
                      <button
                        onClick={() => {
                          onSelectAudit(item.audit);
                          onClose();
                        }}
                        className="w-full pt-1.5 border-t border-[#F5F2EB] flex items-center justify-between text-[11px] text-[#1E3A2F] font-medium hover:underline text-left"
                      >
                        <span>Reload Complete Findings</span>
                        <ArrowRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer Info */}
            <div className="p-4 border-t border-[#F0EBE1] bg-[#FAF8F5] text-center text-[11px] text-[#78716C]">
              <span>Privacy Guaranteed • Data persists exclusively on your device</span>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
