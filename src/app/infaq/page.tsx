"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { CampaignDisplay } from "@/components/infaq/CampaignDisplay";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconWallet, IconCreditCard, IconUser, IconUserX, IconLoader2 } from "@/components/ui/Icons";
import type { Campaign } from "@/types/campaign";
import type { Donation } from "@/types/donation";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function InfaqPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationQR, setDonationQR] = useState<string | null>(null);
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
      }

      // Fetch general donation QR fallback
      const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "donation_qr")
        .single();
      
      if (settings) setDonationQR(settings.value);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <IconLoader2 className="animate-spin text-gold mb-4" size={48} />
      <p className="text-gold animate-pulse">Memuatkan maklumat infaq...</p>
    </div>
  );

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

      {!campaign ? (
        <div className="space-y-6">
          <Card className="p-12 text-center border-dashed border-gold/20">
            <IconWallet size={48} className="text-gold/20 mx-auto mb-4" />
            <p className="text-light-muted italic">Tiada kempen infaq yang aktif buat masa ini.</p>
          </Card>

          {donationQR && (
            <Card className="p-8 text-center animate-fade-in border-gold/30 bg-gold/5">
               <h3 className="text-lg font-bold gold-text uppercase tracking-widest mb-6 italic">Infaq Umum Ke Akaun Masjid</h3>
               <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-3xl shadow-2xl shadow-gold/20 transition-transform hover:scale-105 duration-500">
                    <img src={donationQR} alt="General Donation QR" className="w-64 h-64 object-contain" />
                  </div>
               </div>
               <p className="text-xs text-light-muted mt-6 max-w-sm mx-auto leading-relaxed">
                  Anda boleh terus mengimbas QR di atas untuk sumbangan umum (Infaq Jumaat/Penyelenggaraan).
               </p>
               <p className="text-[10px] text-gold/60 mt-2 font-bold uppercase tracking-widest">
                  *Sokong TNG, DuitNow, dsb.
               </p>
            </Card>
          )}
        </div>
      ) : (
        <>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CampaignDisplay campaign={campaign} />
            </div>
          </div>

          {/* Recent Donations */}
          <section className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4 flex items-center gap-2">
              <IconCreditCard size={18} className="text-gold" />
              Sumbangan Terkini
            </h2>
            <div className="space-y-2">
              {donations.length > 0 ? (
                donations.slice(0, 10).map((donation) => (
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
                ))
              ) : (
                <p className="text-center py-10 text-xs text-light-muted italic">Belum ada sumbangan untuk kempen ini.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
