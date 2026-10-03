"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, RefreshCw, AlertCircle, Sparkles, Image as ImageIcon, PackageCheck, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScannerProps {
  onScan: (file: File | Blob) => void;
  isLoading: boolean;
  statusText?: string;
}

export function Scanner({ onScan, isLoading, statusText }: ScannerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
    setSelectedFile(file);
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

  return (
    <div className="w-full rounded-2xl bg-white border border-[#EAE6DF] p-6 sm:p-7 space-y-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Scanner Header & Pill Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EBE1] pb-4">
        <div>
          <h2 className="font-serif font-bold text-lg text-[#1C1917] tracking-tight">
            Package Scanner
          </h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Capture or upload a clear photo of the ingredient statement
          </p>
        </div>

        {/* Clean Pill Tab Switcher */}
        <div className="inline-flex rounded-full bg-[#FAF8F5] border border-[#EAE6DF] p-1 text-xs">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium ${
              activeTab === "upload"
                ? "bg-[#1E3A2F] text-white shadow-xs"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Photo
          </button>
          <button
            onClick={() => setActiveTab("camera")}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium ${
              activeTab === "camera"
                ? "bg-[#1E3A2F] text-white shadow-xs"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Use Camera
          </button>
        </div>
      </div>

      {cameraError && (
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
          /* Warm Dashed Dropzone */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer p-8 sm:p-10 flex flex-col items-center justify-center text-center ${
              isDragOver
                ? "border-[#1E3A2F] bg-[#F0F5F2]"
                : "border-[#D6D0C4] bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] hover:border-[#1E3A2F]/50"
            }`}
          >
            {previewUrl ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="relative w-44 h-44 rounded-xl overflow-hidden border border-[#EAE6DF] shadow-sm bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Packaging preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#1E3A2F]/10 pointer-events-none" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#1C1917]">Photo Ready for Audit</p>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Click to choose another image</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 max-w-sm">
                <div className="w-13 h-13 mx-auto rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-[#1E3A2F] shadow-xs">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E3A2F] text-white text-xs font-medium hover:bg-[#2D5A46] transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Select Image File
                </button>
              </div>
            )}
          </div>
        ) : (
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
            <div className="absolute inset-8 border border-white/40 rounded-lg pointer-events-none flex items-center justify-center">
              <span className="text-white/80 text-xs font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                Align ingredient panel inside frame
              </span>
            </div>

            {/* Shutter Button */}
            <div className="absolute bottom-5 inset-x-0 flex justify-center">
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
        )}

        {/* Loading Overlay with Warm Ambient Light Sweep */}
        <AnimatePresence>
          {isLoading && (
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
