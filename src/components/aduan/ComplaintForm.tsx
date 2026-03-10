"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconSend, IconCheck, IconUpload, IconTrash, IconLoader2 } from "@/components/ui/Icons";
import type { ComplaintFormData, ComplaintCategory } from "@/types/complaint";
import { uploadImage } from "@/lib/upload";
import Swal from "sweetalert2";

const CATEGORIES: ComplaintCategory[] = [
  "Kebersihan",
  "Kemudahan",
  "Pengurusan",
  "Keselamatan",
  "Lain-lain",
];

interface ComplaintFormProps {
  onSubmit: (data: ComplaintFormData) => void;
}

export function ComplaintForm({ onSubmit }: ComplaintFormProps) {
  const [category, setCategory] = useState<ComplaintCategory>("Kebersihan");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, "images", "complaints");
      setImageUrl(url);
    } catch (err) {
      console.error("Upload failed:", err);
      Swal.fire('Ralat', 'Gagal memuat naik gambar.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleImportFromUrl = async () => {
    if (!imageUrl || imageUrl.includes('supabase.co')) return;

    setUploading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      const file = new File([blob], `complaint-import-${Date.now()}.${ext}`, { type: blob.type });

      const newUrl = await uploadImage(file, "images", "complaints");
      setImageUrl(newUrl);
    } catch (err) {
      console.error("Import failed:", err);
      // Fail silently or show minor warning, fallback to original URL
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    onSubmit({
      category,
      description,
      image_url: imageUrl || null,
      is_anonymous: isAnonymous,
    });
    setDescription("");
    setImageUrl("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] gold-text mb-5">
        Borang Aduan
      </h2>

      {showSuccess && (
        <div className="mb-5 p-4 rounded-xl bg-emerald/15 border border-emerald/30 text-center animate-fade-in">
          <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-emerald/20 flex items-center justify-center">
            <IconCheck size={18} className="text-emerald-light" />
          </div>
          <p className="text-sm text-emerald-light font-medium">
            Aduan anda telah berjaya dihantar!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold text-light-muted uppercase tracking-widest mb-1.5">
            Kategori <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-xl text-light text-sm appearance-none focus:outline-none focus:border-gold/50 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-surface">{cat}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-light-muted pointer-events-none">▾</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-light-muted uppercase tracking-widest mb-1.5">
            Keterangan Aduan <span className="text-danger">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-xl text-light text-sm placeholder:text-light-muted/30 focus:outline-none focus:border-gold/50 resize-none"
            placeholder="Sila nyatakan aduan anda..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-light-muted uppercase tracking-widest mb-1.5">
            Lampiran Gambar (Pilihan)
          </label>

          <div className="space-y-3">
            {/* Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-dark-border bg-dark-surface flex items-center justify-center group">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <IconUpload size={24} className="text-light-muted/30 mb-2" />
                  <p className="text-[10px] text-light-muted font-bold uppercase tracking-widest">Tiada Bukti Gambar</p>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <IconLoader2 size={24} className="text-gold animate-spin" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <input
                  type="file"
                  id="comp-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="comp-upload"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                >
                  <IconUpload size={14} /> Muat Naik Bukti
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-[11px] text-light focus:outline-none focus:border-gold/50"
                  placeholder="Atau masukkan URL gambar..."
                />
                {imageUrl && !imageUrl.includes('supabase.co') && (
                  <button
                    type="button"
                    onClick={handleImportFromUrl}
                    className="px-3 py-2 bg-dark-border hover:bg-dark-border/80 text-light text-[10px] font-bold uppercase tracking-widest rounded-lg"
                  >
                    Simpan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${isAnonymous ? "bg-emerald" : "bg-dark-surface border border-dark-border"
              }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-light shadow transition-transform duration-300 ${isAnonymous ? "translate-x-5" : "translate-x-0"
              }`} />
          </button>
          <span className="text-xs font-bold text-light-muted uppercase tracking-widest">Hantar Tanpa Nama</span>
        </div>

        <Button type="submit" variant="primary" className="w-full" size="lg" disabled={uploading}>
          <IconSend size={16} className="inline mr-2" />
          Hantar Aduan
        </Button>
      </form>
    </Card>
  );
}
