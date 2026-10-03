"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, RefreshCw, AlertCircle, Sparkles, Barcode, ArrowRight, PackageCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { soundManager } from "../lib/soundEffects";

interface ScannerProps {
  onScan: (file: File | Blob) => void;
  onBarcodeScan?: (barcode: string) => void;
  isLoading: boolean;
  statusText?: string;
  externalPreviewUrl?: string | null;
  onClearPreview?: () => void;
}

export function Scanner({
  onScan,
  onBarcodeScan,
  isLoading,
  statusText,
  externalPreviewUrl,
  onClearPreview,
}: ScannerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "camera" | "barcode">("upload");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(externalPreviewUrl || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  // Sync externalPreviewUrl if provided
  useEffect(() => {
    if (externalPreviewUrl !== undefined) {
      setPreviewUrl(externalPreviewUrl);
      if (externalPreviewUrl) {
        setActiveTab("upload");
      }
    }
  }, [externalPreviewUrl]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or teardown camera stream based on active tab
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (activeTab === "camera") {
      navigator.mediaDevices
        ?.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        .then((s) => {
          stream = s;
          setCameraStream(s);
          setCameraError(null);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Camera access denied or unavailable:", err);
          setCameraError("Camera permission was not granted. Please use photo upload instead.");
          setActiveTab("upload");
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeTab]);

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    soundManager.playShutter();
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          onScan(blob);
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid packaging image (JPEG, PNG, or WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB. Please select a smaller photo.");
      return;
    }
    soundManager.playClick();
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onScan(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundManager.playClick();
    setBarcodeError(null);
    const clean = barcodeInput.trim().replace(/[-\s]/g, "");
    if (!clean) {
      setBarcodeError("Please enter a numeric UPC or EAN barcode.");
      return;
    }
    if (!/^\d{6,14}$/.test(clean)) {
      setBarcodeError("Barcode must contain between 6 and 14 digits.");
      return;
    }
    if (onBarcodeScan) {
      onBarcodeScan(clean);
    }
  };

  const handleSelectSampleBarcode = (code: string) => {
    setBarcodeInput(code);
    setBarcodeError(null);
    if (onBarcodeScan) {
      onBarcodeScan(code);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white border border-[#EAE6DF] p-4 sm:p-7 space-y-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Scanner Header */}
      <div className="border-b border-[#F0EBE1] pb-3">
        <h2 className="font-serif font-bold text-xl text-[#1C1917] tracking-tight">
          Package & Barcode Scanner
        </h2>
        <p className="text-xs text-[#78716C] mt-0.5">
          {activeTab === "upload"
            ? "Upload a clear photo of product packaging or ingredient list"
            : activeTab === "camera"
            ? "Point your camera directly at the ingredient panel or nutrition box"
            : "Lookup products directly via international UPC/EAN food registry"}
        </p>
      </div>

      {/* Prominent Full-Width Segmented Tab Switcher (No Horizontal Scrollbar, 100% Visible) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`w-full py-2 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold min-h-[42px] ${
            activeTab === "upload"
              ? "bg-[#1E3A2F] text-white shadow-xs"
              : "text-[#57534E] hover:text-[#1C1917] hover:bg-white"
          }`}
        >
          <Upload className="w-4 h-4 shrink-0" />
          <span className="truncate">Photo Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("camera")}
          className={`w-full py-2 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold min-h-[42px] ${
            activeTab === "camera"
              ? "bg-[#1E3A2F] text-white shadow-xs"
              : "text-[#57534E] hover:text-[#1C1917] hover:bg-white"
          }`}
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span className="truncate">Live Camera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("barcode")}
          className={`w-full py-2 px-2 sm:px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold min-h-[42px] ${
            activeTab === "barcode"
              ? "bg-[#1E3A2F] text-white shadow-xs"
              : "text-[#57534E] hover:text-[#1C1917] hover:bg-white"
          }`}
        >
          <Barcode className="w-4 h-4 shrink-0" />
          <span className="truncate">Barcode / UPC</span>
        </button>
      </div>

      {cameraError && activeTab === "camera" && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FCF7ED] border border-[#F5DEB3] text-[#B45309] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C28E38]" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Interactive Scanning Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />

        {activeTab === "upload" ? (
          previewUrl ? (
            /* High-Tech Optical Inspection Bay with Active Laser Scanline */
            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md min-h-[260px] sm:min-h-[300px] flex items-center justify-center group select-none">
              {/* Subtle ambient grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Packaging Image Under Audit */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Product packaging under optical audit"
                className="w-full h-full max-h-[320px] object-contain p-3 select-none"
              />

              {/* Holographic Reticle HUD Brackets */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400 pointer-events-none shadow-[0_0_10px_#10B981]" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400 pointer-events-none shadow-[0_0_10px_#10B981]" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400 pointer-events-none shadow-[0_0_10px_#10B981]" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400 pointer-events-none shadow-[0_0_10px_#10B981]" />

              {/* Top HUD Telemetry Info */}
              <div className="absolute top-3 inset-x-3.5 flex items-center justify-between pointer-events-none text-[11px] font-mono z-20">
                <span className="bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  OPTICAL OCR ACTIVE
                </span>
                <span className="bg-slate-950/85 backdrop-blur-md border border-slate-700 text-slate-300 px-2.5 py-1 rounded-md shadow-sm">
                  TAQWALENS ENGINE
                </span>
              </div>

              {/* Active Laser Scanline Animation (when isLoading is true) */}
              {isLoading && (
                <>
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#10B981,0_0_32px_#10B981] z-20 pointer-events-none"
                    initial={{ top: "4%" }}
                    animate={{ top: ["4%", "94%", "4%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-x-12 -top-3 h-7 bg-emerald-400/25 blur-md pointer-events-none" />
                  </motion.div>

                  <div className="absolute inset-0 bg-emerald-500/[0.04] pointer-events-none" />

                  {/* High-Tech Telemetry Status HUD */}
                  <div className="absolute bottom-3 inset-x-3.5 z-20 flex items-center justify-between gap-2 bg-slate-950/90 backdrop-blur-md border border-emerald-500/50 px-3.5 py-2 rounded-xl text-white shadow-xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block tracking-wider">
                          PROCESSING TELEMETRY
                        </span>
                        <span className="text-xs text-slate-100 font-medium block truncate">
                          {statusText || "Cross-matching additives against certified Fiqh database..."}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold shrink-0">
                      LIVE AUDIT
                    </span>
                  </div>
                </>
              )}

              {/* Idle Controls (when !isLoading) */}
              {!isLoading && (
                <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-black/95 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                  {onClearPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        onClearPreview();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/20 text-slate-300 text-xs font-medium hover:text-white hover:bg-black/95 transition-all shadow-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Warm Dashed Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer p-6 sm:p-10 flex flex-col items-center justify-center text-center ${
                isDragOver
                  ? "border-[#1E3A2F] bg-[#F0F5F2]"
                  : "border-[#D6D0C4] bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] hover:border-[#1E3A2F]/50"
              }`}
            >
              <div className="space-y-3.5 max-w-sm">
                <div className="w-12 h-12 sm:w-13 sm:h-13 mx-auto rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-[#1E3A2F] shadow-xs">
                  <PackageCheck className="w-6 h-6 text-[#2D5A46]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1917]">
                    Drag & drop your packaging photo here, or snap a picture
                  </p>
                  <p className="text-xs text-[#78716C] mt-1 leading-normal">
                    Supports packaging labels, ingredient lists, and nutrition boxes (JPEG, PNG, WEBP)
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E3A2F] text-white text-xs font-medium hover:bg-[#2D5A46] transition-colors shadow-xs min-h-[44px]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Select Image File
                </button>
              </div>
            </div>
          )
        ) : activeTab === "camera" ? (
          /* Live Camera Viewfinder */
          <div className="relative w-full rounded-xl overflow-hidden bg-[#1C1917] aspect-video flex items-center justify-center border border-[#EAE6DF]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Frame Focus Guides */}
            <div className="absolute inset-6 sm:inset-8 border border-white/40 rounded-lg pointer-events-none flex items-center justify-center">
              <span className="text-white/80 text-[11px] sm:text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                Align ingredient panel inside frame
              </span>
            </div>

            {/* Shutter Button */}
            <div className="absolute bottom-4 sm:bottom-5 inset-x-0 flex justify-center">
              <button
                type="button"
                onClick={handleCaptureFrame}
                className="w-14 h-14 rounded-full bg-white border-4 border-white/50 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-[#1E3A2F]"
                title="Capture Photo"
              >
                <Camera className="w-6 h-6 text-[#1E3A2F]" />
              </button>
            </div>
          </div>
        ) : (
          /* Animated Holographic Barcode Scanner Viewport */
          <div className="space-y-4">
            <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#1C1917] to-[#121110] p-6 text-white border border-[#2D2A26] flex flex-col items-center justify-center min-h-[200px]">
              {/* Animated 3D Holographic Laser Sweep */}
              <div className="absolute inset-x-8 top-0 bottom-0 pointer-events-none overflow-hidden">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_12px_#22C55E] animate-[bounce_2.5s_infinite_ease-in-out]" />
              </div>

              {/* Barcode Hologram Visual */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5 opacity-80">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/80 rounded-xs"
                      style={{
                        width: i % 4 === 0 ? "4px" : i % 3 === 0 ? "2.5px" : "1.5px",
                        height: i % 5 === 0 ? "44px" : "36px",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono tracking-widest text-emerald-400/90 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  OPTICAL BARCODE REGISTRY
                </span>
              </div>

              {/* Scanner Reticle Corners */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-500/70" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-500/70" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-500/70" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-500/70" />
            </div>

            {/* Barcode Input Form */}
            <form onSubmit={handleBarcodeSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Enter 8 to 13-digit barcode (e.g. 5410126006957)..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D6D0C4] bg-[#FAF8F5] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A2F] focus:ring-2 focus:ring-[#1E3A2F]/10 min-h-[44px]"
                  />
                  {barcodeInput && (
                    <button
                      type="button"
                      onClick={() => setBarcodeInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#1C1917]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !barcodeInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#1E3A2F] text-white text-xs font-semibold hover:bg-[#2D5A46] transition-all flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] active:scale-95"
                >
                  <Barcode className="w-4 h-4" />
                  <span>Audit Barcode</span>
                </button>
              </div>

              {barcodeError && (
                <p className="text-xs text-[#991B1B] font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{barcodeError}</span>
                </p>
              )}

              {/* Instant Test Barcodes */}
              <div className="pt-2 border-t border-[#F0EBE1] space-y-2">
                <span className="text-[11px] text-[#78716C] font-medium block">
                  Quick-test global grocery barcodes:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectSampleBarcode("5410126006957")}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F2EB] hover:border-[#1E3A2F]/40 transition-all font-mono text-[11px] flex items-center gap-1"
                  >
                    <span>Lotus Biscoff</span>
                    <span className="text-[#78716C]">(5410126006957)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSampleBarcode("8000500179864")}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F2EB] hover:border-[#1E3A2F]/40 transition-all font-mono text-[11px] flex items-center gap-1"
                  >
                    <span>Nutella Hazelnut</span>
                    <span className="text-[#78716C]">(8000500179864)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSampleBarcode("7622210449283")}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F2EB] hover:border-[#1E3A2F]/40 transition-all font-mono text-[11px] flex items-center gap-1"
                  >
                    <span>Oreo Cookies</span>
                    <span className="text-[#78716C]">(7622210449283)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Fallback Loading Overlay (only when no preview image is active) */}
        <AnimatePresence>
          {isLoading && !previewUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20 border border-[#EAE6DF]"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#1E3A2F] animate-spin" />
                <span className="absolute w-12 h-12 rounded-full bg-[#1E3A2F]/10 animate-ping" />
              </div>
              <div className="text-center space-y-1 px-4">
                <h4 className="text-sm font-serif font-bold text-[#1C1917]">
                  Auditing Ingredient Compliance
                </h4>
                <p className="text-xs text-[#78716C]">
                  {statusText || "Verifying additives against authentic standards..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
