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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-2">
          <IconChart size={24} className="text-gold" />
          Dashboard Admin
        </h1>
        <p className="text-light-muted text-sm mt-1">
          Ringkasan pengurusan Masjid Zahir
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/announcements">
          <StatsCard title="Pengumuman" value={stats.announcements.total.toString()} subtitle={`${stats.announcements.active} aktif`} icon={<IconMegaphone size={20} className="text-gold" />} />
        </Link>
        <Link href="/admin/campaigns">
          <StatsCard title="Kempen" value={stats.campaigns.total.toString()} subtitle={`RM ${stats.campaigns.collected.toLocaleString("ms-MY")} terkumpul`} icon={<IconWallet size={20} className="text-gold" />} />
        </Link>
        <Link href="/admin/donations">
          <StatsCard title="Derma" value={stats.donations.total.toString()} subtitle={`RM ${stats.donations.totalAmount.toLocaleString("ms-MY")} jumlah`} icon={<IconCreditCard size={20} className="text-gold" />} />
        </Link>
        <Link href="/admin/complaints">
          <StatsCard title="Aduan" value={stats.complaints.total.toString()} subtitle={`${stats.complaints.pending} dalam tindakan`} icon={<IconClipboard size={20} className="text-gold" />} />
        </Link>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4 flex items-center gap-2">
            <IconClock size={18} className="text-gold" />
            Aktiviti Terkini
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-surface/50 border border-dark-border/30 animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-light truncate">{item.text}</p>
                  <p className="text-xs text-light-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats Summary */}
        <Card>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4 flex items-center gap-2">
            <IconActivity size={18} className="text-gold" />
            Ringkasan
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-light-muted">Aduan Selesai</span>
                <span className="text-emerald-light font-medium">{stats.complaints.resolved}/{stats.complaints.total}</span>
              </div>
              <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                <div className="h-full bg-emerald rounded-full transition-all" style={{ width: `${(stats.complaints.resolved / stats.complaints.total) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-light-muted">Kempen Tabung Masjid</span>
                <span className="text-gold font-medium">38%</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-bar-fill h-full" style={{ width: "38%" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="text-center p-3 rounded-xl bg-gold/5 border border-gold/10">
                <p className="text-2xl font-bold gold-text font-[family-name:var(--font-poppins)]">RM 7,175</p>
                <p className="text-xs text-light-muted mt-1">Jumlah Derma</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald/5 border border-emerald/10">
                <p className="text-2xl font-bold text-emerald-light font-[family-name:var(--font-poppins)]">40%</p>
                <p className="text-xs text-light-muted mt-1">Kadar Penyelesaian</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
