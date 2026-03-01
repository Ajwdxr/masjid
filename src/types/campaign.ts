/* ─── Campaign Types ─── */

export interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  collected_amount: number;
  end_date: string;
  is_active: boolean;
  qr_code_url: string | null;
  payment_link: string | null;
  created_at: string;
  updated_at?: string;
}

export type CampaignFormData = Omit<Campaign, "id" | "created_at" | "updated_at" | "collected_amount">;
