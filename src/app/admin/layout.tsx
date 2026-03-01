"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/announcements", label: "Pengumuman", icon: "📢" },
  { href: "/admin/campaigns", label: "Kempen", icon: "💰" },
  { href: "/admin/donations", label: "Derma", icon: "🧾" },
  { href: "/admin/complaints", label: "Aduan", icon: "📝" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-card border-r border-dark-border">
        <div className="p-6 border-b border-dark-border">
          <h2 className="text-lg font-bold font-[family-name:var(--font-poppins)] gold-text">
            Admin Panel
          </h2>
          <p className="text-xs text-light-muted mt-1">Zahir Digital</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-btn)] text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-light-muted hover:text-light hover:bg-dark-surface"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-dark-border">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-light-muted hover:text-light transition-colors"
          >
            ← Kembali ke Laman Utama
          </Link>
        </div>
      </aside>

      {/* Mobile admin nav */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-dark-card/95 backdrop-blur-xl border-b border-dark-border overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {adminLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "text-light-muted hover:text-light"
                }`}
              >
                {link.icon} {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:p-8 p-4 pt-16 md:pt-8">
        {children}
      </div>
    </div>
  );
}
