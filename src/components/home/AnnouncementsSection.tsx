import Link from "next/link";
import { IconMegaphone } from "@/components/ui/Icons";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/types/announcement";

export async function AnnouncementsSection() {
  const supabase = await createClient();

  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const announcements: Announcement[] = announcementsData || [];

  return (
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
  );
}
