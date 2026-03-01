"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AnnouncementForm } from "@/components/announcements/AnnouncementForm";
import type { Announcement, AnnouncementFormData } from "@/types/announcement";
import { formatShortDate } from "@/lib/utils";

/* ─── Mock data (will be replaced by Supabase) ─── */
const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Ceramah Khas Ramadan",
    description:
      "Ceramah khas sempena bulan Ramadan bersama Ustaz Ahmad bin Abdullah.",
    image_url: null,
    event_date: "2026-03-15",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "2",
    title: "Program Tadarus Al-Quran",
    description:
      "Program tadarus Al-Quran sepanjang bulan Ramadan bermula selepas solat Subuh.",
    image_url: null,
    event_date: "2026-03-05",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "3",
    title: "Gotong-Royong Masjid",
    description:
      "Gotong-royong pembersihan dan penyelenggaraan masjid. Sukarelawan dijemput hadir.",
    image_url: null,
    event_date: "2026-03-10",
    is_active: true,
    created_at: "2026-02-28",
  },
  {
    id: "4",
    title: "Kursus Pengurusan Jenazah",
    description: "Kursus pengurusan jenazah untuk ahli kariah dan masyarakat umum.",
    image_url: null,
    event_date: "2026-03-20",
    is_active: true,
    created_at: "2026-02-25",
  },
  {
    id: "5",
    title: "Majlis Iftar Perdana",
    description: "Majlis iftar perdana bersama YB Dato' Menteri Besar Kedah.",
    image_url: null,
    event_date: "2026-03-12",
    is_active: true,
    created_at: "2026-02-22",
  },
];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = (data: AnnouncementFormData) => {
    const newAnnouncement: Announcement = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowForm(false);
  };

  const handleUpdate = (data: AnnouncementFormData) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === editingId ? { ...a, ...data, updated_at: new Date().toISOString() } : a
      )
    );
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Adakah anda pasti mahu padam pengumuman ini?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const editingAnnouncement = editingId
    ? announcements.find((a) => a.id === editingId)
    : undefined;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] gold-text">
            📢 Urus Pengumuman
          </h1>
          <p className="text-light-muted text-sm mt-1">
            {announcements.length} pengumuman
          </p>
        </div>
        {!showForm && (
          <Button
            variant="primary"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Tambah
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4">
            {editingId ? "Kemaskini Pengumuman" : "Tambah Pengumuman Baru"}
          </h2>
          <AnnouncementForm
            announcement={editingAnnouncement}
            onSubmit={editingId ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          />
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {announcements.map((item, index) => (
          <Card
            key={item.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-light text-sm">
                    {item.title}
                  </h3>
                  {item.is_active ? (
                    <Badge variant="emerald">Aktif</Badge>
                  ) : (
                    <Badge variant="muted">Tidak aktif</Badge>
                  )}
                </div>
                <p className="text-xs text-light-muted line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {item.event_date && (
                    <span className="text-xs text-gold">
                      📅 {formatShortDate(item.event_date)}
                    </span>
                  )}
                  <span className="text-xs text-light-muted">
                    Ditambah: {formatShortDate(item.created_at)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setShowForm(true);
                  }}
                >
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <Card className="text-center py-12">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-light-muted mb-4">Tiada pengumuman.</p>
          <Button
            variant="primary"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Tambah Pengumuman Pertama
          </Button>
        </Card>
      )}
    </div>
  );
}
