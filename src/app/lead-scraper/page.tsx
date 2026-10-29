import type { Metadata } from "next";
import { LeadScraper } from "@/components/lead-scraper/LeadScraper";

export const metadata: Metadata = {
  title: "Lead Scraper",
  description: "Find YouTube channels by niche, size, activity and region.",
  robots: { index: false, follow: false },
};

export default function LeadScraperPage() {
  return <LeadScraper />;
}
