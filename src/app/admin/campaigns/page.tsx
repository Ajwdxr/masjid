"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Campaign, CampaignFormData } from "@/types/campaign";
import { formatCurrency, calcPercentage, formatShortDate } from "@/lib/utils";

/* ─── Mock data ─── */
const initialCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Tabung Penyelenggaraan Masjid 2026",
    description:
      "Sumbangan untuk penyelenggaraan dan pembaikan kemudahan Masjid Zahir.",
    target_amount: 500000,
    collected_amount: 187500,
    end_date: "2026-12-31",
    is_active: true,
    qr_code_url: null,
    payment_link: null,
    created_at: "2026-01-01",
  },
  {
    id: "2",
    title: "Tabung Bina Surau Kampung",
    description:
      "Membantu pembinaan surau baru di Kampung Perak untuk kemudahan penduduk.",
    target_amount: 150000,
    collected_amount: 45000,
    end_date: "2026-06-30",
    is_active: true,
    qr_code_url: null,
    payment_link: null,
    created_at: "2026-02-01",
  },
];

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    target_amount: 0,
    end_date: "",
    is_active: true,
    qr_code_url: null,
    payment_link: null,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      target_amount: 0,
      end_date: "",
      is_active: true,
      qr_code_url: null,
      payment_link: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      title: campaign.title,
      description: campaign.description,
      target_amount: campaign.target_amount,
      end_date: campaign.end_date,
      is_active: campaign.is_active,
      qr_code_url: campaign.qr_code_url,
      payment_link: campaign.payment_link,
    });
    setEditingId(campaign.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCampaigns(
        campaigns.map((c) =>
          c.id === editingId
            ? { ...c, ...formData, updated_at: new Date().toISOString() }
            : c
        )
      );
    } else {
      const newCampaign: Campaign = {
        ...formData,
        id: Date.now().toString(),
        collected_amount: 0,
        created_at: new Date().toISOString(),
      };
      setCampaigns([newCampaign, ...campaigns]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Adakah anda pasti mahu padam kempen ini?")) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] gold-text">
            💰 Urus Kempen
          </h1>
          <p className="text-light-muted text-sm mt-1">
            {campaigns.length} kempen
          </p>
        </div>
        {!showForm && (
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
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
            {editingId ? "Kemaskini Kempen" : "Tambah Kempen Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light mb-1.5">
                Nama Kempen <span className="text-danger">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                placeholder="Masukkan nama kempen..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light mb-1.5">
                Keterangan <span className="text-danger">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all resize-none"
                placeholder="Masukkan keterangan..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light mb-1.5">
                  Sasaran (RM) <span className="text-danger">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.target_amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target_amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light mb-1.5">
                  Tarikh Tamat <span className="text-danger">*</span>
                </label>
                <input
                  required
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light mb-1.5">
                  URL QR Code
                </label>
                <input
                  type="url"
                  value={formData.qr_code_url || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qr_code_url: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light mb-1.5">
                  Link Pembayaran
                </label>
                <input
                  type="url"
                  value={formData.payment_link || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_link: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="https://toyyibpay.com/..."
                />
              </div>
            </div>
            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
                className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
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
                {editingId ? "Kemaskini" : "Tambah"} Kempen
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Campaign List */}
      <div className="space-y-3">
        {campaigns.map((campaign, index) => {
          const pct = calcPercentage(
            campaign.collected_amount,
            campaign.target_amount
          );
          return (
            <Card
              key={campaign.id}
              className="animate-fade-in"
              style={
                { animationDelay: `${index * 0.05}s` } as React.CSSProperties
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-light text-sm">
                      {campaign.title}
                    </h3>
                    {campaign.is_active ? (
                      <Badge variant="emerald">Aktif</Badge>
                    ) : (
                      <Badge variant="muted">Tidak aktif</Badge>
                    )}
                  </div>
                  <p className="text-xs text-light-muted line-clamp-1 mb-2">
                    {campaign.description}
                  </p>
                  {/* Mini progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-dark-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald to-gold rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gold font-medium shrink-0">
                      {pct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-light-muted">
                    <span>
                      {formatCurrency(campaign.collected_amount)} /{" "}
                      {formatCurrency(campaign.target_amount)}
                    </span>
                    <span>Tamat: {formatShortDate(campaign.end_date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(campaign)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
