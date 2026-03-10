"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconClipboard, IconBroom, IconWrench, IconShield, IconCheck, IconRefresh, IconLoader2 } from "@/components/ui/Icons";
import type { Complaint, ComplaintStatus } from "@/types/complaint";
import { formatShortDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

const categoryIcons: Record<string, React.ReactNode> = {
  Kebersihan: <IconBroom size={16} />,
  Kemudahan: <IconWrench size={16} />,
  Pengurusan: <IconClipboard size={16} />,
  Keselamatan: <IconShield size={16} />,
  "Lain-lain": <IconClipboard size={16} />,
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setComplaints(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      Swal.fire({ title: 'Ralat', text: err.message, icon: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: ComplaintStatus) => {
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setComplaints(
        complaints.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );

      Swal.fire({
        title: 'Berjaya',
        text: `Status aduan telah dikemaskini kepada ${newStatus}.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error("Update error:", err);
      Swal.fire({ title: 'Ralat', text: err.message, icon: 'error' });
    }
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-2">
          <IconClipboard size={24} className="text-gold" />
          Urus Aduan
        </h1>
        <p className="text-light-muted text-sm mt-1">
          {loading ? "Memuatkan..." : `${complaints.length} aduan · ${dalamTindakan} dalam tindakan · ${selesai} selesai`}
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
            className={`px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium transition-all cursor-pointer ${filterStatus === tab.value
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-light-muted hover:text-light bg-dark-surface border border-dark-border"
              }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Complaints list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <IconLoader2 className="animate-spin text-gold" size={48} />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, index) => (
            <Card
              key={item.id}
              className="animate-fade-in border-gold/5 hover:border-gold/20 transition-all"
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
      )}

      {!loading && filtered.length === 0 && (
        <Card className="text-center py-12 border-gold/5">
          <IconClipboard size={40} className="mx-auto mb-4 text-light-muted/30" />
          <p className="text-light-muted">
            Tiada aduan untuk paparan ini.
          </p>
        </Card>
      )}
    </div>
  );
}
