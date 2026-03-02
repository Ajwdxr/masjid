import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { IconChart, IconMegaphone, IconWallet, IconCreditCard, IconClipboard, IconClock, IconActivity } from "@/components/ui/Icons";
import Link from "next/link";

/* ─── Mock stats ─── */
const stats = {
  announcements: { total: 5, active: 4 },
  campaigns: { total: 2, active: 2, collected: 232500 },
  donations: { total: 8, totalAmount: 7175 },
  complaints: { total: 5, pending: 3, resolved: 2 },
};

const recentActivity = [
  { type: "donation", text: "Ahmad bin Ismail menderma RM 500", time: "1 jam lepas", icon: <IconCreditCard size={16} className="text-gold" /> },
  { type: "complaint", text: "Aduan kebersihan baru diterima", time: "3 jam lepas", icon: <IconClipboard size={16} className="text-gold" /> },
  { type: "announcement", text: "Ceramah Khas Ramadan ditambah", time: "5 jam lepas", icon: <IconMegaphone size={16} className="text-gold" /> },
  { type: "donation", text: "Tanpa Nama menderma RM 100", time: "1 hari lepas", icon: <IconCreditCard size={16} className="text-gold" /> },
  { type: "campaign", text: "Kempen surau kampung dikemaskini", time: "2 hari lepas", icon: <IconWallet size={16} className="text-gold" /> },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col h-full bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#3a3528]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-text-admin-muted text-sm mt-1">
            General management overview of Masjid Zahir.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-text-admin-muted hover:text-white transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="bg-primary hover:bg-primary-dark text-background-dark font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            <span>Refresh State</span>
          </button>
        </div>
      </header>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/announcements" className="group">
              <div className="bg-surface-dark rounded-xl p-5 border border-[#3a3528] group-hover:border-primary/50 transition-all flex flex-col gap-1">
                <span className="text-text-admin-muted text-xs uppercase tracking-wider font-semibold">
                  Announcements
                </span>
                <span className="text-3xl font-bold text-white">
                  {stats.announcements.total}
                </span>
                <span className="text-primary text-xs flex items-center mt-1">
                  <span className="material-symbols-outlined text-[16px] mr-1">
                    campaign
                  </span>{" "}
                  {stats.announcements.active} Active
                </span>
              </div>
            </Link>
            <Link href="/admin/campaigns" className="group">
              <div className="bg-surface-dark rounded-xl p-5 border border-[#3a3528] group-hover:border-primary/50 transition-all flex flex-col gap-1">
                <span className="text-text-admin-muted text-xs uppercase tracking-wider font-semibold">
                  Campaigns
                </span>
                <span className="text-3xl font-bold text-white">
                  {stats.campaigns.total}
                </span>
                <span className="text-green-500 text-xs flex items-center mt-1">
                  <span className="material-symbols-outlined text-[16px] mr-1">
                    trending_up
                  </span>{" "}
                  RM {stats.campaigns.collected.toLocaleString()}
                </span>
              </div>
            </Link>
            <Link href="/admin/donations" className="group">
              <div className="bg-surface-dark rounded-xl p-5 border border-[#3a3528] group-hover:border-primary/50 transition-all flex flex-col gap-1">
                <span className="text-text-admin-muted text-xs uppercase tracking-wider font-semibold">
                  Donations
                </span>
                <span className="text-3xl font-bold text-white">
                  {stats.donations.total}
                </span>
                <span className="text-primary text-xs flex items-center mt-1">
                  <span className="material-symbols-outlined text-[16px] mr-1">
                    payments
                  </span>{" "}
                  RM {stats.donations.totalAmount.toLocaleString()}
                </span>
              </div>
            </Link>
            <Link href="/admin/complaints" className="group">
              <div className="bg-surface-dark rounded-xl p-5 border border-[#3a3528] group-hover:border-primary/50 transition-all flex flex-col gap-1">
                <span className="text-text-admin-muted text-xs uppercase tracking-wider font-semibold">
                  Complaints
                </span>
                <span className="text-3xl font-bold text-white">
                  {stats.complaints.total}
                </span>
                <span className="text-red-400 text-xs flex items-center mt-1">
                  <span className="material-symbols-outlined text-[16px] mr-1">
                    warning
                  </span>{" "}
                  {stats.complaints.pending} Pending
                </span>
              </div>
            </Link>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-surface-dark rounded-xl border border-[#3a3528] overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 border-b border-[#3a3528] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Recent Activity
                </h3>
                <span className="material-symbols-outlined text-text-admin-muted">
                  history
                </span>
              </div>
              <div className="p-4 space-y-4">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background-dark/50 border border-transparent hover:border-[#3a3528] transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                      <span className="material-symbols-outlined">
                        {item.type === "donation"
                          ? "payments"
                          : item.type === "complaint"
                          ? "assignment_late"
                          : item.type === "campaign"
                          ? "campaign"
                          : "notifications"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.text}</p>
                      <p className="text-xs text-text-admin-muted">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="space-y-6">
              <div className="bg-surface-dark rounded-xl p-6 border border-[#3a3528] shadow-sm">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    analytics
                  </span>
                  Performance Overivew
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-admin-muted">
                        Complaints Resolved
                      </span>
                      <span className="text-white font-semibold">
                        {stats.complaints.resolved}/{stats.complaints.total}
                      </span>
                    </div>
                    <div className="h-2.5 bg-background-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${
                            (stats.complaints.resolved /
                              stats.complaints.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-admin-muted">
                        Campaign Milestone (Tabung Masjid)
                      </span>
                      <span className="text-white font-semibold">45%</span>
                    </div>
                    <div className="h-2.5 bg-background-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: "45%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-background-dark rounded-xl p-4 border border-[#3a3528] text-center">
                    <p className="text-2xl font-bold text-white">RM 7.2k</p>
                    <p className="text-xs text-text-admin-muted mt-1">
                      Monthly Donation
                    </p>
                  </div>
                  <div className="bg-background-dark rounded-xl p-4 border border-[#3a3528] text-center">
                    <p className="text-2xl font-bold text-white">85%</p>
                    <p className="text-xs text-text-admin-muted mt-1">
                      Success Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
