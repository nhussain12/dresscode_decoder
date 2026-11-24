import type { Metadata, Viewport } from "next";
import { Caprasimo, Inter_Tight, DM_Sans, DM_Mono, Lora } from "next/font/google";
import "./globals.css";

// Each font becomes a CSS variable that globals.css maps to a Tailwind font family.
const caprasimo = Caprasimo({ weight: "400", subsets: ["latin"], variable: "--font-caprasimo" });
const interTight = Inter_Tight({ weight: "900", subsets: ["latin"], variable: "--font-inter-tight" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const dmMono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-dm-mono" });
const lora = Lora({ style: "italic", subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "dress code decoder",
  description: "the dress code is the same for everyone. your outfit shouldn't be.",
};

export const viewport: Viewport = {
  themeColor: "#F9F7F2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${caprasimo.variable} ${interTight.variable} ${dmSans.variable} ${dmMono.variable} ${lora.variable} antialiased`}
    >
      <body className="min-h-dvh bg-cream font-sans text-ink">{children}</body>
    </html>
  );
}
