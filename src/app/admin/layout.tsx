"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChart,
  IconMegaphone,
  IconWallet,
  IconCreditCard,
  IconClipboard,
  IconArrowRight,
} from "@/components/ui/Icons";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: <IconChart size={16} /> },
  { href: "/admin/announcements", label: "Pengumuman", icon: <IconMegaphone size={16} /> },
  { href: "/admin/campaigns", label: "Kempen", icon: <IconWallet size={16} /> },
  { href: "/admin/donations", label: "Derma", icon: <IconCreditCard size={16} /> },
  { href: "/admin/complaints", label: "Aduan", icon: <IconClipboard size={16} /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background-dark text-slate-100 font-sans overflow-hidden">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-darker border-r border-[#3a3528] justify-between shrink-0 h-screen overflow-y-auto">
        <div className="flex flex-col gap-6 p-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full bg-cover bg-center shrink-0 border border-primary/30"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-RxdveUt--Z7wsgn0NhiYl0wm6ci4vUBAOQ9i5bquUGzzy_D5upA4PHJ6o940oxhjqFVSzG_r2-BzpbMRKwbB_lGaJW-RzVOOm2BIy4Dl_QpYRtUio206tOPBNGt1jJ9DMHHlV7AEfwAnM2tigBJrDK6d4hKNkyeBJwdJn0sLynoN3upX3lo9DDJkXIiNvVLHfQajioBXn5BgQPy7aVwI8U0USddodhdqXAkSeIuq_pUgTWjbLlALUVtnVPLF5_BDXtSIo9oOsvI')",
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-semibold leading-tight">
                Masjid Zahir
              </h1>
              <p className="text-primary text-xs font-medium tracking-wide uppercase">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-2">
            {adminLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(link.href);

              // Map icons to Material Symbols
              const iconMap: Record<string, string> = {
                Dashboard: "dashboard",
                Pengumuman: "announcement",
                Kempen: "campaign",
                Derma: "volunteer_activism",
                Aduan: "chat_bubble",
              };
              const iconName = iconMap[link.label] || "circle";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-admin-muted hover:bg-surface-dark hover:text-white"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      isActive ? "filled" : ""
                    } transition-colors ${
                      isActive ? "text-primary" : "text-text-admin-muted group-hover:text-primary"
                    }`}
                  >
                    {iconName}
                  </span>
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[#3a3528]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-dark cursor-pointer transition-colors group">
            <div className="h-9 w-9 rounded-full bg-slate-700 overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/30">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5W_jNMw5_K6Zfq7_F2LbJ7Z40cqPgZe5gSWISQJSMEe9A9L2R8jqPZpz1w6g1SRETC58BuGKDhutbcAAGASvFzZqIOUhBUqUF_uMCr3rqe0S46lSjJTmuJRS0etrCEcEeQl8GPRS0XPqPf7u7mzEYp0vqbKoS_xZgeEeKWtOj2tj0Zs2AgZUppLvti4eWgO-oKhcvEUZ3YWeghDknGVM_FDtAqs1c9txAbitmVOP5ulOGlGSpUu-KnICvwdEXBh4YQT3-BQICWY"
                alt="Admin Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-sm font-medium truncate">
                Ustaz Ahmad
              </p>
              <p className="text-text-admin-muted text-xs truncate">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background-dark relative">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
