"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Announcement, AnnouncementFormData } from "@/types/announcement";
import { uploadImage } from "@/lib/upload";
import { IconLoader2, IconUpload, IconTrash } from "@/components/ui/Icons";

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

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, "images", "announcements");
      setFormData({ ...formData, image_url: url });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Muat naik gambar gagal. Sila cuba lagi.");
    } finally {
      setUploading(false);
    }
  };

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

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-light mb-1.5">
          Gambar Pengumuman
        </label>
        <div className="space-y-3">
          {formData.image_url ? (
            <div className="relative group w-full aspect-video rounded-lg overflow-hidden border border-dark-border bg-dark-surface">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: null })}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <IconTrash size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-dark-border rounded-lg p-8 flex flex-col items-center justify-center bg-dark-surface/30 hover:bg-dark-surface/50 transition-all cursor-pointer">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <IconLoader2 size={32} className="text-gold animate-spin mb-2" />
                  <span className="text-sm text-light-muted">Memuat naik...</span>
                </div>
              ) : (
                <>
                  <IconUpload size={32} className="text-light-muted mb-2" />
                  <span className="text-sm text-light-muted">Klik atau seret gambar untuk muat naik</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-light-muted">Atau masukkan URL gambar:</label>
            <input
              type="url"
              value={formData.image_url || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image_url: e.target.value || null,
                })
              }
              className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-xs placeholder:text-light-muted/30 focus:outline-none focus:border-gold/50 transition-all"
              placeholder="https://..."
            />
          </div>
        </div>
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
          className={`relative w-11 h-6 rounded-full transition-all duration-300 ${formData.is_active
              ? "bg-emerald"
              : "bg-dark-surface border border-dark-border"
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-light shadow transition-transform duration-300 ${formData.is_active ? "translate-x-5" : "translate-x-0"
              }`}
          />
        </button>
        <span className="text-sm text-light-muted">
          {formData.is_active ? "Aktif" : "Tidak Aktif"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={uploading}>
          {announcement ? "Kemaskini" : "Tambah"} Pengumuman
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
