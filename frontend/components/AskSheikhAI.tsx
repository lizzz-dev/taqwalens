"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, BookOpen, Scale, ArrowRight, CornerDownLeft, Loader2, CheckCircle2 } from "lucide-react";
import { soundManager } from "../lib/soundEffects";
import { MadhhabProfile } from "../lib/types";

interface Message {
  id: string;
  sender: "user" | "scholar";
  text: string;
  modelUsed?: string;
  citations?: string[];
  timestamp: string;
}

interface AskSheikhAIProps {
  productName: string;
  verdict: string;
  additives?: Array<{ code?: string; name?: string; halal_status?: string }>;
  madhhab?: MadhhabProfile;
}

const DEFAULT_PROMPTS = [
  "Why is E471 or animal enzymes doubtful here?",
  "What is the exact Hanafi ruling on this product?",
  "Can you recommend 3 Halal-certified alternative brands?",
  "Is there any risk of cross-contamination or hidden lard?",
];

export function AskSheikhAI({
  productName,
  verdict,
  additives = [],
  madhhab = "standard",
}: AskSheikhAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      sender: "scholar",
      text: `**As-salāmu ʿalaykum wa-raḥmatullāhi wa-barakātuh.**\n\nI am your AI Juristic Assistant for **${productName}** (${verdict}). Ask me any question regarding additive origins, Madhhab discrepancies (Hanafi vs Shafi'i), the doctrine of *Istihālah* (transformation), or request certified Halal substitutes.`,
      modelUsed: "TaqwaLens Fiqh Al-At'imah Engine",
      citations: ["JAKIM MS 1500:2019", "Classical Fiqh Compendium"],
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    soundManager.playClick();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/ask-fiqh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          product_name: productName,
          verdict: verdict,
          additives: additives,
          madhhab: madhhab,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to contact Fiqh Scholar service.");
      }

      const data = await res.json();
      soundManager.playWhoosh();

      const scholarMsg: Message = {
        id: `scholar-${Date.now()}`,
        sender: "scholar",
        text: data.answer || "No response received.",
        modelUsed: data.model_used,
        citations: data.scholar_citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, scholarMsg]);
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "scholar",
        text: `**Notice:** I was unable to connect to the cloud scholar network, but based on our offline Fiqh knowledge base: for **${productName}**, if any ingredient is flagged as Mushbooh (such as E471, animal rennet, or carmine E120), you are encouraged to adopt the precautionary position (*Wara'*) until certified Halal origin is proven by the manufacturer.`,
        modelUsed: "Offline Fiqh Knowledge Base",
        citations: ["JAKIM Halal Standard", "40 Hadith of Imam An-Nawawi"],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-[#EAE6DF] rounded-3xl overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A2F] via-[#2A4D3E] to-[#1E3A2F] px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-base sm:text-lg tracking-wide text-white">
                Ask Sheikh AI
              </h4>
              <span className="text-[10px] font-mono uppercase bg-[#D4AF37]/20 text-[#F5E084] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full font-bold">
                Juristic Advisor
              </span>
            </div>
            <p className="text-xs text-[#FAF8F5]/80">
              Interactive Halal jurisprudence & food science Q&A for {productName}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
          <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="capitalize">{madhhab} Fiqh Active</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-[#EAE6DF] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Suggested:
        </span>
        {DEFAULT_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-[#EAE6DF] hover:border-[#1E3A2F]/50 text-[#1C1917] text-[11px] font-medium transition-all active:scale-95 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-5 space-y-4 max-h-[380px] overflow-y-auto bg-gradient-to-b from-[#FAF8F5]/40 to-white">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#1E3A2F] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 shadow-2xs ${
                  isUser
                    ? "bg-[#1E3A2F] text-white rounded-br-xs"
                    : "bg-white border border-[#EAE6DF] text-[#1C1917] rounded-bl-xs"
                }`}
              >
                <div className="whitespace-pre-line space-y-1">
                  {m.text.split("\n").map((line, idx) => {
                    // Quick bold parser for markdown **bold**
                    if (line.includes("**")) {
                      const parts = line.split("**");
                      return (
                        <p key={idx} className="leading-relaxed">
                          {parts.map((p, pIdx) =>
                            pIdx % 2 === 1 ? (
                              <strong key={pIdx} className="font-bold">
                                {p}
                              </strong>
                            ) : (
                              p
                            )
                          )}
                        </p>
                      );
                    }
                    return line ? <p key={idx}>{line}</p> : <div key={idx} className="h-1.5" />;
                  })}
                </div>

                {/* Citations & Metadata footer for scholar */}
                {!isUser && (m.modelUsed || (m.citations && m.citations.length > 0)) && (
                  <div className="mt-2.5 pt-2 border-t border-[#EAE6DF]/60 flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#78716C]">
                    <span className="font-mono text-[9px] text-[#1E3A2F] font-semibold">
                      {m.modelUsed || "Verified Fiqh Engine"}
                    </span>
                    {m.citations && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                        <span>{m.citations[0]}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-[#78716C] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-[#EAE6DF] rounded-2xl px-4 py-2.5 shadow-2xs">
              <span className="italic">Consulting classical fiqh texts and additive databases...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#EAE6DF] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask Sheikh AI about ${productName} (e.g. "Can I eat this in Hanafi?", "Halal alternatives?")...`}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] text-xs text-[#1C1917] focus:bg-white focus:border-[#1E3A2F] focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#1E3A2F] text-white hover:bg-[#152a22] disabled:opacity-40 disabled:hover:bg-[#1E3A2F] transition-all active:scale-95 flex items-center justify-center"
          title="Send question to Sheikh AI"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
