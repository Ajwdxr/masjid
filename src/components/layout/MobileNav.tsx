"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Utama", icon: "🏠" },
  { href: "/announcements", label: "Pengumuman", icon: "📢" },
  { href: "/infaq", label: "Infaq", icon: "💰" },
  { href: "/aduan", label: "Aduan", icon: "📝" },
  { href: "/admin", label: "Admin", icon: "⚙️" },
];

export function MobileNav() {
  const pathname = usePathname();

  // Hide on TV route
  if (pathname?.startsWith("/tv")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-xl border-t border-dark-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-gold scale-105"
                  : "text-light-muted hover:text-light"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
