"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconMegaphone,
  IconWallet,
  IconClipboard,
} from "@/components/ui/Icons";

const tabs = [
  { href: "/", label: "Utama", icon: <IconHome size={20} /> },
  { href: "/announcements", label: "Info", icon: <IconMegaphone size={20} /> },
  { href: "/infaq", label: "Infaq", icon: <IconWallet size={20} /> },
  { href: "/aduan", label: "Aduan", icon: <IconClipboard size={20} /> },
];

export function MobileNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/tv") || pathname?.startsWith("/admin"))
    return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-surface/95 backdrop-blur-xl border-t border-dark-border">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all ${
                isActive ? "text-gold" : "text-light-muted"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-6 h-0.5 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
