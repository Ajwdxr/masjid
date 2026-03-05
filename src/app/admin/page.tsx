"use client";

import Link from "next/link";
import { AnalyticsOverview } from "@/components/admin/AnalyticsOverview";

const stats = [
  { 
    label: "Total Donations", 
    value: "124.5", 
    suffix: "k", 
    trend: "+12% from last month", 
    trendType: "up", 
    icon: "payments" 
  },
  { 
    label: "Campaign Impact", 
    value: "85", 
    suffix: "%", 
    trend: "Active Participation", 
    trendType: "up", 
    icon: "campaign" 
  },
  { 
    label: "Pending Issues", 
    value: "42", 
    suffix: "", 
    trend: "Requires Attention", 
    trendType: "down", 
    icon: "warning" 
  },
  { 
    label: "Resolution Rate", 
    value: "92", 
    suffix: "%", 
    trend: "Efficiency Score", 
    trendType: "up", 
    icon: "check_circle" 
  },
];

const complaints = [
  { id: "CMP-001", subject: "Facility Maintenance - Main Hall AC", author: "Ahmad Ali", date: "Oct 12, 2023", status: "Dalam Tindakan" },
  { id: "CMP-002", subject: "Sound System Feedback", author: "Sarah Tan", date: "Oct 11, 2023", status: "Selesai" },
  { id: "CMP-003", subject: "Parking Availability Issue", author: "Anonymous Report", date: "Oct 10, 2023", status: "Ditolak" },
  { id: "CMP-004", subject: "Restroom Cleanliness Report", author: "Ismail Z.", date: "Oct 09, 2023", status: "Selesai" },
  { id: "CMP-005", subject: "Prayer Time Display Error", author: "Imam Shafie", date: "Oct 08, 2023", status: "Dalam Tindakan" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-10">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-8 shadow-none flex flex-col justify-between h-48 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-[#888888] text-xs uppercase tracking-widest font-medium">
                {stat.label}
              </p>
              <span className="material-symbols-outlined text-primary/40 font-light text-2xl">
                {stat.icon}
              </span>
            </div>
            <div className="mt-auto">
              <h3 className="text-primary text-5xl font-serif mb-2 tracking-tight">
                {stat.value}
                <span className="text-2xl opacity-50">{stat.suffix}</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${stat.trendType === 'up' ? 'bg-emerald-500' : stat.trendType === 'down' ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                <span className={`${stat.trendType === 'up' ? 'text-emerald-500/80' : stat.trendType === 'down' ? 'text-red-400/80' : 'text-slate-500/80'} text-xs font-medium tracking-wide`}>
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
            className="text-xs font-medium text-primary hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest"
          >
            View Archive <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="rounded-lg border border-[#333333] overflow-hidden bg-[#1A1A1A] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333333]">
                  <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888]/60">Reference</th>
                  <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888]/60 w-1/3">Subject</th>
                  <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888]/60">Date</th>
                  <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888]/60">Status</th>
                  <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888]/60 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]/50">
                {complaints.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-[#202020] transition-colors group"
                  >
                    <td className="px-8 py-6 text-sm font-mono text-[#888888]">
                      {item.id}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-200 group-hover:text-primary transition-colors">
                          {item.subject}
                        </span>
                        <span className={`text-xs text-[#888888]/60 font-light ${item.author === 'Anonymous Report' ? 'italic' : ''}`}>
                          By {item.author}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-[#888888]">
                      {item.date}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        {item.status === "Dalam Tindakan" ? (
                          <>
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            <span className="text-xs font-medium text-primary tracking-wide">
                              Dalam Tindakan
                            </span>
                          </>
                        ) : item.status === "Selesai" ? (
                          <>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-medium text-emerald-500 tracking-wide">
                              Selesai
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-600"></span>
                            <span className="text-xs font-medium text-slate-500 tracking-wide">
                              {item.status}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded hover:bg-white/5 text-[#888888] hover:text-white transition-all">
                        <span className="material-symbols-outlined font-light text-[20px]">
                          more_horiz
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 px-2">
          <span className="text-xs text-[#888888] tracking-wide uppercase">
            Showing <span className="text-slate-200 font-medium">1-5</span> of <span className="text-slate-200 font-medium">42</span>
          </span>
          <div className="flex gap-8">
            <button className="text-xs uppercase tracking-widest font-medium text-[#888888] hover:text-primary disabled:opacity-30 transition-colors" disabled>
              Previous
            </button>
            <button className="text-xs uppercase tracking-widest font-medium text-[#888888] hover:text-primary transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <AnalyticsOverview />
    </div>
  );
}
