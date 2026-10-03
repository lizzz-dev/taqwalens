import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { AmbientGlassAura } from "../components/AmbientGlassAura";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1E3A2F",
};

export const metadata: Metadata = {
  title: "TaqwaLens — Food Ingredient & E-Code Compliance Auditor",
  description:
    "Automated, production-grade compliance verification for food packaging labels and E-numbers powered by Groq Llama 3.2 Vision, Gemini 1.5 Flash, and OpenFoodFacts.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaqwaLens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#FAF8F5]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} min-h-full bg-[#FAF8F5] text-[#1C1917] font-sans antialiased overflow-x-hidden selection:bg-[#E2ECE6] selection:text-[#1E3A2F] relative`}
      >
        <AmbientGlassAura />
        {children}
      </body>
    </html>
  );
}
