"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ComplaintFormData, ComplaintCategory } from "@/types/complaint";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      category,
      description,
      image_url: imageUrl || null,
      is_anonymous: isAnonymous,
    });
    // Reset
    setDescription("");
    setImageUrl("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] gold-text mb-5">
        📝 Borang Aduan
      </h2>

      {showSuccess && (
        <div className="mb-5 p-4 rounded-xl bg-emerald/15 border border-emerald/30 text-center animate-fade-in">
          <span className="text-2xl mb-2 block">✅</span>
          <p className="text-sm text-emerald-light font-medium">
            Aduan anda telah berjaya dihantar!
          </p>
          <p className="text-xs text-light-muted mt-1">
            Status: Dalam Tindakan
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-light mb-1.5">
            Kategori <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ComplaintCategory)
              }
              className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm appearance-none focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-surface">
                  {cat}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-light-muted pointer-events-none">
              ▾
            </span>
          </div>
        </div>

        {/* Description */}
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

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-light mb-1.5">
            Lampiran Gambar (pilihan)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
            placeholder="https://... (URL gambar)"
          />
          <p className="text-[11px] text-light-muted mt-1">
            Sertakan URL gambar sebagai bukti jika ada
          </p>
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
              isAnonymous
                ? "bg-emerald"
                : "bg-dark-surface border border-dark-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-light shadow transition-transform duration-300 ${
                isAnonymous ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-light-muted">
            Hantar secara tanpa nama
          </span>
        </div>

        {/* Info box */}
        <div className="p-3 rounded-lg bg-gold/5 border border-gold/10">
          <p className="text-xs text-light-muted leading-relaxed">
            ℹ️ Aduan anda akan direkodkan dan diproses oleh pihak pengurusan
            Masjid Zahir. Status aduan boleh disemak di bahagian bawah.
          </p>
        </div>

        {/* Submit */}
        <Button type="submit" variant="primary" className="w-full" size="lg">
          📤 Hantar Aduan
        </Button>
      </form>
    </Card>
  );
}
