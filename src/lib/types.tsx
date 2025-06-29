// src/lib/types.ts

// Ini merepresentasikan satu langkah partisipasi
export interface ParticipationStep {
  step: number;
  instruction: string;
  link?: string;
}

// Ini adalah tipe utama untuk data Airdrop
export interface Airdrop {
  id: number;
  slug: string;
  created_at?: string; // datetime dari backend menjadi string di JSON
  updated_at?: string; // datetime dari backend menjadi string di JSON
  created_by: string; // UUID dari backend menjadi string di JSON
  name: string;
  token_symbol: string;
  project_url?: string;
  image_url?: string;
  description?: string;
  category?: string;
  network?: string;
  token_contract_address?: string;
  airdrop_allocation?: number;
  estimated_value_usd?: number;
  difficulty?: string;
  participation_steps?: ParticipationStep[];
  is_confirmed: boolean;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface AirdropFormData {
  name: string;
  slug?: string;
  token_symbol: string;
  project_url?: string;
  image_url?: string;
  description?: string;
  category?: string;
  network?: string;
  token_contract_address?: string;
  airdrop_allocation?: number;
  estimated_value_usd?: number;
  difficulty?: string;
  participation_steps?: ParticipationStep[];
  is_confirmed: boolean;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface NewUserStat {
  date: string;
  count: number;
}

export interface AnalyticsOverview {
  total_users: number;
  total_airdrops: number;
  active_airdrops: number;
  total_guides: number;
  published_guides: number;
  new_users_last_7_days?: NewUserStat[];
}

export interface RecentUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string
}
export interface RecentAirdrop {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}
export interface RecentActivityData {
  new_users?: RecentUser[];
  new_airdrops?: RecentAirdrop[];
}

export interface Activity {
  type: 'NEW_USER' | 'NEW_AIRDROP' | 'OTHER';
  details: string;
  avatarUrl?: string;
  avatarFallback: string;
  timestamp: string;
}

export interface AuthorProfile {
  id: string; // UUID
  full_name?: string;
  avatar_url?: string;
}

export interface AdminUserView {
  id: string; // UUID
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  role?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface AdminUserDetail extends AdminUserView {
  email_confirmed_at?: string;
  phone?: string;
  username?: string;
  website?: string;
}

export interface Guide {
  id: number;
  slug: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_id?: AuthorProfile | null;
  title: string;
  description?: string;
  content?: string;
  image_url?: string;
  category?: 'Beginner' | 'Strategy' | 'Security' | 'Tools' | 'News';
  status: 'draft' | 'published' | 'archived';
}

export interface GuideFormData {
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  image_url?: string;
  category?: 'Beginner' | 'Strategy' | 'Security' | 'Tools' | 'News';
  status?: 'draft' | 'published' | 'archived';
  // published_at dan author_id akan di-handle backend
}

export interface PostFormData {
  title: string;
  slug?: string; // Dibuat di backend
  description?: string;
  content?: string;
  image_url?: string;
  category?: 'Beginner' | 'Strategy' | 'Security' | 'Tools' | 'News';
  status?: 'draft' | 'published' | 'archived';
  // published_at dan author_id akan di-handle backend
}

export interface Post extends Guide {}
export interface CommentAuthor {
  id: string; // UUID
  full_name?: string;
  avatar_url?: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: CommentAuthor;
  parent_id?: number;
  guide_id?: number;
  airdrop_id?: number;
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export interface Profile {
  id: string; // UUID
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
}

export interface KnowledgeBaseSection {
  id: number;
  title: string;
  subtitle?: string | null;
  display_order: number;
}

export interface KnowledgeBaseSectionWithGuides extends KnowledgeBaseSection {
  guides: Guide[];
}

export interface Notification {
  id: number;
  created_at: string;
  title: string;
  message?: string;
  link_url?: string;
  is_read: boolean;
}

