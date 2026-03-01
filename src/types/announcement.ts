/* ─── Announcement Types ─── */

export interface Announcement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type AnnouncementFormData = Omit<Announcement, "id" | "created_at" | "updated_at">;
