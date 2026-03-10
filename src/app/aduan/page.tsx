"use client";

import { useState, useEffect } from "react";
import { ComplaintForm } from "@/components/aduan/ComplaintForm";
import { ComplaintList } from "@/components/aduan/ComplaintList";
import { IconClipboard, IconLoader2 } from "@/components/ui/Icons";
import type { Complaint, ComplaintFormData } from "@/types/complaint";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function AduanPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setComplaints(data as Complaint[]);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (data: ComplaintFormData) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .insert([{
          category: data.category,
          description: data.description,
          image_url: data.image_url,
          is_anonymous: data.is_anonymous,
          status: "Dalam Tindakan",
          profile_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      Swal.fire({
        title: 'Berjaya!',
        text: 'Aduan anda telah dihantar.',
        icon: 'success',
        confirmButtonColor: '#D4AF37'
      });

      fetchComplaints();
    } catch (error: any) {
      console.error('Submit error:', error);
      Swal.fire({
        title: 'Ralat',
        text: error.message || 'Gagal menghantar aduan.',
        icon: 'error'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-3">
          <IconClipboard size={28} className="text-gold" />
          Aduan & Maklum Balas
        </h1>
        <p className="text-light-muted text-sm mt-2">
          Sampaikan aduan atau maklum balas anda untuk penambahbaikan Masjid Zahir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <ComplaintForm onSubmit={handleSubmit} />
        </div>
        <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4">
            Senarai Aduan ({complaints.length})
          </h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <IconLoader2 className="animate-spin text-gold" size={32} />
            </div>
          ) : (
            <ComplaintList complaints={complaints} />
          )}
        </div>
      </div>
    </div>
  );
}
