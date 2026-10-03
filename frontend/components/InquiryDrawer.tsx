"use client";

import React, { useState } from "react";
import { Mail, Send, Copy, Check, ExternalLink, HelpCircle } from "lucide-react";
import { AuditResponse } from "../lib/types";

interface InquiryDrawerProps {
  audit: AuditResponse;
}

export function InquiryDrawer({ audit }: InquiryDrawerProps) {
  const [activeTab, setActiveTab] = useState<"email" | "tweet">("email");
  const [copied, setCopied] = useState<boolean>(false);

  const isMushbooh = audit.overall_verdict === "MUSHBOOH";
  const emailText = audit.inquiry_email;
  const tweetText = audit.inquiry_tweet;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailClient = () => {
    const subject = encodeURIComponent(
      audit.inquiry_details?.email.subject || `Ingredient Sourcing Inquiry: ${audit.product_name}`
    );
    const body = encodeURIComponent(emailText);
    const recipient = audit.inquiry_details?.email.suggested_recipient || "";
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  const handleOpenTwitterIntent = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full rounded-2xl border border-[#F5DEB3] bg-[#FCF7ED]/50 p-6 sm:p-7 space-y-6 shadow-sm relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5DEB3]/70 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#F5DEB3] text-[#B45309] flex items-center justify-center shadow-2xs">
            <HelpCircle className="w-5 h-5 text-[#C28E38]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
              <span>Brand Sourcing Inquiry</span>
              {isMushbooh && (
                <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-white border border-[#F5DEB3] text-[#B45309]">
                  Verification Recommended
                </span>
              )}
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Directly clarify plant vs. animal origin with the food manufacturer in one click.
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="inline-flex rounded-full bg-white border border-[#EAE6DF] p-1 text-xs font-medium self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab("email")}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === "email"
                ? "bg-[#1E3A2F] text-white shadow-xs font-semibold"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Formal Email
          </button>
          <button
            onClick={() => setActiveTab("tweet")}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === "tweet"
                ? "bg-[#1E3A2F] text-white shadow-xs font-semibold"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            X / Twitter
          </button>
        </div>
      </div>

      {/* Tab 1: Formal Email Content */}
      {activeTab === "email" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#EAE6DF] bg-white p-4 text-xs text-[#44403C] leading-relaxed whitespace-pre-wrap select-all max-h-72 overflow-y-auto font-sans shadow-2xs">
            {emailText}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-[#78716C]">
              Pre-filled with polite consumer sourcing inquiry & dietary points
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(emailText)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EAE6DF] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] transition-all shadow-2xs active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenMailClient}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E3A2F] text-xs font-medium text-white hover:bg-[#2D5A46] transition-all shadow-xs active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Email App</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: X / Twitter Post Content */}
      {activeTab === "tweet" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#EAE6DF] bg-white p-4 text-xs text-[#44403C] leading-relaxed font-sans shadow-2xs">
            {tweetText}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-[#78716C]">
              Concise public tweet under 280 characters with consumer tags
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(tweetText)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EAE6DF] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] transition-all shadow-2xs active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Copy Post</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenTwitterIntent}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E3A2F] text-xs font-medium text-white hover:bg-[#2D5A46] transition-all shadow-xs active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Publish to X</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
