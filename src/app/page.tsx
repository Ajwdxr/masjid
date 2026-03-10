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
import { createClient } from "@/lib/supabase/server";
import { PageTracker } from "@/components/analytics/PageTracker";

export default async function HomePage() {
  // Server-side fetch prayer times
  const prayerData = await fetchPrayerTimes();

  // Database client
  const supabase = await createClient();

  // Fetch announcements
  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const announcements: Announcement[] = announcementsData || [];

  // Fetch active campaign
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1);

  const campaign: Campaign | null = campaigns && campaigns.length > 0 ? campaigns[0] as Campaign : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <PageTracker path="/" />

      {/* ─── Hero / Branding ─── */}
      <section className="text-center pt-4 pb-2 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-2xl gold-gradient overflow-hidden flex items-center justify-center shadow-2xl mb-4">
          <img
            src="/logo.jpg"
            alt="Masjid Zahir Logo"
            className="w-full h-full object-cover"
          />
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
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                compact
              />
            ))
          ) : (
            <p className="text-xs text-light-muted italic py-4 text-center">Tiada pengumuman terkini.</p>
          )}
        </div>
      </section>

      {/* ─── Active Campaign ─── */}
      {campaign && (
        <section className="animate-fade-in" style={{ animationDelay: "0.4s" }} data-facility="Infaq Campaign">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light flex items-center gap-2 mb-4">
            <IconWallet size={18} className="text-gold" />
            Kempen Infaq Aktif
          </h2>
          <CampaignCard campaign={campaign} />
        </section>
      )}

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
