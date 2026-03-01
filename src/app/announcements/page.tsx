import type { Metadata } from "next";
import { AnnouncementList } from "@/components/announcements/AnnouncementList";
import { IconMegaphone } from "@/components/ui/Icons";
import type { Announcement } from "@/types/announcement";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Senarai pengumuman terkini Masjid Zahir, Alor Setar.",
};

/* ─── Mock data (will be replaced by Supabase) ─── */
const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Ceramah Khas Ramadan",
    description:
      "Ceramah khas sempena bulan Ramadan bersama Ustaz Ahmad bin Abdullah. Semua jemaah dijemput hadir selepas solat Isyak di dewan utama masjid. Tajuk ceramah: 'Menghidupkan Malam Ramadan'.",
    image_url: null,
    event_date: "2026-03-15",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "2",
    title: "Program Tadarus Al-Quran",
    description:
      "Program tadarus Al-Quran sepanjang bulan Ramadan bermula selepas solat Subuh hingga Syuruk setiap hari. Semua lapisan masyarakat dijemput untuk menyertai program ini.",
    image_url: null,
    event_date: "2026-03-05",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "3",
    title: "Gotong-Royong Masjid",
    description:
      "Gotong-royong pembersihan dan penyelenggaraan masjid. Semua sukarelawan dijemput hadir dari jam 8 pagi. Peralatan pembersihan akan disediakan. Sarapan pagi disediakan untuk semua peserta.",
    image_url: null,
    event_date: "2026-03-10",
    is_active: true,
    created_at: "2026-02-28",
  },
  {
    id: "4",
    title: "Kursus Pengurusan Jenazah",
    description:
      "Kursus pengurusan jenazah untuk ahli kariah dan masyarakat umum. Kursus ini meliputi teori dan amali pengurusan jenazah mengikut syariah. Yuran pendaftaran percuma.",
    image_url: null,
    event_date: "2026-03-20",
    is_active: true,
    created_at: "2026-02-25",
  },
  {
    id: "5",
    title: "Majlis Iftar Perdana",
    description:
      "Majlis iftar perdana bersama YB Dato' Menteri Besar Kedah dan barisan pentadbir masjid. Jemputan terbuka kepada semua jemaah tetap Masjid Zahir.",
    image_url: null,
    event_date: "2026-03-12",
    is_active: true,
    created_at: "2026-02-22",
  },
  {
    id: "6",
    title: "Penyelenggaraan Penghawa Dingin",
    description:
      "Penyelenggaraan berkala sistem penghawa dingin masjid akan dijalankan. Sedikit ketidakselesaan mungkin dialami semasa kerja-kerja penyelenggaraan.",
    image_url: null,
    event_date: "2026-02-20",
    is_active: false,
    created_at: "2026-02-15",
  },
];

export default function AnnouncementsPage() {
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
      <AnnouncementList announcements={mockAnnouncements} />
    </div>
  );
}
