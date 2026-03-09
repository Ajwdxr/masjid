"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { CampaignDisplay } from "@/components/infaq/CampaignDisplay";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconWallet, IconCreditCard, IconUser, IconUserX } from "@/components/ui/Icons";
import type { Campaign } from "@/types/campaign";
import type { Donation, DonationFormData } from "@/types/donation";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function InfaqPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch active campaign
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (campaigns && campaigns.length > 0) {
        setCampaign(campaigns[0]);
        const { data: donationsData } = await supabase
          .from("donations")
          .select("*")
          .eq("campaign_id", campaigns[0].id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (donationsData) setDonations(donationsData);
      } else {
        // Fallback for demo if no campaign created yet
        setCampaign({
          id: "1",
          title: "Tabung Penyelenggaraan Masjid 2026",
          description: "Sumbangan untuk penyelenggaraan dan pembaikan kemudahan Masjid Zahir termasuk sistem penghawa dingin, karpet, kemudahan wuduk, dan pembaikan bumbung masjid.",
          target_amount: 500000,
          collected_amount: 187500,
          end_date: "2026-12-31",
          is_active: true,
          qr_code_url: null,
          payment_link: null,
          created_at: "2026-01-01",
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!campaign && !loading) return <div className="p-8 text-center text-light-muted">Tiada kempen aktif buat masa ini.</div>;
  if (loading) return <div className="p-8 text-center text-gold animate-pulse">Memuatkan maklumat infaq...</div>;

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

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Campaign Display */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {campaign && <CampaignDisplay campaign={campaign} />}
        </div>
      </div>

      {/* Recent Donations */}
      <section className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4 flex items-center gap-2">
          <IconCreditCard size={18} className="text-gold" />
          Sumbangan Terkini
        </h2>
        <div className="space-y-2">
          {donations.slice(0, 10).map((donation) => (
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
                      donation.payment_method === "online" ? "gold" : donation.payment_method === "qr" ? "emerald" : "muted"
                    }
                  >
                    {donation.payment_method === "online" ? "Online" : donation.payment_method === "qr" ? "QR" : "Manual"}
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
