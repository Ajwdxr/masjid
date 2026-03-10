"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Announcement, AnnouncementFormData } from "@/types/announcement";
import { uploadImage } from "@/lib/upload";
import { IconLoader2, IconUpload, IconTrash } from "@/components/ui/Icons";
import Swal from "sweetalert2";

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
      Swal.fire('Ralat', 'Muat naik gambar gagal. Sila cuba lagi.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleImportFromUrl = async () => {
    if (!formData.image_url || formData.image_url.includes('supabase.co')) return;

    setUploading(true);
    try {
      // Use a proxy or just try direct fetch (might fail due to CORS, but worth a try)
      const response = await fetch(formData.image_url);
      const blob = await response.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      const file = new File([blob], `imported-${Date.now()}.${ext}`, { type: blob.type });

      const newUrl = await uploadImage(file, "images", "announcements");
      setFormData({ ...formData, image_url: newUrl });
      Swal.fire('Berjaya', 'Gambar telah diimport ke storan masjid.', 'success');
    } catch (err) {
      console.error("Import failed:", err);
      Swal.fire('Ralat', 'Gagal mengimport gambar. URL mungkin tidak membenarkan akses terus (CORS). Sila muat turun dan upload secara manual.', 'warning');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-light-muted uppercase tracking-widest mb-1.5">
              Tajuk Pengumuman <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-light text-sm focus:outline-none focus:border-gold/50 transition-all"
              placeholder="Contoh: Majlis Kesyukuran"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-light-muted uppercase tracking-widest mb-1.5">
              Keterangan <span className="text-danger">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-light text-sm focus:outline-none focus:border-gold/50 transition-all resize-none"
              placeholder="Masukkan butiran lengkap..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-light-muted uppercase tracking-widest mb-1.5">
              Tarikh Acara
            </label>
            <input
              type="date"
              value={formData.event_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, event_date: e.target.value || null })
              }
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-xl text-light text-sm focus:outline-none focus:border-gold/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-light-muted uppercase tracking-widest mb-1.5">
              Gambar Pengumuman
            </label>

            <div className="space-y-4">
              {/* Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-dark-border bg-dark-surface flex items-center justify-center group">
                {formData.image_url ? (
                  <>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: null })}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                      >
                        <IconTrash size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <IconUpload size={32} className="text-light-muted/30 mb-2" />
                    <p className="text-[10px] text-light-muted font-bold uppercase tracking-widest">Tiada Gambar</p>
                  </div>
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <IconLoader2 size={32} className="text-gold animate-spin" />
                  </div>
                )}
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="file"
                    id="ann-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="ann-upload"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                  >
                    <IconUpload size={14} /> Muat Naik Fail
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formData.image_url || ""}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value || null })}
                    className="flex-1 px-3 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-[11px] text-light focus:outline-none focus:border-gold/50"
                    placeholder="Atau masukkan URL gambar..."
                  />
                  {formData.image_url && !formData.image_url.includes('supabase.co') && (
                    <button
                      type="button"
                      onClick={handleImportFromUrl}
                      className="px-3 py-2.5 bg-dark-border hover:bg-dark-border/80 text-light text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
                    >
                      Import
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${formData.is_active ? "bg-emerald" : "bg-dark-surface border border-dark-border"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-light shadow transition-transform duration-300 ${formData.is_active ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <span className="text-[10px] font-bold text-light-muted uppercase tracking-widest">
              {formData.is_active ? "Aktif" : "Tidak Aktif"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-dark-border">
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
