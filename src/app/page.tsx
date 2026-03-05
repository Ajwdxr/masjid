import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HijriDate } from "@/components/dashboard/HijriDate";
import { LiveClock } from "@/components/dashboard/LiveClock";
import { PrayerTimes } from "@/components/dashboard/PrayerTimes";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { CampaignCard } from "@/components/dashboard/CampaignCard";
import { fetchPrayerTimes } from "@/lib/prayer-times";
import { IconMosque, IconMegaphone, IconWallet, IconClipboard } from "@/components/ui/Icons";
import type { Announcement } from "@/types/announcement";
import type { Campaign } from "@/types/campaign";

/* ─── Mock data (will be replaced by Supabase in later steps) ─── */
const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Ceramah Khas Ramadan",
    description:
      "Ceramah khas sempena bulan Ramadan bersama Ustaz Ahmad. Semua jemaah dijemput hadir selepas solat Isyak.",
    image_url: null,
    event_date: "2026-03-15",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "2",
    title: "Program Tadarus Al-Quran",
    description:
      "Program tadarus Al-Quran sepanjang bulan Ramadan bermula selepas solat Subuh hingga Syuruk.",
    image_url: null,
    event_date: "2026-03-05",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "3",
    title: "Gotong-Royong Masjid",
    description:
      "Gotong-royong pembersihan dan penyelenggaraan masjid. Semua sukarelawan dijemput hadir dari jam 8 pagi.",
    image_url: null,
    event_date: "2026-03-10",
    is_active: true,
    created_at: "2026-02-28",
  },
];

const mockCampaign: Campaign = {
  id: "1",
  title: "Tabung Penyelenggaraan Masjid 2026",
  description:
    "Sumbangan untuk penyelenggaraan dan pembaikan kemudahan Masjid Zahir termasuk sistem penghawa dingin, karpet, dan kemudahan wuduk.",
  target_amount: 500000,
  collected_amount: 187500,
  end_date: "2026-12-31",
  is_active: true,
  qr_code_url: null,
  payment_link: null,
  created_at: "2026-01-01",
};

import { PageTracker } from "@/components/analytics/PageTracker";

export default async function HomePage() {
  // Server-side fetch prayer times
  const prayerData = await fetchPrayerTimes();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <PageTracker path="/" />
      
      {/* ─── Hero / Branding ─── */}
      <section className="text-center pt-4 pb-2 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-2xl gold-gradient flex items-center justify-center text-dark text-3xl font-bold font-[family-name:var(--font-poppins)] shadow-2xl mb-4">
          Z
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-poppins)] gold-text">
          Masjid Zahir
        </h1>
        <p className="text-light-muted text-sm mt-1">
          Alor Setar, Kedah Darul Aman
        </p>
      </section>

      {/* ─── Date & Clock ─── */}
      <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Card className="text-center py-6 space-y-3">
          <HijriDate hijriFromApi={prayerData.hijriDate} />
          <LiveClock />
        </Card>
      </section>

      {/* ─── Prayer Times ─── */}
      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }} data-facility="Prayer Times">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-2">
              <IconMosque size={20} className="text-gold" />
              Waktu Solat
            </h2>
            <Badge variant="muted">{prayerData.zone}</Badge>
          </div>
          <PrayerTimes prayers={prayerData.prayers} />
        </Card>
      </section>

      {/* ─── Latest Announcements ─── */}
      <section className="animate-fade-in" style={{ animationDelay: "0.3s" }} data-facility="Announcements">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light flex items-center gap-2">
            <IconMegaphone size={18} className="text-gold" />
            Pengumuman Terkini
          </h2>
          <Link
            href="/announcements"
            className="text-xs text-gold hover:text-gold-light transition-colors font-medium"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="space-y-3">
          {mockAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              compact
            />
          ))}
        </div>
      </section>

      {/* ─── Active Campaign ─── */}
      <section className="animate-fade-in" style={{ animationDelay: "0.4s" }} data-facility="Infaq Campaign">
        <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light flex items-center gap-2 mb-4">
          <IconWallet size={18} className="text-gold" />
          Kempen Infaq Aktif
        </h2>
        <CampaignCard campaign={mockCampaign} />
      </section>

      {/* ─── Quick Action ─── */}
      <section
        className="text-center pb-6 animate-fade-in"
        style={{ animationDelay: "0.5s" }}
        data-facility="Complaints Form"
      >
        <Link href="/aduan">
          <Button variant="outline" size="lg">
            <IconClipboard size={16} className="inline mr-2" />
            Hantar Aduan
          </Button>
        </Link>
      </section>
    </div>
  );
}
