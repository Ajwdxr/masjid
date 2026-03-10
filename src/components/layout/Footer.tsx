"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide on TV and admin routes
  if (pathname?.startsWith("/tv") || pathname?.startsWith("/admin"))
    return null;

  return (
    <footer className="hidden md:block border-t border-dark-border bg-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold font-[family-name:var(--font-poppins)] gold-text">
              Masjid Zahir
            </h3>
            <p className="text-xs text-light-muted mt-1">
              Jalan Kampung Perak, 05000 Alor Setar, Kedah, Malaysia
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <a
              href="https://krackeddevs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center md:items-end gap-2 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-light-muted/60 uppercase tracking-widest font-bold group-hover:text-gold transition-colors">
                    Ramadhan Challenge 2026
                  </span>
                  <span className="text-[9px] text-light-muted/40 uppercase tracking-[0.2em]">
                    By Kracked Devs
                  </span>
                </div>
                <img
                  src="/kd.png"
                  alt="KD Logo"
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                />
              </div>
            </a>
            <p className="text-[10px] text-light-muted/30 mt-4 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Zahir Digital
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
