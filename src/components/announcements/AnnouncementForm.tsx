"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Announcement, AnnouncementFormData } from "@/types/announcement";

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSubmit: (data: AnnouncementFormData) => void;
  onCancel: () => void;
}

export function AnnouncementForm({
  announcement,
  onSubmit,
  onCancel,
}: AnnouncementFormProps) {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: announcement?.title || "",
    description: announcement?.description || "",
    image_url: announcement?.image_url || null,
    event_date: announcement?.event_date || null,
    is_active: announcement?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-light mb-1.5">
          Tajuk Pengumuman <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
          placeholder="Masukkan tajuk..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-light mb-1.5">
          Keterangan <span className="text-danger">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all resize-none"
          placeholder="Masukkan keterangan..."
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-light mb-1.5">
          URL Gambar
        </label>
        <input
          type="url"
          value={formData.image_url || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              image_url: e.target.value || null,
            })
          }
          className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
          placeholder="https://..."
        />
      </div>

      {/* Event Date */}
      <div>
        <label className="block text-sm font-medium text-light mb-1.5">
          Tarikh Acara
        </label>
        <input
          type="date"
          value={formData.event_date || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              event_date: e.target.value || null,
            })
          }
          className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all [color-scheme:dark]"
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, is_active: !formData.is_active })
          }
          className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
            formData.is_active
              ? "bg-emerald"
              : "bg-dark-surface border border-dark-border"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-light shadow transition-transform duration-300 ${
              formData.is_active ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-light-muted">
          {formData.is_active ? "Aktif" : "Tidak Aktif"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary">
          {announcement ? "Kemaskini" : "Tambah"} Pengumuman
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
