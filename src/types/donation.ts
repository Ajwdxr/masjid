/* ─── Donation Types ─── */

export interface Donation {
  id: string;
  campaign_id: string;
  donor_name: string | null;
  amount: number;
  payment_method: "qr" | "online" | "manual";
  payment_ref: string | null;
  created_at: string;
}

export type DonationFormData = Omit<Donation, "id" | "created_at">;
