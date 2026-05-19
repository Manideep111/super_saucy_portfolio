import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { BackgroundLayer } from "@/components/effects/BackgroundLayer";
import { PageVeil } from "@/components/effects/PageVeil";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
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

const SITE_URL = "https://example.com";
const SITE_NAME = "Lumen";
const TITLE = "YOUR NAME — Video Editor";
const DESCRIPTION =
  "Premium video editing for creators, founders, and agencies who want to stop losing viewers in the first 3 seconds.";

export const viewport: Viewport = {
  themeColor: "#0a0612",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "video editing",
    "video editor portfolio",
    "YouTube editor",
    "short-form video",
    "brand video",
    "content strategy",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <ScrollProgress />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        <PageVeil />
      </body>
    </html>
  );
}
