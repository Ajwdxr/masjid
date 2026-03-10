import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { IconClipboard } from "@/components/ui/Icons";
import { PageTracker } from "@/components/analytics/PageTracker";
import { PrayerSection } from "@/components/home/PrayerSection";
import { AnnouncementsSection } from "@/components/home/AnnouncementsSection";
import { CampaignSection } from "@/components/home/CampaignSection";
import { PrayerSkeleton, SectionSkeleton } from "@/components/home/HomeSkeletons";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <PageTracker path="/" />

      {/* ─── Hero / Branding (Renders Immediately) ─── */}
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

      {/* ─── Prayer Times (Streamed) ─── */}
      <Suspense fallback={<PrayerSkeleton />}>
        <PrayerSection />
      </Suspense>

      {/* ─── Latest Announcements (Streamed) ─── */}
      <Suspense fallback={<SectionSkeleton />}>
        <AnnouncementsSection />
      </Suspense>

      {/* ─── Active Campaign (Streamed) ─── */}
      <Suspense fallback={<SectionSkeleton />}>
        <CampaignSection />
      </Suspense>

      {/* ─── Quick Action (Renders Immediately) ─── */}
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
