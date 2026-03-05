"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const adminLinks = [
  { href: "/admin", label: "Overview", icon: "dashboard" },
  { href: "/admin/mosque-profile", label: "Mosque Profile", icon: "mosque" },
  { href: "/admin/announcements", label: "Announcements", icon: "campaign" },
  { href: "/admin/campaigns", label: "Campaigns", icon: "flag" },
  { href: "/admin/donations", label: "Donations", icon: "volunteer_activism" },
  { href: "/admin/complaints", label: "Complaints", icon: "report_problem" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background-dark text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex flex-col border-r border-[#333333] bg-[#1A1A1A] shrink-0 h-screen sticky top-0 transition-all duration-300 z-30">
        <div className="p-6 flex items-center gap-4 justify-center lg:justify-start">
          <div 
            className="size-10 bg-center bg-no-repeat bg-cover rounded-full shadow-lg border border-primary/20 shrink-0" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCRIlF417Nrsn469D9Vxq4hcQUuj9oMKcTDMAl6Q3AA2vw2PSBCUCeqA9DzjIy0V36TooicVau1Snvn84FYUJUs5rtWrKun3jKsV9fu0gf87ym_oGb5bd0OFsrWa94XbCQV6u6XGfMHC6yTfzXTJKHatHYiyiy2SSfyyQOoqw06QXjkVsePuZCY1R5_g1_lXvA2M3j2OJLbDhro9UueZ3L2fUtWjmtJ-xoxxetXClr1Nw9dlfVakQ2Q1fDyamy5DT4nmYHfM7CFKf0")' }}
          ></div>
          <div className="hidden lg:flex flex-col">
            <h1 className="text-white text-base font-semibold leading-tight tracking-wide font-serif">
              MASJID ZAHIR
            </h1>
            <p className="text-[#8a7e58] text-[10px] font-medium uppercase tracking-[0.15em] mt-1">
              Executive
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 py-6 overflow-y-auto">
          {adminLinks.map((link) => {
            const isActive = link.href === "/admin" 
              ? pathname === "/admin" 
              : pathname?.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all border-l-2 group ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-[#888888] hover:bg-[#252525] hover:text-slate-200 border-transparent"
                }`}
              >
                <span className={`material-symbols-outlined font-light text-[22px] ${isActive ? 'filled' : ''}`}>
                  {link.icon}
                </span>
                <span className="hidden lg:block text-sm font-medium tracking-wide">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-[#333333]">
          <Link 
            href="/"
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-[#888888] hover:bg-red-900/10 hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined font-light text-[22px]">logout</span>
            <span className="hidden lg:block text-sm font-medium tracking-wide">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#111111]">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#111111]/95 backdrop-blur-sm px-10 py-8 flex justify-between items-center border-b border-transparent shrink-0">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-primary font-medium tracking-widest uppercase mb-1">
              {pathname === '/admin' ? 'Overview' : (pathname?.split('/').pop() || '')}
            </p>
            <h2 className="text-3xl font-serif font-medium text-white tracking-tight">
              {pathname === '/admin' ? 'Dashboard' : ((pathname?.split('/').pop()?.charAt(0).toUpperCase() || '') + (pathname?.split('/').pop()?.slice(1) || ''))}
            </h2>
          </div>
          <div className="flex items-center gap-6 text-slate-100">
            <button className="relative p-2 text-[#888888] hover:text-primary transition-colors">
              <span className="material-symbols-outlined font-light text-[24px]">notifications</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-[#111111]"></span>
            </button>
            <div className="h-6 w-[1px] bg-[#333333]"></div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-200">Administrator</p>
                <p className="text-xs text-[#888888]">Masjid Zahir</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#333333] bg-[#1A1A1A] flex items-center justify-center text-primary font-serif font-bold text-lg shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-6 max-w-[1920px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
