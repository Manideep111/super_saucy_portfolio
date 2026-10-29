// Shared between the lead scraper UI and the /api/leads route handler.

export interface SubscriberRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const SUBSCRIBER_RANGES: SubscriberRange[] = [
  { id: "any", label: "Any size", min: 0, max: Infinity },
  { id: "0-1k", label: "Under 1K", min: 0, max: 1_000 },
  { id: "1k-10k", label: "1K – 10K", min: 1_000, max: 10_000 },
  { id: "10k-50k", label: "10K – 50K", min: 10_000, max: 50_000 },
  { id: "50k-100k", label: "50K – 100K", min: 50_000, max: 100_000 },
  { id: "100k-500k", label: "100K – 500K", min: 100_000, max: 500_000 },
  { id: "500k-1m", label: "500K – 1M", min: 500_000, max: 1_000_000 },
  { id: "1m+", label: "1M+", min: 1_000_000, max: Infinity },
];

export interface UploadWindow {
  id: string;
  label: string;
  days: number | null;
}

export const UPLOAD_WINDOWS: UploadWindow[] = [
  { id: "any", label: "Any time", days: null },
  { id: "2d", label: "Last 2 days", days: 2 },
  { id: "1w", label: "Last week", days: 7 },
  { id: "2w", label: "Last 2 weeks", days: 14 },
  { id: "1m", label: "Last month", days: 30 },
  { id: "3m", label: "Last 3 months", days: 90 },
  { id: "6m", label: "Last 6 months", days: 180 },
];

export interface Region {
  code: string;
  label: string;
}

export const REGIONS: Region[] = [
  { code: "any", label: "Worldwide" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "IN", label: "India" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "NL", label: "Netherlands" },
  { code: "SE", label: "Sweden" },
  { code: "BR", label: "Brazil" },
  { code: "MX", label: "Mexico" },
  { code: "AR", label: "Argentina" },
  { code: "JP", label: "Japan" },
  { code: "KR", label: "South Korea" },
  { code: "ID", label: "Indonesia" },
  { code: "PH", label: "Philippines" },
  { code: "SG", label: "Singapore" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "ZA", label: "South Africa" },
  { code: "NG", label: "Nigeria" },
];

export const NICHE_SUGGESTIONS = [
  "Personal finance",
  "Fitness",
  "Tech reviews",
  "Gaming",
  "Cooking",
  "Travel vlog",
  "Productivity",
  "Real estate",
  "Crypto",
  "Beauty",
  "Podcast",
  "Self improvement",
];

export interface ChannelLead {
  id: string;
  title: string;
  handle: string | null;
  url: string;
  thumbnail: string | null;
  description: string;
  country: string | null;
  subscribers: number | null;
  views: number;
  videos: number;
  lastUploadAt: string | null;
  lastVideoTitle: string | null;
  lastVideoUrl: string | null;
  emails: string[];
  links: string[];
}

export interface LeadsResponse {
  leads: ChannelLead[];
  nextPageToken: string | null;
  scanned: number;
}

export interface LeadsError {
  error: string;
}
