"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthCard3D } from "./3d/AuthCard3D";
import { Logo3D } from "./3d/Logo3D";
import { MadhhabProfile, UserProfile } from "../lib/types";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Scale,
  ArrowRight,
  Shield,
  Layers,
  Barcode,
  Award,
} from "lucide-react";

interface AuthGatewayProps {
  onAuthenticate: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
}

// 1-Click Demo Personas for Judges & Evaluators
const DEMO_PERSONAS: Array<{
  name: string;
  role: string;
  madhhab: MadhhabProfile;
  dietaryPreferences: string[];
  avatar: string;
  description: string;
}> = [
  {
    name: "Ahmed Al-Mansoor",
    role: "Hanafi Juristic Scholar",
    madhhab: "hanafi",
    dietaryPreferences: ["No Carmine (E120)", "No Shellfish/Marine"],
    avatar: "AM",
    description: "Strict Hanafi fiqh checking against insect derivatives (carmine) and non-fish marine life.",
  },
  {
    name: "Sarah Jenkins",
    role: "Plant-Based Halal Auditor",
    madhhab: "standard",
    dietaryPreferences: ["Vegan / Plant-Based", "No Animal Gelatin", "Alcohol-Free"],
    avatar: "SJ",
    description: "Multi-layered dietary filter combining universal Halal standards with vegan verification.",
  },
  {
    name: "Dr. Tariq Zaid",
    role: "Master Halal Auditor",
    madhhab: "strict",
    dietaryPreferences: ["Precautionary (Wara')", "No Dubious Emulsifiers", "Kosher Cross-Check"],
    avatar: "TZ",
    description: "Highest stringency level applying the precautionary principle (Wara') on all doubtful E-numbers.",
  },
];

const DIETARY_OPTIONS = [
  { id: "carmine", label: "No Carmine (E120)", icon: "🐞" },
  { id: "gelatin", label: "No Pork/Animal Gelatin", icon: "🚫" },
  { id: "alcohol", label: "Zero Alcohol / Ethanol", icon: "🍷" },
  { id: "vegan", label: "Vegan / Plant-Based", icon: "🌱" },
  { id: "gluten", label: "Gluten Conscious", icon: "🌾" },
];

export function AuthGateway({ onAuthenticate, onContinueAsGuest }: AuthGatewayProps) {
  const [activeTab, setActiveTab] = useState<"instant" | "signin" | "signup">("instant");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up / Onboarding State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMadhhab, setSignupMadhhab] = useState<MadhhabProfile>("standard");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([
    "No Carmine (E120)",
    "No Pork/Animal Gelatin",
  ]);

  // Celebratory Launching State
  const [launchingUser, setLaunchingUser] = useState<UserProfile | null>(null);

  // Dynamic values reflected in the live 3D card
  const previewName =
    activeTab === "signup" && signupName.trim()
      ? signupName
      : activeTab === "signin" && signInEmail
      ? signInEmail.split("@")[0]
      : "Guest Evaluator";

  const previewRole =
    activeTab === "signup"
      ? "Halal Food Auditor"
      : activeTab === "signin"
      ? "Registered Auditor"
      : "Hackathon Judge Pass";

  const previewMadhhab = activeTab === "signup" ? signupMadhhab : "standard";

  // Toggle dietary chips
  const toggleDietaryOption = (label: string) => {
    setSelectedDietary((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  // Launch with user
  const handleLaunch = (user: UserProfile) => {
    setLaunchingUser(user);
    setTimeout(() => {
      onAuthenticate(user);
    }, 1100);
  };

  // 1-Click Persona Login
  const handleSelectPersona = (persona: (typeof DEMO_PERSONAS)[0]) => {
    const user: UserProfile = {
      name: persona.name,
      email: `${persona.name.toLowerCase().replace(/\s+/g, ".")}@taqwalens.org`,
      madhhab: persona.madhhab,
      dietaryPreferences: persona.dietaryPreferences,
      role: "scholar",
      avatarInitials: persona.avatar,
      createdAt: Date.now(),
    };
    handleLaunch(user);
  };

  // Form Submit: Sign In
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = signInEmail.split("@")[0] || "Auditor";
    const user: UserProfile = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: signInEmail || "auditor@taqwalens.org",
      madhhab: "standard",
      dietaryPreferences: ["No Carmine (E120)"],
      role: "auditor",
      avatarInitials: name.slice(0, 2).toUpperCase() || "TL",
      createdAt: Date.now(),
    };
    handleLaunch(user);
  };

  // Form Submit: Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = signupName.trim() || "Halal Auditor";
    const initials =
      finalName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "HA";

    const user: UserProfile = {
      name: finalName,
      email: signupEmail || "auditor@taqwalens.org",
      madhhab: signupMadhhab,
      dietaryPreferences: selectedDietary,
      role: "consumer",
      avatarInitials: initials,
      createdAt: Date.now(),
    };
    handleLaunch(user);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between overflow-x-hidden selection:bg-[#E2ECE6] selection:text-[#1E3A2F]">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#D4AF37]/10 via-[#1E3A2F]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#1E3A2F]/10 via-[#10b981]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header Bar */}
      <header className="w-full border-b border-[#EAE6DF] bg-[#FAF8F5]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3.5">
            <Logo3D className="w-11 h-11 sm:w-12 sm:h-12" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl sm:text-3xl tracking-[0.025em] text-[#1C1917] leading-none">
                TaqwaLens
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#78716C] tracking-[0.08em] uppercase font-medium mt-1">
                Mindful Food & Ingredient Auditor
              </span>
            </div>
          </div>

          {/* Quick 1-Click Bypass Button for Judges */}
          <div className="flex items-center gap-3">
            <button
              onClick={onContinueAsGuest}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D4AF37] text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] hover:border-[#1E3A2F] shadow-sm transition-all active:scale-95 min-h-[40px]"
              title="Skip authentication and jump straight to the live Scanner Studio"
            >
              <Zap className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="hidden sm:inline">Instant Judge Pass</span>
              <span className="sm:hidden">Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1E3A2F]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Gateway Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive 3D Holographic Stage */}
          <div className="lg:col-span-6 flex flex-col items-center text-center lg:text-left order-2 lg:order-1">
            {/* Editorial Introduction */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A2F]/10 border border-[#1E3A2F]/20 text-[#1E3A2F] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Next-Gen AI Halal Verification Gateway</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1917] leading-[1.15] mb-4">
              Step Into the Future of{" "}
              <span className="text-[#1E3A2F] italic">Halal Intelligence</span>
            </h1>

            <p className="text-sm sm:text-base text-[#57534E] max-w-lg mb-6 leading-relaxed">
              Experience zero-hallucination ingredient audits, multi-madhhab juristic rulings, and
              instant barcode lookups powered by our vision models and cryptographic fiqh engine.
            </p>

            {/* Interactive 3D Credential Card Canvas */}
            <div className="w-full max-w-[480px] relative my-2">
              <AuthCard3D
                userName={previewName}
                userRole={previewRole}
                madhhab={previewMadhhab}
                className="w-full h-[360px] sm:h-[420px]"
              />
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-4 text-left">
              <div className="p-3 rounded-2xl bg-white/80 border border-[#EAE6DF] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#1E3A2F] mb-1.5" />
                <h4 className="text-xs font-bold text-[#1C1917]">Zero Hallucination</h4>
                <p className="text-[10px] text-[#78716C] mt-0.5">Strict database cross-validation</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 border border-[#EAE6DF] shadow-2xs">
                <Scale className="w-4 h-4 text-[#D4AF37] mb-1.5" />
                <h4 className="text-xs font-bold text-[#1C1917]">4 Juristic Schools</h4>
                <p className="text-[10px] text-[#78716C] mt-0.5">Hanafi, Shafi'i & Wara'</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 border border-[#EAE6DF] shadow-2xs">
                <Barcode className="w-4 h-4 text-[#1E3A2F] mb-1.5" />
                <h4 className="text-xs font-bold text-[#1C1917]">Global Barcodes</h4>
                <p className="text-[10px] text-[#78716C] mt-0.5">Over 3M+ packaged items</p>
              </div>
            </div>
          </div>

          {/* Right Column: Popping Auth Hub & Onboarding Form */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="bg-white/95 backdrop-blur-xl border border-[#EAE6DF] rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 relative overflow-hidden"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E3A2F] via-[#D4AF37] to-[#1E3A2F]" />

              {/* Segmented Mode Switcher */}
              <div className="flex items-center p-1.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl mb-6 relative">
                <button
                  type="button"
                  onClick={() => setActiveTab("instant")}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-1.5 ${
                    activeTab === "instant"
                      ? "text-[#1E3A2F] shadow-sm bg-white"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>⚡ Quick Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-1.5 ${
                    activeTab === "signin"
                      ? "text-[#1E3A2F] shadow-sm bg-white"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-1.5 ${
                    activeTab === "signup"
                      ? "text-[#1E3A2F] shadow-sm bg-white"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Content Panel Transition */}
              <AnimatePresence mode="wait">
                {/* 1. Quick Demo / Hackathon Judge Mode */}
                {activeTab === "instant" && (
                  <motion.div
                    key="tab-instant"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Hero Judge Action Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E3A2F]/5 via-[#D4AF37]/10 to-white border border-[#D4AF37]/50 relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                        <span className="text-xs font-bold text-[#1E3A2F] uppercase tracking-wider">
                          Hackathon Judge & Evaluator Mode
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                        Zero friction. Launch the complete TaqwaLens studio with 1 click to test AI
                        photo scanning, live webcam recognition, barcode UPC lookup, and 3D
                        ProductLens.
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onContinueAsGuest}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#1E3A2F] text-white font-bold text-sm shadow-md hover:bg-[#152a22] transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                        <span>Continue as Guest Auditor (Instant Access)</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    </div>

                    {/* Pre-Configured Personas */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                          Or Select a Test Persona (1-Click)
                        </span>
                        <span className="text-[11px] text-[#78716C]">Instant Setup</span>
                      </div>

                      <div className="space-y-2.5">
                        {DEMO_PERSONAS.map((persona) => (
                          <motion.button
                            key={persona.name}
                            whileHover={{ scale: 1.01, x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => handleSelectPersona(persona)}
                            className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] hover:border-[#1E3A2F]/50 hover:bg-white text-left transition-all flex items-start gap-3.5 group shadow-2xs"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#1E3A2F] text-[#FAF8F5] font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-[#D4AF37]/50 group-hover:scale-105 transition-transform">
                              {persona.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-[#1C1917] truncate">
                                  {persona.name}
                                </h4>
                                <span className="text-[10px] font-semibold text-[#D4AF37] uppercase bg-[#1E3A2F] px-2 py-0.5 rounded-full">
                                  {persona.madhhab}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#1E3A2F] font-medium mt-0.5">
                                {persona.role}
                              </p>
                              <p className="text-[10px] text-[#78716C] mt-1 line-clamp-1">
                                {persona.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:text-[#1E3A2F] group-hover:translate-x-1 transition-all shrink-0 self-center" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Sign In Tab */}
                {activeTab === "signin" && (
                  <motion.form
                    key="tab-signin"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignInSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                        Auditor Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="auditor@taqwalens.org"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-xs font-medium text-[#1C1917] focus:bg-white focus:border-[#1E3A2F] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                        Passcode / Security Token
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-xs font-medium text-[#1C1917] focus:bg-white focus:border-[#1E3A2F] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[#57534E]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-[#EAE6DF] text-[#1E3A2F] focus:ring-[#1E3A2F]"
                        />
                        <span>Remember session</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSignInEmail("demo.auditor@taqwalens.org");
                          setSignInPassword("demo12345");
                        }}
                        className="text-[#1E3A2F] font-semibold hover:underline"
                      >
                        Auto-fill Demo
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-[#1E3A2F] text-white font-bold text-sm shadow-md hover:bg-[#152a22] transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>Sign In to Audit Terminal</span>
                    </motion.button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={onContinueAsGuest}
                        className="text-xs text-[#78716C] hover:text-[#1C1917] underline transition-colors"
                      >
                        Don't have an account? Jump in as Guest →
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* 3. Create Account (Fiqh Onboarding) Tab */}
                {activeTab === "signup" && (
                  <motion.form
                    key="tab-signup"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignUpSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                        Full Name / Auditor Handle
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. Tariq Mansoor"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-xs font-medium text-[#1C1917] focus:bg-white focus:border-[#1E3A2F] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="tariq@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-xs font-medium text-[#1C1917] focus:bg-white focus:border-[#1E3A2F] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Juristic Madhhab Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5 text-[#1E3A2F]" />
                          <span>Juristic School of Thought (Madhhab)</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "standard", label: "Standard", desc: "Consensus (Ijma')" },
                          { id: "hanafi", label: "Hanafi", desc: "Strict Carmine / Marine" },
                          { id: "shafii", label: "Shafi'i", desc: "Marine Permitted" },
                          { id: "strict", label: "Strict Wara'", desc: "Precautionary Principle" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSignupMadhhab(m.id as MadhhabProfile)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              signupMadhhab === m.id
                                ? "bg-[#1E3A2F] text-white border-[#1E3A2F]"
                                : "bg-[#FAF8F5] text-[#1C1917] border-[#EAE6DF] hover:border-[#1E3A2F]/40"
                            }`}
                          >
                            <div className="text-xs font-bold">{m.label}</div>
                            <div
                              className={`text-[10px] mt-0.5 ${
                                signupMadhhab === m.id ? "text-stone-300" : "text-[#78716C]"
                              }`}
                            >
                              {m.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dietary / Allergen Filters */}
                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                        Dietary & Allergen Preferences
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {DIETARY_OPTIONS.map((opt) => {
                          const isSelected = selectedDietary.includes(opt.label);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => toggleDietaryOption(opt.label)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                                isSelected
                                  ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1C1917]"
                                  : "bg-[#FAF8F5] border border-[#EAE6DF] text-[#78716C] hover:text-[#1C1917]"
                              }`}
                            >
                              <span>{opt.icon}</span>
                              <span>{opt.label}</span>
                              {isSelected && <CheckCircle2 className="w-3 h-3 text-[#1E3A2F]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-[#1E3A2F] text-white font-bold text-sm shadow-md hover:bg-[#152a22] transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Create Verified Auditor Profile & Launch</span>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer Credentials Note */}
      <footer className="w-full border-t border-[#EAE6DF] py-4 bg-[#FAF8F5]/80 text-center text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TaqwaLens v2.4 Enterprise • Mindful Food & Ingredient Auditor</span>
          <span className="font-mono text-[11px]">Fiqh Al-At'imah Engine • OpenFoodFacts Integrated</span>
        </div>
      </footer>

      {/* Ecstatic Launching Celebration Overlay */}
      <AnimatePresence>
        {launchingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1E3A2F]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center text-white"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/10 border border-[#D4AF37]/50 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-4">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-1">
                Welcome, {launchingUser.name}
              </h3>
              <p className="text-xs text-[#FAF8F5]/80 mb-4">
                Juristic Profile: <span className="font-bold text-[#D4AF37] uppercase">{launchingUser.madhhab}</span>
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-mono text-[#D4AF37]">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span>Mounting AI Scanner Studio...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
