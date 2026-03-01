/* ─── Complaint Types ─── */

export type ComplaintStatus = "Dalam Tindakan" | "Selesai";

export type ComplaintCategory =
  | "Kebersihan"
  | "Kemudahan"
  | "Pengurusan"
  | "Keselamatan"
  | "Lain-lain";

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  description: string;
  image_url: string | null;
  is_anonymous: boolean;
  status: ComplaintStatus;
  created_at: string;
  updated_at?: string;
}

export type ComplaintFormData = Omit<Complaint, "id" | "created_at" | "updated_at" | "status">;
