"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnalyticsOverview } from "@/components/admin/AnalyticsOverview";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { IconLoader2 } from "@/components/ui/Icons";
import type { Complaint } from "@/types/complaint";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Donations", value: "0", suffix: "", trend: "Loading...", trendType: "neutral", icon: "payments" },
    { label: "Total Campaigns", value: "0", suffix: "", trend: "Active Campaigns", trendType: "up", icon: "campaign" },
    { label: "Pending Issues", value: "0", suffix: "", trend: "Aduan Aktif", trendType: "down", icon: "warning" },
    { label: "Selesai", value: "0", suffix: "", trend: "Aduan Selesai", trendType: "up", icon: "check_circle" },
  ]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // 1. Fetch Donations Sum
      const { data: donations } = await supabase.from("donations").select("amount");
      const totalRaised = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      // 2. Fetch Campaigns Count
      const { count: campaignCount } = await supabase.from("campaigns").select("*", { count: 'exact', head: true });

      // 3. Fetch Complaints Stats
      const { data: complaintsData } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
      const pendingCount = complaintsData?.filter(c => c.status === "Dalam Tindakan").length || 0;
      const solvedCount = complaintsData?.filter(c => c.status === "Selesai").length || 0;

      setStats([
        {
          label: "Total Donations",
          value: totalRaised >= 1000 ? (totalRaised / 1000).toFixed(1) : totalRaised.toString(),
          suffix: totalRaised >= 1000 ? "k" : "",
          trend: `Jumlah sumbangan terkumpul`,
          trendType: "up",
          icon: "payments"
        },
        {
          label: "Total Campaigns",
          value: (campaignCount || 0).toString(),
          suffix: "",
          trend: "Kempen Infaq Aktif",
          trendType: "up",
          icon: "campaign"
        },
        {
          label: "Pending Issues",
          value: pendingCount.toString(),
          suffix: "",
          trend: "Perlu tindakan segera",
          trendType: pendingCount > 0 ? "down" : "up",
          icon: "warning"
        },
        {
          label: "Resolution Rate",
          value: complaintsData?.length ? Math.round((solvedCount / complaintsData.length) * 100).toString() : "0",
          suffix: "%",
          trend: "Kadar penyelesaian aduan",
          trendType: "up",
          icon: "check_circle"
        },
      ]);

      setRecentComplaints(complaintsData?.slice(0, 5) || []);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-8 shadow-none flex flex-col justify-between h-52 hover:border-gold/30 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-[#888888] text-[10px] uppercase tracking-[0.2em] font-bold">
                {stat.label}
              </p>
              <span className="material-symbols-outlined text-gold/40 font-light text-2xl">
                {stat.icon}
              </span>
            </div>
            <div className="mt-auto">
              <h3 className="text-gold text-5xl font-serif mb-2 tracking-tight">
                {stat.value}
                <span className="text-2xl opacity-50 ml-1">{stat.suffix}</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${stat.trendType === 'up' ? 'bg-emerald-500' : stat.trendType === 'down' ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                <span className={`${stat.trendType === 'up' ? 'text-emerald-500/80' : stat.trendType === 'down' ? 'text-red-400/80' : 'text-slate-500/80'} text-[10px] font-bold tracking-widest uppercase`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Complaints Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#333333]/50">
          <h3 className="text-lg font-medium text-slate-200 tracking-tight font-serif italic">
            Recent Complaints
          </h3>
          <Link
            href="/admin/complaints"
            className="text-[10px] font-bold text-gold hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest"
          >
            View Archive <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="rounded-xl border border-[#333333] overflow-hidden bg-[#1A1A1A] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333333] bg-[#222222]/30">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]/60">Subject</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]/60">Category</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]/60">Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]/60">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]/60 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <IconLoader2 className="animate-spin text-gold mx-auto" size={40} />
                    </td>
                  </tr>
                ) : recentComplaints.length > 0 ? (
                  recentComplaints.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#202020] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-slate-200 group-hover:text-gold transition-colors">
                            {item.description}
                          </span>
                          <span className={`text-[10px] text-[#888888]/60 font-bold uppercase tracking-widest ${item.is_anonymous ? 'italic' : ''}`}>
                            {item.is_anonymous ? 'Anonymous' : 'Registered User'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs text-[#888888] font-bold tracking-widest uppercase">{item.category}</span>
                      </td>
                      <td className="px-8 py-6 text-xs text-[#888888]">
                        {formatShortDate(item.created_at)}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          {item.status === "Dalam Tindakan" ? (
                            <>
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                              </span>
                              <span className="text-[10px] font-bold text-gold tracking-widest uppercase">
                                Dalam Tindakan
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                              <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">
                                Selesai
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link href="/admin/complaints">
                          <button className="p-2 rounded hover:bg-white/5 text-[#888888] hover:text-white transition-all">
                            <span className="material-symbols-outlined font-light text-[20px]">
                              open_in_new
                            </span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-xs text-light-muted italic">Tiada aduan terkini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <AnalyticsOverview />
    </div>
  );
}
