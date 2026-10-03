"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldCheck, Sparkles, Clock, Award, FileText, Scale } from "lucide-react";
import { AuditResponse, VerdictStatus } from "../lib/types";
import { formatTime } from "../lib/utils";

interface VerdictCardProps {
  audit: AuditResponse;
  onOpenCertificate?: () => void;
}

export function VerdictCard({ audit, onOpenCertificate }: VerdictCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D subtle card tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getVerdictConfig = (status: VerdictStatus) => {
    switch (status) {
      case "HALAL":
        return {
          label: "Halal Verified",
          icon: CheckCircle2,
          textColor: "text-[#1E3A2F]",
          badgeBg: "bg-[#F0F5F2]",
          badgeBorder: "border-[#CBE0D4]",
          cardBorder: "border-[#CBE0D4]",
          accentDot: "bg-[#22C55E]",
        };
      case "HARAM":
        return {
          label: "Prohibited (Haram)",
          icon: XCircle,
          textColor: "text-[#B91C1C]",
          badgeBg: "bg-[#FEF2F2]",
          badgeBorder: "border-[#FECACA]",
          cardBorder: "border-[#FECACA]",
          accentDot: "bg-[#EF4444]",
        };
      case "MUSHBOOH":
        return {
          label: "Verification Required (Mushbooh)",
          icon: AlertTriangle,
          textColor: "text-[#B45309]",
          badgeBg: "bg-[#FCF7ED]",
          badgeBorder: "border-[#F5DEB3]",
          cardBorder: "border-[#F5DEB3]",
          accentDot: "bg-[#F59E0B]",
        };
      default:
        return {
          label: "Requires Review",
          icon: HelpCircle,
          textColor: "text-[#78716C]",
          badgeBg: "bg-[#FAF8F5]",
          badgeBorder: "border-[#EAE6DF]",
          cardBorder: "border-[#EAE6DF]",
          accentDot: "bg-[#A8A29E]",
        };
    }
  };

  const config = getVerdictConfig(audit.overall_verdict);
  const StatusIcon = config.icon;

  return (
    <div style={{ perspective: "1000px" }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full rounded-2xl bg-white border ${config.cardBorder} p-5 sm:p-8 transition-shadow duration-300 shadow-sm hover:shadow-md`}
      >
        <div className="relative z-10 flex flex-col gap-6">
          {/* Header Row: Product Name & Verdict Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EBE1] pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#78716C] uppercase tracking-wider mb-1.5">
                <span>{audit.brand || "Food Product Audit"}</span>
                {audit.detected_certifications.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-[#1E3A2F] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A46]" />
                      {audit.detected_certifications.join(", ")}
                    </span>
                  </>
                )}
                {audit.madhhab_profile && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-[#44403C] capitalize font-medium">
                      <Scale className="w-3 h-3 text-[#1E3A2F]" />
                      {audit.madhhab_profile} Profile
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
                {audit.product_name}
              </h2>
            </div>

            {/* Verdict Badge & Certificate Action */}
            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              <div
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border ${config.badgeBorder} ${config.badgeBg} shadow-2xs`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${config.accentDot}`} />
                <StatusIcon className={`w-4 h-4 ${config.textColor}`} />
                <span className={`text-xs sm:text-sm font-semibold tracking-tight ${config.textColor}`}>
                  {config.label}
                </span>
              </div>

              {onOpenCertificate && (
                <button
                  onClick={onOpenCertificate}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#1E3A2F] text-white text-xs font-medium hover:bg-[#2D5A46] transition-all shadow-2xs active:scale-95 min-h-[38px]"
                  title="View formal compliance certificate and export PDF"
                >
                  <Award className="w-3.5 h-3.5 text-[#CBE0D4]" />
                  <span>Certificate</span>
                </button>
              )}
            </div>
          </div>

          {/* Core Findings & Technical Analysis */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
              Dietary Findings & Analysis
            </h3>
            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed font-normal">
              {audit.verdict_summary}
            </p>
          </div>

          {/* Dietary Tags & Allergens (if detected) */}
          {((audit.dietary_tags && audit.dietary_tags.length > 0) ||
            (audit.allergens_detected && audit.allergens_detected.length > 0)) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {audit.dietary_tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs font-medium shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-[#15803D]" />
                  <span>{tag}</span>
                </span>
              ))}

              {audit.allergens_detected?.map((allergen) => (
                <span
                  key={allergen}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-medium shadow-2xs"
                >
                  <AlertTriangle className="w-3 h-3 text-[#D97706]" />
                  <span>Contains: {allergen}</span>
                </span>
              ))}
            </div>
          )}

          {/* Customer-Centric Verification Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F0EBE1] text-xs text-[#78716C]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2D5A46]" />
                <span>Audited in {formatTime(audit.metadata.processing_time_ms)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A46]" />
                <span>Verified with MS 1500 Guidelines</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] text-[#78716C]">
                Resolution: {audit.metadata.image_width}×{audit.metadata.image_height}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
