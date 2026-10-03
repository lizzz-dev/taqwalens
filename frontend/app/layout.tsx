import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaqwaLens — Food Ingredient & E-Code Compliance Auditor",
  description:
    "Automated, production-grade compliance verification for food packaging labels and E-numbers powered by Groq Llama 3.2 Vision and Gemini 1.5 Flash.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full bg-slate-950">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-slate-950 text-slate-100 font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
