export interface LicenseInfo {
  spdx_id: string;
  name: string;
  url: string;
  commercial_use_allowed: boolean;
  attribution_required: boolean;
}

export interface RepositorySourceInfo {
  repo_name: string;
  original_owner: string;
  github_url: string;
  programming_language: string;
  ownership_type: string;
  selection_rationale: string;
  license: LicenseInfo;
}

export interface CategoryInfo {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  icon_name: string;
}

export interface EvidenceItem {
  id: number;
  evidence_type: 'overview' | 'execution_result' | 'detailed_view' | string;
  title_en: string;
  title_ar: string;
  caption_en: string;
  caption_ar: string;
  image_url: string;
  sha256_hash: string;
  hardware_info: string;
  captured_at?: string;
}

export interface ProjectItem {
  id: number;
  project_code: string;
  slug: string;
  title_en: string;
  title_ar: string;
  short_description_en: string;
  short_description_ar: string;
  problem_statement_en: string;
  problem_statement_ar: string;
  technical_approach_en: string;
  technical_approach_ar: string;
  architecture_en: string;
  architecture_ar: string;
  tech_stack: string[];
  metrics: Record<string, string>;
  verification_status: string;
  is_featured: boolean;
  display_order: number;
  category: CategoryInfo;
  repository_source: RepositorySourceInfo;
  evidence_items: EvidenceItem[];
}

export interface ServiceItem {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  deliverables_en: string[];
  deliverables_ar: string[];
  icon_name: string;
  starting_timeline: string;
  is_active: boolean;
  display_order: number;
}

export interface ChallengeOption {
  id: string;
  text_en: string;
  text_ar: string;
}

export interface ChallengeItem {
  id: string;
  domain_en: string;
  domain_ar: string;
  title_en: string;
  title_ar: string;
  scenario_en: string;
  scenario_ar: string;
  code_snippet: string;
  question_en: string;
  question_ar: string;
  options: ChallengeOption[];
  correct_option: string;
  explanation_en: string;
  explanation_ar: string;
}

export interface AttachmentItem {
  id: number;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  sha256_hash: string;
  uploaded_at: string;
}

export interface ConversationItem {
  id: number;
  sender_role: string;
  channel: string;
  message: string;
  created_at: string;
}

export interface RevisionRequestItem {
  id: number;
  lead_id: number;
  revision_number: number;
  description: string;
  within_agreed_scope: boolean;
  is_free_revision: boolean;
  status: string;
  resolution_notes?: string | null;
  created_at: string;
}

export interface LeadItem {
  id: number;
  reference_code: string;
  full_name: string;
  email: string;
  phone_whatsapp: string;
  academic_or_tech_field: string;
  request_category: string;
  project_description: string;
  deadline?: string | null;
  status: string;
  quoted_amount?: string | null;
  admin_notes?: string | null;
  created_at: string;
  attachments: AttachmentItem[];
  conversations: ConversationItem[];
  revision_requests: RevisionRequestItem[];
  whatsapp_prefilled_url?: string | null;
}
