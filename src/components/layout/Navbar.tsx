"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconHome,
  IconMegaphone,
  IconWallet,
  IconClipboard,
  IconGrid,
  IconTv,
  IconMosque,
} from "@/components/ui/Icons";

const navLinks = [
  { href: "/", label: "Utama", icon: <IconHome size={16} /> },
  { href: "/masjid", label: "Masjid", icon: <IconMosque size={16} /> },
  { href: "/announcements", label: "Pengumuman", icon: <IconMegaphone size={16} /> },
  { href: "/infaq", label: "Infaq", icon: <IconWallet size={16} /> },
  { href: "/aduan", label: "Aduan", icon: <IconClipboard size={16} /> },
  { href: "/admin", label: "Admin", icon: <IconGrid size={16} /> },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide navbar on TV route
  if (pathname?.startsWith("/tv")) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark/80 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-dark font-bold text-lg font-[family-name:var(--font-poppins)] shadow-lg group-hover:scale-105 transition-transform">
              Z
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold font-[family-name:var(--font-poppins)] gold-text leading-tight">
                Zahir Digital
              </h1>
              <p className="text-[10px] text-light-muted leading-tight">
                Masjid Zahir, Alor Setar
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-light-muted hover:text-light hover:bg-dark-surface"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/tv"
              className="ml-2 px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium text-emerald-light border border-emerald/30 hover:bg-emerald/10 transition-all duration-200 flex items-center gap-1.5"
            >
              <IconTv size={14} />
              TV
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-surface transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1">
              <span
                className={`block h-0.5 bg-light transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[3px]" : ""
                  }`}
              />
              <span
                className={`block h-0.5 bg-light transition-all duration-300 ${isOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`block h-0.5 bg-light transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[3px]" : ""
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-dark-border animate-fade-in">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-btn)] text-sm font-medium transition-all ${isActive
                      ? "bg-gold/10 text-gold"
                      : "text-light-muted hover:text-light hover:bg-dark-surface"
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/tv"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-btn)] text-sm font-medium text-emerald-light hover:bg-emerald/10 transition-all"
            >
              <IconTv size={16} />
              TV Display
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
