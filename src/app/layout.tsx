import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { BackgroundLayer } from "@/components/effects/BackgroundLayer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YOUR NAME — Video Editor",
  description:
    "Cinematic edits, motion design, and storytelling for creators and brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-text-primary flex flex-col isolate">
        <BackgroundLayer />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
