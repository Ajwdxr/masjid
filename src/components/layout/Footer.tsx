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
          <div className="text-center md:text-right">
            <p className="text-xs text-light-muted">
              © {new Date().getFullYear()} Zahir Digital. Hak Cipta Terpelihara.
            </p>
            <p className="text-[10px] text-light-muted/60 mt-1">
              Dibangunkan untuk Masjid Zahir, Alor Setar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
