"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconSend, IconCheck, IconUpload, IconTrash, IconLoader2 } from "@/components/ui/Icons";
import type { ComplaintFormData, ComplaintCategory } from "@/types/complaint";
import { uploadImage } from "@/lib/upload";

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
      alert("Muat naik gambar gagal. Sila cuba lagi.");
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
          <p className="text-xs text-light-muted mt-1">
            Status: Dalam Tindakan
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-light mb-1.5">
            Kategori <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm appearance-none focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-surface">{cat}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-light-muted pointer-events-none">▾</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-light mb-1.5">
            Keterangan Aduan <span className="text-danger">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all resize-none"
            placeholder="Sila nyatakan aduan anda dengan terperinci..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-light mb-1.5">
            Lampiran Gambar (pilihan)
          </label>

          <div className="space-y-3">
            {imageUrl ? (
              <div className="relative group w-full aspect-video rounded-lg overflow-hidden border border-dark-border bg-dark-surface">
                <img
                  src={imageUrl}
                  alt="Attachment Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <IconTrash size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-dark-border rounded-lg p-6 flex flex-col items-center justify-center bg-dark-surface/30 hover:bg-dark-surface/50 transition-all cursor-pointer">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <IconLoader2 size={24} className="text-gold animate-spin mb-2" />
                    <span className="text-xs text-light-muted">Memuat naik...</span>
                  </div>
                ) : (
                  <>
                    <IconUpload size={24} className="text-light-muted mb-2" />
                    <span className="text-xs text-light-muted">Klik untuk muat naik bukti gambar</span>
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
              <label className="text-[10px] text-light-muted uppercase tracking-widest font-bold">Atau masukkan URL gambar:</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-xs placeholder:text-light-muted/30 focus:outline-none focus:border-gold/50 transition-all"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${isAnonymous ? "bg-emerald" : "bg-dark-surface border border-dark-border"
              }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-light shadow transition-transform duration-300 ${isAnonymous ? "translate-x-5" : "translate-x-0"
              }`} />
          </button>
          <span className="text-sm text-light-muted">Hantar secara tanpa nama</span>
        </div>

        <div className="p-3 rounded-lg bg-gold/5 border border-gold/10">
          <p className="text-xs text-light-muted leading-relaxed">
            Aduan anda akan direkodkan dan diproses oleh pihak pengurusan Masjid Zahir.
          </p>
        </div>

        <Button type="submit" variant="primary" className="w-full" size="lg" disabled={uploading}>
          <IconSend size={16} className="inline mr-2" />
          Hantar Aduan
        </Button>
      </form>
    </Card>
  );
}
