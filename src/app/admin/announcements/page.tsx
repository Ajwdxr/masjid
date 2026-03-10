"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AnnouncementForm } from "@/components/announcements/AnnouncementForm";
import { IconMegaphone, IconEdit, IconTrash, IconPlus, IconCalendar, IconLoader2 } from "@/components/ui/Icons";
import type { Announcement, AnnouncementFormData } from "@/types/announcement";
import { formatShortDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setAnnouncements(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      Swal.fire({ title: 'Ralat', text: err.message, icon: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (data: AnnouncementFormData) => {
    try {
      const { error } = await supabase.from("announcements").insert([
        {
          ...data,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      Swal.fire({ title: 'Berjaya', text: 'Pengumuman telah ditambah.', icon: 'success', timer: 1500 });
      fetchAnnouncements();
      setShowForm(false);
    } catch (err: any) {
      console.error("Create error:", err);
      Swal.fire({ title: 'Ralat', text: err.message, icon: 'error' });
    }
  };

  const handleUpdate = async (data: AnnouncementFormData) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq("id", editingId);

      if (error) throw error;

      Swal.fire({ title: 'Berjaya', text: 'Pengumuman telah dikemaskini.', icon: 'success', timer: 1500 });
      fetchAnnouncements();
      setEditingId(null);
      setShowForm(false);
    } catch (err: any) {
      console.error("Update error:", err);
      Swal.fire({ title: 'Ralat', text: err.message, icon: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Adakah anda pasti?',
      text: "Pengumuman ini akan dipadamkan secara kekal.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#333333',
      confirmButtonText: 'Ya, padam!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from("announcements").delete().eq("id", id);
        if (error) throw error;
        Swal.fire('Dipadam!', 'Pengumuman telah dipadam.', 'success');
        fetchAnnouncements();
      } catch (err: any) {
        console.error("Delete error:", err);
        Swal.fire({ title: 'Ralat', text: err.message, icon: 'error' });
      }
    }
  };

  const editingAnnouncement = editingId
    ? announcements.find((a) => a.id === editingId)
    : undefined;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-2">
            <IconMegaphone size={24} className="text-gold" />
            Urus Pengumuman
          </h1>
          <p className="text-light-muted text-sm mt-1">
            {loading ? "Memuatkan..." : `${announcements.length} pengumuman`}
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
            <IconPlus size={16} className="inline mr-1" /> Tambah
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6 animate-fade-in border-gold/20">
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
      {loading ? (
        <div className="flex justify-center py-20">
          <IconLoader2 className="animate-spin text-gold" size={48} />
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item, index) => (
            <Card
              key={item.id}
              className="animate-fade-in border-gold/5 hover:border-gold/20 transition-all"
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
                        <IconCalendar size={12} className="inline mr-1" /> {formatShortDate(item.event_date)}
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
                    <IconEdit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-red-400"
                    onClick={() => handleDelete(item.id)}
                  >
                    <IconTrash size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && announcements.length === 0 && (
        <Card className="text-center py-12 border-gold/5">
          <IconMegaphone size={40} className="mx-auto mb-4 text-light-muted/30" />
          <p className="text-light-muted mb-4">Tiada pengumuman.</p>
          <Button
            variant="primary"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <IconPlus size={16} className="inline mr-1" /> Tambah Pengumuman Pertama
          </Button>
        </Card>
      )}
    </div>
  );
}
