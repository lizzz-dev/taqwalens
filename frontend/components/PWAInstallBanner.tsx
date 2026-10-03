"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { soundManager } from "../lib/soundEffects";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if dismissed recently
    const dismissed = localStorage.getItem("taqwalens_pwa_dismissed");
    if (dismissed && Date.now() - Number(dismissed) < 86400000) {
      return;
    }

    // Register Service Worker in browser
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Detect iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setIsVisible(true);
    }

    // Capture standard PWA install event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    soundManager.playClick();
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }

    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    soundManager.playClick();
    setIsVisible(false);
    localStorage.setItem("taqwalens_pwa_dismissed", String(Date.now()));
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="bg-[#1E3A2F] text-white border border-[#D4AF37]/50 rounded-2xl p-3 sm:px-4 sm:py-3 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs leading-tight">Install TaqwaLens</div>
              <div className="text-[10px] text-[#FAF8F5]/80">Use offline like a native camera app</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#1E3A2F] text-xs font-bold shadow-xs hover:bg-[#ebd06b] transition-all active:scale-95 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Modal instructions */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 border border-[#EAE6DF] shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#1C1917]">
                Install on iPhone / iPad
              </h4>
              <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
                Tap the <span className="font-bold text-[#1C1917]">Share</span> button in Safari, then select{" "}
                <span className="font-bold text-[#1E3A2F]">'Add to Home Screen'</span>.
              </p>
            </div>
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="w-full py-2.5 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
