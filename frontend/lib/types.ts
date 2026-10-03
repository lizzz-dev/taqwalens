export type VerdictStatus = 'HALAL' | 'HARAM' | 'MUSHBOOH' | 'NEEDS_REVIEW';

export type IngredientSource = 'plant' | 'animal' | 'synthetic' | 'mineral' | 'microbial' | 'unknown';

export type MadhhabProfile = 'standard' | 'hanafi' | 'shafii' | 'strict';

export interface AdditiveDetail {
  code: string;
  name: string;
  category: string;
  status: VerdictStatus;
  source: IngredientSource;
  description: string;
  fiqh_notes: string;
  reference_authority?: string;
}

export interface IngredientItem {
  name: string;
  raw_text: string;
  status: VerdictStatus;
  is_flagged: boolean;
  source?: IngredientSource;
  additive_detail?: AdditiveDetail | null;
  reason?: string;
}

export interface InquiryEmailDraft {
  subject: string;
  body: string;
  suggested_recipient?: string;
}

export interface InquiryDrafts {
  email: InquiryEmailDraft;
  tweet: string;
}

export interface AuditMetadata {
  model_used: string;
  processing_time_ms: number;
  image_width: number;
  image_height: number;
  groq_fallback_triggered: boolean;
}

export interface AuditResponse {
  product_name: string;
  brand?: string;
  overall_verdict: VerdictStatus;
  verdict_label?: string;
  verdict_color: string; // '#059669' (Halal) | '#DC2626' (Haram) | '#D97706' (Mushbooh) | '#64748B' (Needs Review)
  verdict_summary: string;
  detected_certifications: string[];
  ingredients: IngredientItem[];
  flagged_items: IngredientItem[];
  inquiry_email: string;
  inquiry_tweet: string;
  inquiry_details?: InquiryDrafts;
  disclaimer: string;
  metadata: AuditMetadata;
  madhhab_profile?: string;
  dietary_tags?: string[];
  allergens_detected?: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  audit: AuditResponse;
  inputType: 'image' | 'barcode' | 'preset';
  barcode?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  madhhab: MadhhabProfile;
  dietaryPreferences: string[];
  role: 'guest' | 'auditor' | 'scholar' | 'consumer';
  avatarInitials: string;
  createdAt: number;
}
