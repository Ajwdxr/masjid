import type { Metadata } from "next";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";
import { IconMegaphone, IconLoader2 } from "@/components/ui/Icons";
import type { Announcement } from "@/types/announcement";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Senarai pengumuman terkini Masjid Zahir, Alor Setar.",
};

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  const announcements: Announcement[] = data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-3">
          <IconMegaphone size={28} className="text-gold" />
          Pengumuman
        </h1>
        <p className="text-light-muted text-sm mt-2">
          Senarai pengumuman terkini dari Masjid Zahir, Alor Setar.
        </p>
      </div>

      {/* Announcements List */}
      {announcements.length > 0 ? (
        <AnnouncementList announcements={announcements} />
      ) : (
        <div className="text-center py-20 space-y-4">
          <IconMegaphone size={48} className="text-gold/20 mx-auto" />
          <p className="text-light-muted italic">Tiada pengumuman buat masa ini.</p>
        </div>
      )}
    </div>
  );
}
