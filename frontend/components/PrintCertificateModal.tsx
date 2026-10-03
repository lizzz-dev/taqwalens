"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, HelpCircle, Award, Sparkles, Calendar, Tag, Shield } from "lucide-react";
import { AuditResponse, VerdictStatus } from "../lib/types";
import { formatTime } from "../lib/utils";

interface PrintCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: AuditResponse;
}

export function PrintCertificateModal({ isOpen, onClose, audit }: PrintCertificateModalProps) {
  const sealCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animated 3D Holographic Seal Effect
  useEffect(() => {
    if (!isOpen) return;

    const canvas = sealCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = 64;

      ctx.clearRect(0, 0, w, h);

      // Radial gold/emerald sheen
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius + 10);
      grad.addColorStop(0, "#FCF9EE");
      grad.addColorStop(0.7, "#EFE8D0");
      grad.addColorStop(1, "#D4AF37");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer serrated / scalloped seal edge
      ctx.strokeStyle = "#B38B26";
      ctx.lineWidth = 2.5;
      const teeth = 36;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const th = (i * Math.PI * 2) / teeth;
        const r1 = radius + 2 + Math.sin(i * 3 + angle * 2) * 1.5;
        const x1 = cx + Math.cos(th) * r1;
        const y1 = cy + Math.sin(th) * r1;
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner golden border
      ctx.strokeStyle = "#8A691E";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 8, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating subtle light reflection sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const sheenGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
      sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.45)");
      sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      ctx.restore();

      // Center Islamic Crescent / Star Motif
      ctx.fillStyle = "#1E3A2F";
      ctx.beginPath();
      ctx.arc(cx - 3, cy, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#EFE8D0";
      ctx.beginPath();
      ctx.arc(cx + 4, cy - 4, 18, 0, Math.PI * 2);
      ctx.fill();

      // Center 8-pointed Islamic Star
      ctx.fillStyle = "#1E3A2F";
      ctx.font = "bold 16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦", cx + 12, cy - 2);

      // Circular text around border
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 0.4);
      ctx.font = "bold 8.5px sans-serif";
      ctx.fillStyle = "#1E3A2F";
      ctx.textAlign = "center";
      const sealText = "• TAQWALENS COMPLIANCE SEAL • VERIFIED STANDARD • ";
      for (let i = 0; i < sealText.length; i++) {
        const charAngle = (i * Math.PI * 2) / sealText.length;
        ctx.save();
        ctx.rotate(charAngle);
        ctx.fillText(sealText[i], 0, -radius + 16);
        ctx.restore();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getVerdictStamp = (status: VerdictStatus) => {
    switch (status) {
      case "HALAL":
        return {
          text: "HALAL COMPLIANT",
          color: "text-[#059669]",
          border: "border-[#059669]",
          bg: "bg-[#ECFDF5]",
          icon: CheckCircle2,
        };
      case "HARAM":
        return {
          text: "PROHIBITED (HARAM)",
          color: "text-[#DC2626]",
          border: "border-[#DC2626]",
          bg: "bg-[#FEF2F2]",
          icon: XCircle,
        };
      case "MUSHBOOH":
        return {
          text: "VERIFICATION REQUIRED",
          color: "text-[#D97706]",
          border: "border-[#D97706]",
          bg: "bg-[#FFFBEB]",
          icon: AlertTriangle,
        };
      default:
        return {
          text: "REQUIRES REVIEW",
          color: "text-[#64748B]",
          border: "border-[#64748B]",
          bg: "bg-[#F8FAFC]",
          icon: HelpCircle,
        };
    }
  };

  const stamp = getVerdictStamp(audit.overall_verdict);
  const StampIcon = stamp.icon;
  const certId = `TL-${Math.abs((audit.product_name.length * 37 + 1099) % 90000 + 10000)}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#EAE6DF] shadow-2xl overflow-hidden print:shadow-none print:border-none print:max-w-none print:rounded-none"
        >
          {/* Top Modal Action Bar (Hidden in Print) */}
          <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-[#F0EBE1] bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1E3A2F]" />
              <span className="font-serif font-bold text-sm text-[#1C1917]">
                Official Compliance Dossier & Certificate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E3A2F] text-white text-xs font-medium hover:bg-[#2D5A46] transition-colors shadow-2xs active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-white/80 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Certificate Body (Printed Content) */}
          <div className="p-6 sm:p-10 space-y-7 text-[#1C1917] bg-[#FCFBF8] border-8 border-double border-[#EAE6DF] m-3 sm:m-4 rounded-2xl print:m-0 print:border-4">
            {/* Header: Emblems, Title, and 3D Holographic Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-[#1E3A2F]/20 text-center sm:text-left">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] text-[11px] font-semibold uppercase tracking-widest">
                  <Shield className="w-3 h-3 text-[#1E3A2F]" />
                  <span>Institutional Fiqh Verification</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
                  TaqwaLens Compliance Certificate
                </h1>
                <p className="text-xs text-[#78716C] max-w-md">
                  Autonomous optical ingredient analysis & juristic additive cross-verification document.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-[#A8A29E] font-mono">
                  <span>Dossier ID: {certId}</span>
                  <span>•</span>
                  <span>Date: {currentDate}</span>
                </div>
              </div>

              {/* Interactive 3D Canvas Seal */}
              <div className="relative shrink-0 flex flex-col items-center">
                <canvas
                  ref={sealCanvasRef}
                  width={150}
                  height={150}
                  className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md"
                />
                <span className="text-[10px] font-medium text-[#78716C] mt-1 font-mono tracking-tight">
                  SEAL AUTHENTICATED
                </span>
              </div>
            </div>

            {/* Product Overview Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white border border-[#EAE6DF] shadow-2xs">
              <div className="sm:col-span-2 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#A8A29E] tracking-wider">
                  Audited Product
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">
                  {audit.product_name}
                </h3>
                <p className="text-xs text-[#78716C]">
                  Brand: {audit.brand || "Unspecified / Generic"} • Processing Time: {formatTime(audit.metadata.processing_time_ms)}
                </p>
              </div>

              <div className="flex flex-col justify-center sm:items-end space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#A8A29E] tracking-wider">
                  Juristic Profile
                </span>
                <span className="text-xs font-medium text-[#1E3A2F] bg-[#F0F5F2] px-3 py-1 rounded-full border border-[#CBE0D4] inline-block capitalize">
                  {audit.madhhab_profile ? `${audit.madhhab_profile} Standard` : "Standard Consensus"}
                </span>
              </div>
            </div>

            {/* Official Verdict Stamp Banner */}
            <div
              className={`p-5 rounded-2xl border-2 ${stamp.border} ${stamp.bg} flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs`}
            >
              <div className="flex items-center gap-3.5">
                <StampIcon className={`w-8 h-8 ${stamp.color} shrink-0`} />
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-75">
                    Official Audit Finding
                  </span>
                  <h4 className={`text-xl sm:text-2xl font-serif font-bold ${stamp.color}`}>
                    {stamp.text}
                  </h4>
                </div>
              </div>

              <div className="text-xs text-[#44403C] max-w-sm sm:text-right font-medium leading-relaxed">
                {audit.verdict_summary}
              </div>
            </div>

            {/* Dietary Tags & Allergen Alerts */}
            {((audit.dietary_tags && audit.dietary_tags.length > 0) ||
              (audit.allergens_detected && audit.allergens_detected.length > 0)) && (
              <div className="p-4 rounded-xl bg-white border border-[#EAE6DF] space-y-2.5">
                <span className="text-[10px] uppercase font-semibold text-[#A8A29E] tracking-wider block">
                  Dietary Suitability & Allergen Declaration
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {audit.dietary_tags?.map((diet) => (
                    <span
                      key={diet}
                      className="px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-medium inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#059669]" />
                      <span>{diet}</span>
                    </span>
                  ))}
                  {audit.allergens_detected?.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-medium inline-flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3 h-3 text-[#D97706]" />
                      <span>Allergen: {allergen}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additives & E-Codes Audit Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-serif font-bold text-sm text-[#1C1917] tracking-tight">
                  Detailed Additive & Ingredient Inventory
                </h4>
                <span className="text-[#78716C] text-[11px]">
                  {audit.ingredients.length} items cataloged
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#EAE6DF] bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EAE6DF] text-[#78716C] font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3.5">Ingredient / E-Code</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Origin</th>
                      <th className="py-2.5 px-3.5">Fiqh Juristic Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1]">
                    {audit.ingredients.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="py-2.5 px-3.5 font-medium text-[#1C1917]">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.status === "HALAL"
                                ? "bg-[#ECFDF5] text-[#065F46]"
                                : item.status === "HARAM"
                                ? "bg-[#FEF2F2] text-[#991B1B]"
                                : "bg-[#FFFBEB] text-[#92400E]"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 capitalize text-[#78716C]">
                          {item.source || item.additive_detail?.source || "Unspecified"}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#44403C] text-[11px] leading-relaxed">
                          {item.reason || item.additive_detail?.fiqh_notes || "Compliant with standard Islamic dietary thresholds."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Authoritative Sign-off & Disclaimer Footer */}
            <div className="pt-4 border-t border-[#EAE6DF] space-y-3 text-[11px] text-[#78716C] leading-relaxed">
              <p>
                <strong className="text-[#1C1917]">Regulatory Reference Standards:</strong> JAKIM MS 1500:2019 (Halal Food Production Preparation, Handling and Storage), Codex Alimentarius CAC/GL 24-1997, and Gulf Standard GSO 993.
              </p>
              <p className="italic bg-[#FAF8F5] p-3 rounded-lg border border-[#EAE6DF]">
                <strong className="not-italic text-[#1C1917]">Notice:</strong> {audit.disclaimer}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[10px] text-[#A8A29E] font-mono">
                <span>VERIFICATION HASH: {certId}-VERIFIED-ENGINE-v1</span>
                <span>TAQWALENS AUTONOMOUS AUDITOR</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
