"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Scanner } from "../components/Scanner";
import { ProductLens3D } from "../components/3d/ProductLens3D";
import { VerdictCard } from "../components/VerdictCard";
import { IngredientGrid } from "../components/IngredientGrid";
import { InquiryDrawer } from "../components/InquiryDrawer";
import { Disclaimer } from "../components/Disclaimer";
import { HistoryDrawer } from "../components/HistoryDrawer";
import { PrintCertificateModal } from "../components/PrintCertificateModal";
import { QuickSearchModal } from "../components/QuickSearchModal";
import { AuthGateway } from "../components/AuthGateway";
import { DemoPresetsTray, DemoPreset } from "../components/DemoPresetsTray";
import { AskSheikhAI } from "../components/AskSheikhAI";
import { ProductComparisonModal } from "../components/ProductComparisonModal";
import { soundManager } from "../lib/soundEffects";
import { auditProductImage, auditProductBarcode, checkBackendHealth } from "../lib/api";
import { AuditResponse, HistoryItem, MadhhabProfile, UserProfile } from "../lib/types";
import { AlertCircle, X, ShieldCheck, ArrowRight, Sparkles, BookOpen, Clock, ShieldAlert, Award, Barcode, ArrowRightLeft } from "lucide-react";

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("Analyzing image...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [indexedCount, setIndexedCount] = useState<number>(372);

  // New Enterprise Features State
  const [selectedMadhhab, setSelectedMadhhab] = useState<MadhhabProfile>("standard");
  const [recentScans, setRecentScans] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // User Authentication & 3D Welcome Gateway State
  // ROLLBACK TOGGLE: set ENABLE_AUTH_GATEWAY = false to bypass the gateway anytime
  const ENABLE_AUTH_GATEWAY = true;
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthGatewayOpen, setIsAuthGatewayOpen] = useState<boolean>(true);

  // Check saved session and synchronize browser history (Back / Forward arrow support)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("taqwalens_auth_user");
      const hash = window.location.hash;

      if (savedUser) {
        const parsed = JSON.parse(savedUser) as UserProfile;
        setCurrentUser(parsed);
        if (parsed.madhhab) {
          setSelectedMadhhab(parsed.madhhab);
        }
      }

      if (hash === "#gateway") {
        setIsAuthGatewayOpen(true);
      } else if (hash === "#studio") {
        setIsAuthGatewayOpen(false);
      } else if (savedUser) {
        setIsAuthGatewayOpen(false);
        window.history.replaceState({ screen: "studio" }, "", "#studio");
      } else {
        setIsAuthGatewayOpen(true);
        window.history.replaceState({ screen: "gateway" }, "", "#gateway");
      }
    } catch (err) {
      console.warn("Could not initialize session/history:", err);
    }

    // Global listener for browser Back (←) and Forward (→) buttons
    const handlePopState = (e: PopStateEvent) => {
      const hash = window.location.hash;
      const screen = e.state?.screen;

      if (hash === "#gateway" || screen === "gateway") {
        setIsAuthGatewayOpen(true);
        setIsCertificateOpen(false);
        setIsHistoryOpen(false);
        setIsSearchOpen(false);
      } else if (hash === "#certificate" || screen === "certificate") {
        setIsCertificateOpen(true);
      } else if (hash === "#history" || screen === "history") {
        setIsHistoryOpen(true);
      } else if (hash === "#search" || screen === "search") {
        setIsSearchOpen(true);
      } else {
        // Back to Studio
        setIsAuthGatewayOpen(false);
        setIsCertificateOpen(false);
        setIsHistoryOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleAuthenticate = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.madhhab) {
      setSelectedMadhhab(user.madhhab);
    }
    try {
      localStorage.setItem("taqwalens_auth_user", JSON.stringify(user));
    } catch (err) {
      console.warn("Could not persist user session:", err);
    }
    window.history.pushState({ screen: "studio" }, "", "#studio");
    setIsAuthGatewayOpen(false);
  };

  const handleOpenAuthGateway = () => {
    window.history.pushState({ screen: "gateway" }, "", "#gateway");
    setIsAuthGatewayOpen(true);
  };

  const handleContinueAsGuest = () => {
    const guestUser: UserProfile = {
      name: "Guest Evaluator",
      email: "guest.auditor@taqwalens.org",
      madhhab: "standard",
      dietaryPreferences: [],
      role: "guest",
      avatarInitials: "⚡",
      createdAt: Date.now(),
    };
    handleAuthenticate(guestUser);
  };

  const handleOpenCertificateInNewTab = (audit?: AuditResponse | null) => {
    const targetAudit = audit || auditResult;
    if (!targetAudit) return;
    try {
      localStorage.setItem("taqwalens_current_dossier", JSON.stringify(targetAudit));
    } catch (err) {
      console.warn("Could not persist current dossier:", err);
    }
    window.open("/certificate", "_blank");
  };

  // Load scan history from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("taqwalens_recent_scans");
      if (stored) {
        setRecentScans(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Could not read recent scans from localStorage:", err);
    }
  }, []);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth()
      .then((data) => {
        setIsBackendHealthy(data.status === "healthy");
        if (data.total_additives_indexed) {
          setIndexedCount(data.total_additives_indexed);
        }
      })
      .catch((err) => {
        console.warn("Backend health check failed:", err);
        setIsBackendHealthy(false);
      });
  }, []);

  // Helper to persist audits into browser history
  const persistAuditToHistory = (
    audit: AuditResponse,
    inputType: "image" | "barcode" | "preset",
    barcode?: string
  ) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      audit,
      inputType,
      barcode,
    };

    setRecentScans((prev) => {
      // Deduplicate by product name
      const filtered = prev.filter((item) => item.audit.product_name !== audit.product_name);
      const updated = [newItem, ...filtered].slice(0, 25);
      try {
        localStorage.setItem("taqwalens_recent_scans", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not persist recent scans to localStorage:", err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setRecentScans([]);
    try {
      localStorage.removeItem("taqwalens_recent_scans");
    } catch (err) {
      console.warn("Failed to clear localStorage history:", err);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setRecentScans((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("taqwalens_recent_scans", JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to update localStorage history:", err);
      }
      return updated;
    });
  };

  const handleScan = async (file: File | Blob) => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatusText("Preparing image for optical analysis...");

    try {
      setTimeout(() => {
        setStatusText("Reading packaging ingredient declaration...");
      }, 500);

      setTimeout(() => {
        setStatusText("Cross-matching additives against certified Fiqh database...");
      }, 1200);

      const result = await auditProductImage(file, "package.jpg", selectedMadhhab);
      setAuditResult(result);
      persistAuditToHistory(result, "image");

      if (result.overall_verdict === "HALAL") {
        soundManager.playHalalChime();
      } else if (result.overall_verdict === "MUSHBOOH") {
        soundManager.playMushboohTone();
      } else if (result.overall_verdict === "HARAM") {
        soundManager.playHaramTone();
      }

      // Scroll smoothly down to findings
      setTimeout(() => {
        const findingsEl = document.getElementById("audit-findings");
        if (findingsEl) {
          findingsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected audit error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatusText(`Querying global food registry for barcode ${barcode}...`);

    try {
      setTimeout(() => {
        setStatusText("Resolving ingredient declaration and additive codes...");
      }, 600);

      setTimeout(() => {
        setStatusText(`Executing Fiqh evaluation under ${selectedMadhhab} profile...`);
      }, 1200);

      const result = await auditProductBarcode(barcode, selectedMadhhab);
      setAuditResult(result);
      persistAuditToHistory(result, "barcode", barcode);

      if (result.overall_verdict === "HALAL") {
        soundManager.playHalalChime();
      } else if (result.overall_verdict === "MUSHBOOH") {
        soundManager.playMushboohTone();
      } else if (result.overall_verdict === "HARAM") {
        soundManager.playHaramTone();
      }

      setTimeout(() => {
        const findingsEl = document.getElementById("audit-findings");
        if (findingsEl) {
          findingsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Barcode audit failed.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoPreset = async (preset: DemoPreset) => {
    setSelectedPresetId(preset.id);
    setIsLoading(true);
    setAuditResult(null);
    setErrorMessage(null);
    setStatusText(`Auditing sample ${preset.name}...`);

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 520;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#FAF8F5";
      ctx.fillRect(0, 0, 800, 520);

      ctx.strokeStyle = "#EAE6DF";
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 780, 500);

      ctx.fillStyle = "#1E3A2F";
      ctx.font = "bold 28px serif";
      ctx.fillText(preset.name.toUpperCase(), 40, 65);

      ctx.fillStyle = "#78716C";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Brand: ${preset.brand} • Category: ${preset.category}`, 40, 95);

      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("INGREDIENTS DECLARATION:", 40, 140);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#292524";

      const words = preset.ingredientsText.split(" ");
      let line = "";
      let y = 170;
      for (const word of words) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 700) {
          ctx.fillText(line, 40, y);
          line = word + " ";
          y += 24;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 40, y);

      if (preset.verdictType === "HALAL") {
        ctx.fillStyle = "#059669";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("CERTIFIED HALAL • JAKIM / MUI ACCREDITED", 40, 480);
      }
    }

    canvas.toBlob(
      async (blob) => {
        if (blob) {
          await handleScan(blob);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  // Demo presets: Render genuine, high-contrast packaging labels onto canvas
  // and dispatch real image streams to /api/audit to exercise full optical OCR and validation pipeline.
  const handleLoadDemoPreset = async (presetType: "mushbooh" | "haram" | "halal" | "invalid") => {
    setIsLoading(true);
    setAuditResult(null);
    setErrorMessage(null);
    setStatusText(`Loading sample for ${presetType.toUpperCase()} test case...`);

    const canvas = document.createElement("canvas");
    canvas.width = 750;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      if (presetType === "invalid") {
        // Non-food scene: Living room interior with furniture and shoes
        ctx.fillStyle = "#FAF8F5";
        ctx.fillRect(0, 0, 750, 500);

        ctx.fillStyle = "#EAE6DF";
        ctx.fillRect(60, 140, 260, 220); // Sofa outline
        ctx.fillRect(360, 200, 320, 160); // Table outline

        ctx.fillStyle = "#78716C";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("NON-FOOD SCENE: LIVING ROOM INTERIOR", 60, 80);
        ctx.font = "16px sans-serif";
        ctx.fillText("Modern Interior Furniture, Running Shoes & Houseplants", 60, 115);
        ctx.fillText("No food packaging panel, nutrition facts, or E-codes present in this image.", 60, 440);
      } else {
        // High-contrast clean white food packaging card
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 750, 500);

        // Outer crisp packaging border
        ctx.strokeStyle = "#EAE6DF";
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, 718, 468);

        // Branded header banner
        const bannerColor = presetType === "halal" ? "#1E3A2F" : presetType === "haram" ? "#881337" : "#292524";
        ctx.fillStyle = bannerColor;
        ctx.fillRect(20, 20, 710, 80);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 26px serif";
        const title = presetType === "halal"
          ? "LOTUS HARVEST IMPORTED NOODLES"
          : presetType === "haram"
          ? "BERRYBITES CHEWY STRAWBERRY GUMMIES"
          : "BRITISH SHORTBREAD BISCUITS";
        ctx.fillText(title, 40, 68);

        // Nutrition & Ingredients Panel
        ctx.fillStyle = "#1C1917";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("INGREDIENTS / INGRÉDIENTS:", 40, 140);

        ctx.fillStyle = "#44403C";
        ctx.font = "17px sans-serif";

        if (presetType === "mushbooh") {
          ctx.fillText("Wheat Flour, Vegetable Fat (Palm Fruit), Cane Sugar, Cocoa Butter,", 40, 180);
          ctx.fillText("Emulsifier: Mono- and Diglycerides of Fatty Acids (E471),", 40, 215);
          ctx.fillText("Skimmed Milk Powder, Whey Permeate, Salt, Vanillin Flavoring.", 40, 250);
          ctx.font = "italic 14px sans-serif";
          ctx.fillStyle = "#78716C";
          ctx.fillText("Allergen advice: Contains Wheat, Milk. Sourced in the United Kingdom.", 40, 310);
        } else if (presetType === "haram") {
          ctx.fillText("Glucose Syrup, Sugar, Porcine Gelatin, Water,", 40, 180);
          ctx.fillText("Acidity Regulator (Citric Acid E330), Natural Strawberry Extract,", 40, 215);
          ctx.fillText("Color: Carmine (E120), Glazing Agent (Carnauba Wax E903).", 40, 250);
          ctx.font = "italic 14px sans-serif";
          ctx.fillStyle = "#78716C";
          ctx.fillText("Storage: Store in a cool, dry place away from direct sunlight.", 40, 310);
        } else {
          ctx.fillText("Wheat Flour, Filtered Water, Palm Oil, Tapioca Starch, Salt,", 40, 180);
          ctx.fillText("Vegetable Broth Seasoning (Onion, Garlic), Sesame Oil,", 40, 215);
          ctx.fillText("Raising Agent: Sodium Bicarbonate (E500), Guar Gum.", 40, 250);

          // Halal Certification Stamp
          ctx.fillStyle = "#1E3A2F";
          ctx.fillRect(40, 290, 320, 36);
          ctx.fillStyle = "#ECFDF5";
          ctx.font = "bold 14px sans-serif";
          ctx.fillText("JAKIM HALAL CERTIFIED • MS 1500:2019", 55, 314);
        }

        // Barcode simulation
        ctx.fillStyle = "#1C1917";
        for (let i = 0; i < 40; i++) {
          const w = (i % 3 === 0) ? 4 : 2;
          ctx.fillRect(520 + i * 4, 380, w, 50);
        }
        ctx.font = "12px monospace";
        ctx.fillText("5 012345 678901", 525, 445);
      }
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsLoading(false);
        return;
      }
      try {
        setStatusText("Reading packaging label...");
        const result = await auditProductImage(blob, `${presetType}_sample.jpg`, selectedMadhhab);
        setAuditResult(result);
        persistAuditToHistory(result, "preset");
        setTimeout(() => {
          const findingsEl = document.getElementById("audit-findings");
          if (findingsEl) {
            findingsEl.scrollIntoView({ behavior: "smooth" });
          }
        }, 200);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to run audit preset.";
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    }, "image/jpeg", 0.92);
  };

  // Render Award-Winning 3D Auth & Onboarding Gateway as First Page
  if (ENABLE_AUTH_GATEWAY && isAuthGatewayOpen) {
    return (
      <AuthGateway
        onAuthenticate={handleAuthenticate}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#1C1917] flex flex-col relative overflow-x-hidden">
      {/* Editorial Navbar with Madhhab Profile Selector & History Drawer Trigger */}
      <Navbar
        isBackendHealthy={isBackendHealthy}
        indexedCount={indexedCount}
        historyCount={recentScans.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        selectedMadhhab={selectedMadhhab}
        onChangeMadhhab={(m) => setSelectedMadhhab(m)}
        currentUser={currentUser}
        onOpenAuthGateway={handleOpenAuthGateway}
      />

      <main className="relative z-10 flex-1 w-full space-y-8 sm:space-y-12">
        {/* Error Notification Toast */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-6 pt-4">
            <div className="p-4 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] text-[#991B1B] text-xs flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#B91C1C] shrink-0" />
                <span className="font-medium text-sm leading-normal">{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-[#B91C1C] hover:text-[#7F1D1D] p-1 rounded-full hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* WARM DUAL-PANEL PRODUCT STUDIO                                */}
        {/* ------------------------------------------------------------- */}
        <section className="pt-6 pb-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT PANEL: Editorial Typography + Scanner Bay + Test Presets (Cols 1-6) */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Mindful Badge */}
            <div className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Certified Islamic Dietary Standards</span>
            </div>

            {/* Studio Header Typography */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-normal text-slate-900 leading-[1.15] tracking-tight">
                Scan Ingredients. <br />
                Verify Sourcing. <br />
                <span className="text-[#1E3A2F]">Eat with Certainty.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mt-4 mb-8">
                Photograph any snack, beverage, or grocery label—or look up barcodes directly—to instantly detect hidden animal derivatives, E-codes, allergens, and verified Halal standards.
              </p>
            </div>

            {/* Inviting Package Scanner Card with Image & Barcode support */}
            <div className="mt-8 space-y-6 w-full">
              <Scanner
                onScan={handleScan}
                onBarcodeScan={handleBarcodeScan}
                isLoading={isLoading}
                statusText={statusText}
              />

              {/* 1-Click Interactive Test Lab Presets Tray */}
              <DemoPresetsTray
                onSelectPreset={handleSelectDemoPreset}
                selectedPresetId={selectedPresetId}
              />
            </div>
          </div>

          {/* RIGHT PANEL: Interactive 3D Packaging & Magnifying TaqwaLens (Cols 7-12) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <ProductLens3D />
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* AUDIT FINDINGS DOSSIER (Visible after audit completion)        */}
        {/* ------------------------------------------------------------- */}
        {auditResult && (
          <section id="audit-findings" className="max-w-7xl mx-auto px-6 space-y-8 pt-8 sm:pt-10 border-t border-[#EAE6DF] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#1C1917]">
                  Compliance Audit Dossier
                </h3>
                <p className="text-xs text-[#78716C]">
                  Optical evaluation and juristic additive matching completed under {auditResult.madhhab_profile || selectedMadhhab} school.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenCertificateInNewTab(auditResult)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E3A2F] text-white text-xs font-medium hover:bg-[#2D5A46] transition-colors shadow-2xs active:scale-95 min-h-[38px]"
                  title="Open official compliance certificate in a separate browser tab"
                >
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>View Certificate Dossier ↗</span>
                </button>

                <button
                  onClick={() => {
                    setAuditResult(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-medium text-[#78716C] hover:text-[#1C1917] px-3.5 py-1.5 rounded-full bg-white border border-[#EAE6DF] shadow-2xs transition-colors min-h-[38px]"
                >
                  Scan Another Item
                </button>
              </div>
            </div>

            {/* High-Impact 3D Tilt Verdict Card */}
            <VerdictCard
              audit={auditResult}
              onOpenCertificate={() => handleOpenCertificateInNewTab(auditResult)}
            />

            {/* 1-Click Brand Inquiry Drawer (Mushbooh items) */}
            {(auditResult.overall_verdict === "MUSHBOOH" || auditResult.flagged_items.length > 0) && (
              <InquiryDrawer audit={auditResult} />
            )}

            {/* Ask Sheikh AI Interactive Juristic Assistant */}
            <AskSheikhAI
              productName={auditResult.product_name || "Food Item"}
              verdict={auditResult.overall_verdict}
              additives={auditResult.flagged_items.map((item) => ({
                code: item.additive_detail?.code || item.name,
                name: item.name,
                halal_status: item.status,
              }))}
              madhhab={selectedMadhhab}
            />

            {/* Detailed Ingredient Breakdown Grid */}
            <IngredientGrid ingredients={auditResult.ingredients} />
          </section>
        )}

        {/* Authoritative Educational Notice */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <Disclaimer />
        </div>
      </main>

      {/* Slide-over / Bottom-sheet Recent Scans History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={recentScans}
        onSelectAudit={(audit) => {
          setAuditResult(audit);
          setTimeout(() => {
            const findingsEl = document.getElementById("audit-findings");
            if (findingsEl) {
              findingsEl.scrollIntoView({ behavior: "smooth" });
            }
          }, 200);
        }}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* Exportable PDF / Print Compliance Certificate Modal */}
      {auditResult && (
        <PrintCertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          audit={auditResult}
        />
      )}

      {/* Instant E-Code & Additive Quick Search Encyclopedia Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Side-by-Side Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentAuditResult={auditResult}
      />
    </div>
  );
}
