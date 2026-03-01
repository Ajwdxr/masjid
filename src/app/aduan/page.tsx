"use client";

import { useState } from "react";
import { ComplaintForm } from "@/components/aduan/ComplaintForm";
import { ComplaintList } from "@/components/aduan/ComplaintList";
import type { Complaint, ComplaintFormData } from "@/types/complaint";

/* ─── Mock data ─── */
const initialComplaints: Complaint[] = [
  {
    id: "1",
    category: "Kebersihan",
    description:
      "Tandas bahagian lelaki di tingkat bawah kurang bersih. Lantai basah dan tiada sabun.",
    image_url: null,
    is_anonymous: false,
    status: "Dalam Tindakan",
    created_at: "2026-02-28",
  },
  {
    id: "2",
    category: "Kemudahan",
    description:
      "Kipas siling di bahagian utama masjid rosak. Jemaah kurang selesa terutama waktu Zohor.",
    image_url: null,
    is_anonymous: true,
    status: "Selesai",
    created_at: "2026-02-25",
  },
  {
    id: "3",
    category: "Keselamatan",
    description:
      "Lampu kawasan parkir tidak berfungsi. Kawasan gelap pada waktu malam terutama selepas Isyak.",
    image_url: null,
    is_anonymous: false,
    status: "Dalam Tindakan",
    created_at: "2026-02-20",
  },
];

export default function AduanPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  const handleSubmit = (data: ComplaintFormData) => {
    const newComplaint: Complaint = {
      ...data,
      id: Date.now().toString(),
      status: "Dalam Tindakan",
      created_at: new Date().toISOString(),
    };
    setComplaints([newComplaint, ...complaints]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-poppins)] gold-text">
          📝 Aduan & Maklum Balas
        </h1>
        <p className="text-light-muted text-sm mt-2">
          Sampaikan aduan atau maklum balas anda untuk penambahbaikan Masjid
          Zahir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form — wider */}
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <ComplaintForm onSubmit={handleSubmit} />
        </div>

        {/* Complaints list */}
        <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4">
            📋 Senarai Aduan ({complaints.length})
          </h2>
          <ComplaintList complaints={complaints} />
        </div>
      </div>
    </div>
  );
}
