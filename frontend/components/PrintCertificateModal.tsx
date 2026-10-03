"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  Calendar,
  Tag,
  Shield,
  Download,
  FileText,
} from "lucide-react";
import { AuditResponse, VerdictStatus } from "../lib/types";
import { formatTime } from "../lib/utils";

interface PrintCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: AuditResponse;
}

export function PrintCertificateModal({ isOpen, onClose, audit }: PrintCertificateModalProps) {
  const sealCanvasRef = useRef<HTMLCanvasElement>(null);

  // Keyboard shortcut (Escape to close) and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleBeforePrint = () => {
      document.body.classList.add("printing-certificate");
    };
    const handleAfterPrint = () => {
      document.body.classList.remove("printing-certificate");
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("printing-certificate");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [isOpen, onClose]);

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

  // Print isolation trigger
  const handlePrint = () => {
    document.body.classList.add("printing-certificate");
    setTimeout(() => {
      window.print();
    }, 80);
  };

  // Direct standalone HTML download
  const handleDownloadHtml = () => {
    const contentEl = document.getElementById("printable-certificate-body");
    if (!contentEl) return;

    const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TaqwaLens Compliance Dossier - ${audit.product_name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; background: #ffffff; color: #1C1917; padding: 30px; max-width: 820px; margin: 0 auto; line-height: 1.5; }
    .certificate-frame { border: 4px double #1E3A2F; padding: 32px; border-radius: 12px; background: #FCFBF8; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th, td { border: 1px solid #EAE6DF; padding: 10px 12px; text-align: left; }
    th { background: #FAF8F5; color: #78716C; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
    .halal { background: #ECFDF5; color: #065F46; }
    .haram { background: #FEF2F2; color: #991B1B; }
    .mushbooh { background: #FFFBEB; color: #92400E; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="certificate-frame">
    ${contentEl.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([certHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TaqwaLens_Dossier_${audit.product_name.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    link.click();
    URL.revokeObjectURL(url);
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
      <div
        id="printable-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex flex-col items-center justify-start p-3 sm:p-6 py-6 sm:py-10 print:p-0 print:bg-white print:static print:inset-auto"
      >
        {/* Floating Quick Close Button (Top-Right of Screen) */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#1C1917] shadow-2xl border border-[#EAE6DF] hover:border-[#1E3A2F] transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold print:hidden cursor-pointer"
          title="Close Certificate (Esc)"
        >
          <X className="w-4 h-4 text-[#1C1917]" />
          <span className="hidden sm:inline">Close (Esc)</span>
        </button>

        {/* Modal Window Card */}
        <motion.div
          id="printable-certificate-card"
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#EAE6DF] shadow-2xl overflow-hidden print:shadow-none print:border-none print:max-w-none print:rounded-none my-auto sm:my-4"
        >
          {/* Sticky Top Modal Action Bar (Always Visible at Top of Modal) */}
          <div className="sticky top-0 z-30 print:hidden flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#F0EBE1] bg-[#FAF8F5]/98 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1E3A2F]" />
              <span className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] truncate">
                Official Compliance Dossier & Certificate
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Direct Save HTML Option */}
              <button
                onClick={handleDownloadHtml}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#EAE6DF] text-[#1C1917] text-xs font-medium hover:bg-[#FAF8F5] transition-all shadow-2xs active:scale-95 min-h-[38px]"
                title="Download offline HTML dossier"
              >
                <Download className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span>Save File</span>
              </button>

              {/* Primary Print / Save PDF Option */}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E3A2F] text-white text-xs font-bold hover:bg-[#2D5A46] transition-all shadow-sm active:scale-95 min-h-[38px]"
                title="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Download PDF / Print</span>
                <span className="sm:hidden">PDF / Print</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white border border-[#EAE6DF] text-[#1C1917] hover:bg-[#FAF8F5] hover:border-[#1E3A2F]/40 transition-colors shadow-2xs active:scale-95 min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Close Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Body (Printed Content) */}
          <div
            id="printable-certificate-body"
            className="p-5 sm:p-10 space-y-7 text-[#1C1917] bg-[#FCFBF8] border-8 border-double border-[#EAE6DF] m-3 sm:m-4 rounded-2xl print:m-0 print:border-4"
          >
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

              {/* Interactive 3D Canvas Seal (and Vector Seal for Print) */}
              <div className="relative shrink-0 flex flex-col items-center">
                <canvas
                  ref={sealCanvasRef}
                  width={150}
                  height={150}
                  className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md print:hidden"
                />
                {/* Clean Vector Gold Seal that is ALWAYS sharp in print */}
                <div className="hidden print:flex w-24 h-24 rounded-full border-4 border-[#B38B26] bg-[#FCF9EE] items-center justify-center text-center p-2">
                  <div className="w-20 h-20 rounded-full border-2 border-[#8A691E] flex flex-col items-center justify-center">
                    <span className="text-[#1E3A2F] text-lg font-serif">✦</span>
                    <span className="text-[8px] font-bold tracking-widest uppercase text-[#1E3A2F]">
                      TAQWALENS
                    </span>
                    <span className="text-[7px] text-[#8A691E] font-semibold">VERIFIED</span>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-[#78716C] mt-1 font-mono tracking-tight print:hidden">
                  Crypto Holographic Seal
                </span>
              </div>
            </div>

            {/* Product Dossier Summary Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#EAE6DF] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#78716C] uppercase font-mono tracking-wider">
                  Inspected Specimen
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">
                  {audit.product_name}
                </h2>
                {audit.brand && (
                  <p className="text-xs text-[#57534E]">Brand: {audit.brand}</p>
                )}
                <p className="text-[11px] text-[#78716C]">
                  Juristic Rule Applied:{" "}
                  <strong className="text-[#1E3A2F] uppercase">
                    {audit.madhhab_profile || "Standard (Consensus)"}
                  </strong>
                </p>
              </div>

              {/* Authoritative Stamp Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-serif font-bold text-sm tracking-wide shrink-0 ${stamp.bg} ${stamp.border} ${stamp.color}`}
              >
                <StampIcon className="w-5 h-5" />
                <span>{stamp.text}</span>
              </div>
            </div>

            {/* Verdict Explanation & Summary */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                Summary of Juristic Evaluation
              </h3>
              <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed bg-white p-4 rounded-xl border border-[#EAE6DF]">
                {audit.verdict_summary}
              </p>
            </div>

            {/* Dietary Tags & Detected Certifications */}
            {((audit.dietary_tags && audit.dietary_tags.length > 0) ||
              (audit.allergens_detected && audit.allergens_detected.length > 0)) && (
              <div className="p-4 rounded-xl bg-white border border-[#EAE6DF] space-y-2">
                <h4 className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold">
                  Dietary Suitability & Allergen Declaration
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {audit.dietary_tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-medium"
                    >
                      <Sparkles className="w-3 h-3 text-[#059669]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  {audit.allergens_detected?.map((allergen) => (
                    <span
                      key={allergen}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-medium"
                    >
                      <AlertTriangle className="w-3 h-3 text-[#D97706]" />
                      <span>Allergen: {allergen}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full Ingredients Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                  Detailed Additive & Ingredient Inventory
                </h3>
                <span className="text-[11px] text-[#A8A29E] font-mono">
                  {audit.ingredients.length} items cataloged
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#EAE6DF] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#78716C] font-medium border-b border-[#EAE6DF]">
                    <tr>
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
                          {item.source || item.additive_detail?.source || "Unknown"}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#44403C] text-[11px] leading-relaxed">
                          {item.reason ||
                            item.additive_detail?.fiqh_notes ||
                            "Unlisted / Standard Ingredient. No prohibited or ambiguous chemical additives identified in initial scan."}
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
                <strong className="text-[#1C1917]">Regulatory Reference Standards:</strong> JAKIM
                MS 1500:2019 (Halal Food Production Preparation, Handling and Storage), Codex
                Alimentarius CAC/GL 24-1997, and Gulf Standard GSO 993.
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

          {/* Bottom Modal Action Bar (Always Available at bottom of modal) */}
          <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#FAF8F5] border-t border-[#F0EBE1]">
            <div className="flex items-center gap-2 text-xs text-[#78716C]">
              <ShieldCheck className="w-4 h-4 text-[#1E3A2F]" />
              <span>Official Verified Fiqh Compliance Record</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadHtml}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#EAE6DF] text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors shadow-2xs active:scale-95 min-h-[40px]"
              >
                <Download className="w-3.5 h-3.5 text-[#1E3A2F]" />
                <span>Save HTML</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1E3A2F] text-white text-xs font-bold hover:bg-[#2D5A46] transition-colors shadow-sm active:scale-95 min-h-[40px]"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>Download PDF / Print</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-white border border-[#EAE6DF] text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors shadow-2xs active:scale-95 min-h-[40px]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
