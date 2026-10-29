/**
 * Domain contracts for DallasCircle's local-discovery product.
 *
 * These describe the target application model; they are not a claim that the
 * production Supabase schema already matches. Verify the live schema and RLS
 * before wiring database queries or adding migrations.
 */

export type PublicationStatus =
  | "draft"
  | "needs_review"
  | "published"
  | "hidden"
  | "duplicate"
  | "closed"
  | "archived";

export type VerificationStatus =
  | "verified"
  | "unverified"
  | "conflicting"
  | "stale";

export type SourceType =
  | "official_website"
  | "official_menu"
  | "official_venue"
  | "direct_business_contact"
  | "government_or_public_agency"
  | "other_reliable_public_source";

export type PlaceCategory =
  | "restaurant"
  | "bar"
  | "cafe"
  | "live_music"
  | "entertainment"
  | "attraction"
  | "other";

export interface Place {
  id: string;
  slug: string;
  name: string;
  summary?: string | null;
  category: PlaceCategory;
  websiteUrl?: string | null;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  locality: "Dallas";
  neighborhoodSlug?: string | null;
  region: "TX";
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  priceLevel?: 1 | 2 | 3 | 4 | null;
  publicationStatus: PublicationStatus;
  publishedAt?: string | null;
  lastEditorialReviewAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SourceRecord {
  id: string;
  canonicalUrl: string;
  sourceType: SourceType;
  publisherName?: string | null;
  accessedAt: string;
  notes?: string | null;
}

export interface PlaceFact {
  id: string;
  placeId: string;
  factKey: string;
  value: unknown;
  sourceId: string;
  verificationStatus: VerificationStatus;
  checkedAt: string;
  reviewDueAt?: string | null;
  notes?: string | null;
}

export interface EditorialGuide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: PublicationStatus;
  authorName: string;
  publishedAt?: string | null;
  updatedAt: string;
  reviewedAt?: string | null;
}

export interface GuidePlace {
  guideId: string;
  placeId: string;
  position: number;
  editorialRationale: string;
  isSponsored: boolean;
  sponsorshipDisclosure?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
