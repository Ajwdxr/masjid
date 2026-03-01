"use client";

import { useState } from "react";
import { CampaignDisplay } from "@/components/infaq/CampaignDisplay";
import { DonationForm } from "@/components/infaq/DonationForm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconWallet, IconCreditCard, IconUser, IconUserX } from "@/components/ui/Icons";
import type { Campaign } from "@/types/campaign";
import type { Donation, DonationFormData } from "@/types/donation";
import { formatCurrency } from "@/lib/utils";

/* ─── Mock data (will be replaced by Supabase) ─── */
const mockCampaign: Campaign = {
  id: "1",
  title: "Tabung Penyelenggaraan Masjid 2026",
  description:
    "Sumbangan untuk penyelenggaraan dan pembaikan kemudahan Masjid Zahir termasuk sistem penghawa dingin, karpet, kemudahan wuduk, dan pembaikan bumbung masjid. Setiap sumbangan anda amat bermakna untuk memastikan keselesaan jemaah.",
  target_amount: 500000,
  collected_amount: 187500,
  end_date: "2026-12-31",
  is_active: true,
  qr_code_url: null,
  payment_link: null,
  created_at: "2026-01-01",
};

const initialDonations: Donation[] = [
  {
    id: "1",
    campaign_id: "1",
    donor_name: "Ahmad bin Ismail",
    amount: 500,
    payment_method: "online",
    payment_ref: "ZD-001",
    created_at: "2026-03-01T10:30:00",
  },
  {
    id: "2",
    campaign_id: "1",
    donor_name: null,
    amount: 100,
    payment_method: "qr",
    payment_ref: "ZD-002",
    created_at: "2026-02-28T14:20:00",
  },
  {
    id: "3",
    campaign_id: "1",
    donor_name: "Siti Nurhaliza",
    amount: 1000,
    payment_method: "online",
    payment_ref: "ZD-003",
    created_at: "2026-02-27T09:15:00",
  },
];

export default function InfaqPage() {
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [campaign, setCampaign] = useState<Campaign>(mockCampaign);

  const handleDonate = (data: DonationFormData) => {
    const newDonation: Donation = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setDonations([newDonation, ...donations]);
    setCampaign((prev) => ({
      ...prev,
      collected_amount: prev.collected_amount + data.amount,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-3">
          <IconWallet size={28} className="text-gold" />
          Infaq & Derma
        </h1>
        <p className="text-light-muted text-sm mt-2">
          Menyumbang untuk kemajuan dan penyelenggaraan Masjid Zahir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Display */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CampaignDisplay campaign={campaign} />
        </div>

        {/* Donation Form */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <DonationForm
            campaignId={campaign.id}
            qrCodeUrl={campaign.qr_code_url}
            paymentLink={campaign.payment_link}
            onSubmit={handleDonate}
          />
        </div>
      </div>

      {/* Recent Donations */}
      <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4 flex items-center gap-2">
          <IconCreditCard size={18} className="text-gold" />
          Sumbangan Terkini
        </h2>
        <div className="space-y-2">
          {donations.slice(0, 10).map((donation, i) => (
            <Card key={donation.id} className="p-4" hover={false}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                    {donation.donor_name ? <IconUser size={16} className="text-gold" /> : <IconUserX size={16} className="text-light-muted" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-light">
                      {donation.donor_name || "Tanpa Nama"}
                    </p>
                    <p className="text-xs text-light-muted">
                      {new Date(donation.created_at).toLocaleDateString("ms-MY", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold gold-text">
                    {formatCurrency(donation.amount)}
                  </p>
                  <Badge
                    variant={
                      donation.payment_method === "online" ? "gold" : "emerald"
                    }
                  >
                    {donation.payment_method === "online" ? "Online" : "QR"}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
