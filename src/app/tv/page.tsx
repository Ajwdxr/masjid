"use client";

import { useState, useEffect, useCallback } from "react";
import { useLiveClock } from "@/hooks/useLiveClock";
import { usePrayerCountdown } from "@/hooks/usePrayerTimes";
import {
  IconMoon,
  IconSunrise,
  IconSun,
  IconCloudSun,
  IconCloud,
  IconSunset,
  IconMegaphone,
  IconCalendar,
  IconMosque,
  IconWallet,
} from "@/components/ui/Icons";
import type { PrayerTime } from "@/types/prayer";
import type { Announcement } from "@/types/announcement";

/* ─── Mock data (will be replaced by Supabase + API fetch) ─── */
const mockPrayers: PrayerTime[] = [
  { name: "Imsak", nameMs: "Imsak", time: "05:52" },
  { name: "Fajr", nameMs: "Subuh", time: "06:02" },
  { name: "Syuruk", nameMs: "Syuruk", time: "07:17" },
  { name: "Dhuhr", nameMs: "Zohor", time: "13:23" },
  { name: "Asr", nameMs: "Asar", time: "16:38" },
  { name: "Maghrib", nameMs: "Maghrib", time: "19:22" },
  { name: "Isha", nameMs: "Isyak", time: "20:34" },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Ceramah Khas Ramadan",
    description: "Ceramah khas sempena bulan Ramadan bersama Ustaz Ahmad bin Abdullah. Semua jemaah dijemput hadir selepas solat Isyak.",
    image_url: null,
    event_date: "2026-03-15",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "2",
    title: "Program Tadarus Al-Quran",
    description: "Program tadarus Al-Quran sepanjang bulan Ramadan bermula selepas solat Subuh hingga Syuruk setiap hari.",
    image_url: null,
    event_date: "2026-03-05",
    is_active: true,
    created_at: "2026-03-01",
  },
  {
    id: "3",
    title: "Gotong-Royong Masjid",
    description: "Gotong-royong pembersihan dan penyelenggaraan masjid. Semua sukarelawan dijemput hadir dari jam 8 pagi.",
    image_url: null,
    event_date: "2026-03-10",
    is_active: true,
    created_at: "2026-02-28",
  },
  {
    id: "4",
    title: "Majlis Iftar Perdana",
    description: "Majlis iftar perdana bersama YB Dato' Menteri Besar Kedah dan barisan pentadbir masjid.",
    image_url: null,
    event_date: "2026-03-12",
    is_active: true,
    created_at: "2026-02-22",
  },
];

const prayerIcons: Record<string, React.ReactNode> = {
  Imsak: <IconMoon size={28} />,
  Fajr: <IconSunrise size={28} />,
  Syuruk: <IconSun size={28} />,
  Dhuhr: <IconCloudSun size={28} />,
  Asr: <IconCloud size={28} />,
  Maghrib: <IconSunset size={28} />,
  Isha: <IconMoon size={28} />,
};

export default function TVPage() {
  const { formattedTime } = useLiveClock();
  const { nextPrayer, countdown } = usePrayerCountdown(mockPrayers);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");

  // Rotate announcements every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockAnnouncements.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Set dates on client
  useEffect(() => {
    const now = new Date();
    setGregorianDate(
      now.toLocaleDateString("ms-MY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    try {
      setHijriDate(
        new Intl.DateTimeFormat("ms-MY-u-ca-islamic", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(now) + "H"
      );
    } catch {
      setHijriDate("");
    }
  }, []);

  // Auto-refresh page every 30 seconds (for prayer time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      // In production this would refetch from API
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const displayPrayers = mockPrayers.filter((p) => p.name !== "Imsak");
  const currentAnn = mockAnnouncements[currentSlide];

  return (
    <div className="w-screen h-screen bg-dark text-light overflow-hidden relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23C8A951' fill-opacity='1'%3E%3Cpath d='M40 0L60 20L40 40L20 20zM40 40L60 60L40 80L20 60z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative h-full flex flex-col">
        {/* ─── Top Bar ─── */}
        <div className="flex items-center justify-between px-8 py-4 bg-dark-surface/80 border-b border-dark-border/50">
          {/* Logo & Name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center text-dark text-2xl font-bold font-[family-name:var(--font-poppins)] shadow-xl">
              Z
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] gold-text">
                Masjid Zahir
              </h1>
              <p className="text-xs text-light-muted">
                Alor Setar, Kedah Darul Aman
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="text-right">
            <p className="text-sm text-light">{gregorianDate}</p>
            {hijriDate && (
              <p className="text-xs text-gold">{hijriDate}</p>
            )}
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div className="flex-1 flex px-8 py-6 gap-6 min-h-0">
          {/* Left: Clock + Countdown */}
          <div className="flex flex-col items-center justify-center w-[40%] gap-6">
            {/* Live Clock */}
            <div className="text-center">
              <p className="text-7xl xl:text-8xl font-bold font-[family-name:var(--font-poppins)] gold-text tracking-wider tabular-nums">
                {formattedTime}
              </p>
            </div>

            {/* Countdown */}
            {countdown && nextPrayer && (
              <div className="text-center w-full max-w-md p-6 rounded-2xl bg-emerald/10 border border-emerald/20">
                <p className="text-sm text-emerald-light uppercase tracking-widest font-medium mb-2">
                  Waktu {nextPrayer.nameMs} dalam
                </p>
                <p className="text-5xl xl:text-6xl font-bold font-[family-name:var(--font-poppins)] text-light tabular-nums">
                  {String(countdown.hours).padStart(2, "0")}
                  <span className="text-gold mx-2">:</span>
                  {String(countdown.minutes).padStart(2, "0")}
                  <span className="text-gold mx-2">:</span>
                  {String(countdown.seconds).padStart(2, "0")}
                </p>
              </div>
            )}
          </div>

          {/* Right: Prayer Times + Announcement */}
          <div className="flex-1 flex flex-col gap-6 min-h-0">
            {/* Prayer Times Grid */}
            <div className="grid grid-cols-6 gap-3">
              {displayPrayers.map((prayer) => {
                const isNext = nextPrayer?.name === prayer.name;
                return (
                  <div
                    key={prayer.name}
                    className={`relative text-center py-5 px-3 rounded-2xl transition-all duration-500 ${
                      isNext
                        ? "bg-gold/15 border-2 border-gold/40 shadow-[0_0_25px_rgba(200,169,81,0.15)] scale-105"
                        : "bg-dark-surface/60 border border-dark-border/50"
                    }`}
                  >
                    {isNext && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <span className="inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-wider bg-gold text-dark rounded-full animate-pulse-gold">
                          Seterusnya
                        </span>
                      </div>
                    )}
                    <div className={`flex justify-center mb-2 ${isNext ? "text-gold" : "text-light-muted"}`}>
                      {prayerIcons[prayer.name] || <IconMosque size={28} />}
                    </div>
                    <p
                      className={`text-sm font-medium mb-1 ${
                        isNext ? "text-gold" : "text-light-muted"
                      }`}
                    >
                      {prayer.nameMs}
                    </p>
                    <p
                      className={`text-xl font-bold font-[family-name:var(--font-poppins)] tabular-nums ${
                        isNext ? "text-light" : "text-light/80"
                      }`}
                    >
                      {prayer.time}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Announcement Slider */}
            <div className="flex-1 rounded-2xl bg-dark-surface/60 border border-dark-border/50 p-6 flex flex-col justify-center overflow-hidden">
              <p className="text-xs text-gold uppercase tracking-widest font-medium mb-3">
                <IconMegaphone size={14} className="text-gold inline mr-1" /> Pengumuman
              </p>
              <div key={currentSlide} className="animate-fade-in">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-light mb-2">
                  {currentAnn.title}
                </h2>
                <p className="text-base text-light-muted leading-relaxed">
                  {currentAnn.description}
                </p>
                {currentAnn.event_date && (
                  <p className="text-sm text-gold mt-3">
                    <IconCalendar size={14} className="inline mr-1" />{" "}
                    {new Date(currentAnn.event_date).toLocaleDateString("ms-MY", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              {/* Slide indicators */}
              <div className="flex gap-2 mt-4">
                {mockAnnouncements.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === currentSlide
                        ? "bg-gold w-8"
                        : "bg-dark-border w-4"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Ticker ─── */}
        <div className="bg-dark-surface/90 border-t border-gold/20 py-3 overflow-hidden">
          <div className="animate-ticker whitespace-nowrap">
            <span className="inline-block text-sm">
              <span className="text-gold font-semibold mx-4">Masjid Zahir</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-light mx-4">Ceramah Khas Ramadan — 15 Mac 2026</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-light mx-4">Program Tadarus Al-Quran — Setiap hari selepas Subuh</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-gold mx-4">Tabung Masjid: RM 187,500 / RM 500,000 (38%)</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-light mx-4">Gotong-Royong Masjid — 10 Mac 2026</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-emerald-light mx-4">Zahir Digital — Sistem Pengurusan Masjid Pintar</span>
              <span className="text-light-muted mx-8"></span>
              {/* Repeat for seamless loop */}
              <span className="text-gold font-semibold mx-4">Masjid Zahir</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-light mx-4">Ceramah Khas Ramadan — 15 Mac 2026</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-light mx-4">Program Tadarus Al-Quran — Setiap hari selepas Subuh</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-gold mx-4">Tabung Masjid: RM 187,500 / RM 500,000 (38%)</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-light mx-4">Gotong-Royong Masjid — 10 Mac 2026</span>
              <span className="text-light-muted mx-4">|</span>
              <span className="text-emerald-light mx-4">Zahir Digital — Sistem Pengurusan Masjid Pintar</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
