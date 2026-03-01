"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconClipboard, IconBroom, IconWrench, IconShield, IconCheck, IconRefresh } from "@/components/ui/Icons";
import type { Complaint, ComplaintStatus } from "@/types/complaint";
import { formatShortDate } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  Kebersihan: <IconBroom size={16} />,
  Kemudahan: <IconWrench size={16} />,
  Pengurusan: <IconClipboard size={16} />,
  Keselamatan: <IconShield size={16} />,
  "Lain-lain": <IconClipboard size={16} />,
};

/* ─── Mock data ─── */
const initialComplaints: Complaint[] = [
  {
    id: "1",
    category: "Kebersihan",
    description: "Tandas bahagian lelaki di tingkat bawah kurang bersih. Lantai basah dan tiada sabun.",
    image_url: null,
    is_anonymous: false,
    status: "Dalam Tindakan",
    created_at: "2026-02-28",
  },
  {
    id: "2",
    category: "Kemudahan",
    description: "Kipas siling di bahagian utama masjid rosak. Jemaah kurang selesa terutama waktu Zohor.",
    image_url: null,
    is_anonymous: true,
    status: "Selesai",
    created_at: "2026-02-25",
  },
  {
    id: "3",
    category: "Keselamatan",
    description: "Lampu kawasan parkir tidak berfungsi. Kawasan gelap pada waktu malam terutama selepas Isyak.",
    image_url: null,
    is_anonymous: false,
    status: "Dalam Tindakan",
    created_at: "2026-02-20",
  },
  {
    id: "4",
    category: "Pengurusan",
    description: "Cadangan untuk menambah kelas pengajian Al-Quran pada waktu petang.",
    image_url: null,
    is_anonymous: false,
    status: "Selesai",
    created_at: "2026-02-18",
  },
  {
    id: "5",
    category: "Kebersihan",
    description: "Sampah bertaburan di kawasan hadapan masjid terutama selepas majlis.",
    image_url: null,
    is_anonymous: true,
    status: "Dalam Tindakan",
    created_at: "2026-02-15",
  },
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | "all">("all");

  const handleStatusUpdate = (id: string, newStatus: ComplaintStatus) => {
    setComplaints(
      complaints.map((c) =>
        c.id === id ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
      )
    );
  };

  const filtered =
    filterStatus === "all"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const dalamTindakan = complaints.filter(
    (c) => c.status === "Dalam Tindakan"
  ).length;
  const selesai = complaints.filter((c) => c.status === "Selesai").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-2">
          <IconClipboard size={24} className="text-gold" />
          Urus Aduan
        </h1>
        <p className="text-light-muted text-sm mt-1">
          {complaints.length} aduan &middot; {dalamTindakan} dalam tindakan
          &middot; {selesai} selesai
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all" as const, label: "Semua", count: complaints.length },
          { value: "Dalam Tindakan" as const, label: "Dalam Tindakan", count: dalamTindakan },
          { value: "Selesai" as const, label: "Selesai", count: selesai },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium transition-all cursor-pointer ${
              filterStatus === tab.value
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-light-muted hover:text-light bg-dark-surface border border-dark-border"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Complaints list */}
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <Card
            key={item.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-dark-surface flex items-center justify-center text-light-muted border border-dark-border">
                  {categoryIcons[item.category] || <IconClipboard size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="gold">{item.category}</Badge>
                    <Badge
                      variant={
                        item.status === "Selesai" ? "emerald" : "warning"
                      }
                    >
                      {item.status}
                    </Badge>
                    {item.is_anonymous && (
                      <Badge variant="muted">Tanpa Nama</Badge>
                    )}
                  </div>
                  <p className="text-sm text-light leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-light-muted mt-1.5">
                    {formatShortDate(item.created_at)}
                  </p>
                </div>
              </div>

              {/* Status toggle button */}
              <div className="shrink-0">
                {item.status === "Dalam Tindakan" ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleStatusUpdate(item.id, "Selesai")
                    }
                  >
                    <IconCheck size={14} className="inline mr-1" /> Selesai
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleStatusUpdate(item.id, "Dalam Tindakan")
                    }
                  >
                    <IconRefresh size={14} className="inline mr-1" /> Buka Semula
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <IconClipboard size={40} className="mx-auto mb-4 text-light-muted/30" />
          <p className="text-light-muted">
            Tiada aduan untuk paparan ini.
          </p>
        </Card>
      )}
    </div>
  );
}
