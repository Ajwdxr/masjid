"use client";

import { useState, useEffect, useCallback } from "react";
import { useLiveClock } from "@/hooks/useLiveClock";
import { usePrayerCountdown } from "@/hooks/usePrayerTimes";
import type { PrayerTime } from "@/types/prayer";
import type { Announcement } from "@/types/announcement";
import { fetchPrayerTimes } from "@/lib/prayer-times";
import { supabase } from "@/lib/supabase";

/* ─── Mock data (will be replaced by Supabase + API fetch) ─── */
// Mock / Initial empty state for announcements if none fetched
const defaultAnnouncement: Announcement = {
  id: "0",
  title: "Selamat Datang ke Masjid Zahir",
  description: "Semoga kehadiran anda diberkati Allah SWT. Sila pastikan telefon bimbit dimatikan.",
  image_url: null,
  event_date: null,
  is_active: true,
  created_at: new Date().toISOString(),
};

export default function TVPage() {
  const { formattedTime } = useLiveClock();
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const { nextPrayer, countdown } = usePrayerCountdown(prayers);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [scales, setScales] = useState({ x: 1, y: 1 });
  const [hasInteracted, setHasInteracted] = useState(false);

  const baseWidth = 1920;
  const baseHeight = 1080;

  // Resolution scaling logic - Stretch to fill entire screen
  useEffect(() => {
    const handleResize = () => {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      setScales({
        x: sw / baseWidth,
        y: sh / baseHeight
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch real prayer times, announcements, and settings
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [hadith, setHadith] = useState({ content: "The best among you are those who have the best manners and character.", source: "Sahih Bukhari" });
  const [tickerItems, setTickerItems] = useState<string[]>([]);

  const refreshData = useCallback(async () => {
    try {
      // Fetch prayers
      const data = await fetchPrayerTimes();
      setPrayers(data.prayers);
      if (data.hijriDate) setHijriDate(data.hijriDate);

      // Fetch announcements
      const { data: annData } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (annData) setAnnouncements(annData as Announcement[]);

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*');

      settingsData?.forEach(item => {
        if (item.key === 'hadith') setHadith(item.value);
        if (item.key === 'tv_ticker') setTickerItems(item.value);
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    // Refresh every hour
    const interval = setInterval(refreshData, 3600000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Rotate announcements every 8 seconds
  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [announcements.length]);

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

  // ─── Transmission Countdown Logic ───
  const [transmission, setTransmission] = useState<{
    type: "BEFORE" | "AZAN" | "AFTER";
    prayer: PrayerTime;
    remaining: number;
  } | null>(null);

  useEffect(() => {
    const checkTransmission = () => {
      const now = new Date();
      const currentTime = now.getTime();
      let activeTransmission = null;

      // Filter to relevant prayers (Subuh, Zohor, Asar, Maghrib, Isyak)
      const mainPrayers = prayers.filter(
        (p) => !["Imsak", "Syuruk"].includes(p.name)
      );

      for (const prayer of mainPrayers) {
        const [h, m] = prayer.time.split(":").map(Number);
        const pTime = new Date();
        pTime.setHours(h, m, 0, 0);
        const pTimeMs = pTime.getTime();

        // 1. BEFORE (1 min before masuk waktu)
        if (currentTime >= pTimeMs - 60000 && currentTime < pTimeMs) {
          activeTransmission = {
            type: "BEFORE" as const,
            prayer,
            remaining: Math.ceil((pTimeMs - currentTime) / 1000),
          };
          break;
        }

        // 2. AZAN (10s beeping + 2 mins 30s display) = 160 seconds total
        if (currentTime >= pTimeMs && currentTime < pTimeMs + 160000) {
          activeTransmission = {
            type: "AZAN" as const,
            prayer,
            remaining: Math.ceil((pTimeMs + 160000 - currentTime) / 1000),
          };
          break;
        }

        // 3. AFTER (Iqamah countdown - 10 mins) = 600 seconds
        if (currentTime >= pTimeMs + 160000 && currentTime <= pTimeMs + 760000) {
          activeTransmission = {
            type: "AFTER" as const,
            prayer,
            remaining: Math.ceil((pTimeMs + 760000 - currentTime) / 1000),
          };
          break;
        }
      }
      setTransmission(activeTransmission);
    };

    const interval = setInterval(checkTransmission, 1000);
    return () => clearInterval(interval);
  }, [prayers]);

  // ─── Play Alarm Sound when Masuk Waktu (Ring 10 times) ───
  useEffect(() => {
    // Start beeping immediately when state transitions to AZAN
    if (transmission?.type === "AZAN" && transmission.remaining >= 159) {
      let count = 0;
      const playAlarm = () => {
        if (count >= 10) return;

        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Audio playback prevented by browser:", e));

        count++;
        setTimeout(playAlarm, 1000); // Ring 10 times over 10 seconds
      };

      playAlarm();
    }
  }, [transmission?.type, transmission?.remaining]);

  const displayPrayers = prayers.filter((p: PrayerTime) => p.name !== "Imsak");
  const currentAnn = announcements[currentSlide] || defaultAnnouncement;

  return (
    <div className="fixed inset-0 bg-background-dark overflow-hidden z-[100]">
      {/* ─── Interaction Gate (Force Audio) ─── */}
      {!hasInteracted && (
        <div
          className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
          onClick={() => setHasInteracted(true)}
        >
          <div className="size-32 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/40 animate-pulse">
            <span className="material-symbols-outlined text-primary text-6xl">graphic_eq</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-white mb-4">Aktifkan Audio TV</h2>
          <p className="text-slate-400 text-lg max-w-md mb-10">
            Sila klik di mana-mana sahaja untuk memulakan paparan dan mengaktifkan bunyi amaran waktu solat.
          </p>
          <button
            className="px-10 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-full hover:scale-110 transition-transform cursor-pointer shadow-[0_0_30px_rgba(200,169,81,0.3)]"
          >
            Mula Paparan
          </button>
        </div>
      )}

      <div
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scales.x}, ${scales.y})`,
          transformOrigin: "top left",
        }}
        className="text-slate-100 font-sans flex flex-col overflow-hidden selection:bg-primary selection:text-black shrink-0 relative"
      >
        {/* ─── Transmission Overlay ─── */}
        {transmission && (
          <div className="absolute inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center animate-fade-in">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent"></div>

            <div className="relative z-10 text-center space-y-12">
              <div className="size-40 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 animate-pulse">
                <span className="material-symbols-outlined text-primary text-8xl">
                  {transmission.type === "BEFORE" ? "notifications_active" : transmission.type === "AZAN" ? "volume_up" : "auto_timer"}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-primary text-3xl uppercase tracking-[0.5em] font-black">
                  {transmission.type === "BEFORE" ? "Akan Masuk Waktu" : transmission.type === "AZAN" ? "Sedang Berkumandang" : "Iqamah"}
                </p>
                <h2 className="text-9xl font-serif font-black text-white uppercase italic drop-shadow-2xl">
                  {transmission.type === "AZAN" ? "AZAN" : transmission.prayer.nameMs}
                </h2>
              </div>

              {transmission.type !== "AZAN" ? (
                <div className="flex items-center justify-center gap-12 py-12 px-24 bg-white/5 border-y border-white/10 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-[14rem] font-serif font-medium text-white leading-none tabular-nums">
                      {String(Math.floor(transmission.remaining / 60)).padStart(2, "0")}
                    </span>
                    <span className="text-2xl text-primary/60 mt-6 uppercase tracking-[0.4em] font-bold">
                      Minit
                    </span>
                  </div>
                  <span className="text-[10rem] text-primary/20 font-serif font-light -translate-y-10 animate-pulse">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[14rem] font-serif font-medium text-white leading-none tabular-nums">
                      {String(transmission.remaining % 60).padStart(2, "0")}
                    </span>
                    <span className="text-2xl text-primary/60 mt-6 uppercase tracking-[0.4em] font-bold">
                      Saat
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-20 px-24 bg-white/5 border-y border-white/10 backdrop-blur-sm">
                  <p className="text-5xl font-serif italic text-slate-300">
                    Azan {transmission.prayer.nameMs} Sedang Berkumandang
                  </p>
                </div>
              )}

              <div className="pt-8 block">
                <p className="text-slate-400 text-2xl tracking-[0.2em] uppercase font-semibold">
                  {transmission.type === "BEFORE"
                    ? "Sila kosongkan saf dan matikan telefon bimbit"
                    : transmission.type === "AZAN"
                      ? "Jawablah laungan Azan dengan sempurna"
                      : "Sila bersedia untuk menunaikan solat berjemaah"}
                </p>
              </div>
            </div>
          </div>
        )}

        <header className="flex flex-col items-center justify-center pt-8 pb-6 bg-gradient-to-b from-[#1a1814] to-background-dark shrink-0 relative z-20 border-b border-primary/10">
          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-5">
            <div className="size-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full flex items-center justify-center p-0.5 border border-primary/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <span className="material-symbols-outlined text-primary text-5xl">
                mosque
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold tracking-widest text-white uppercase font-serif">
                Masjid Zahir
              </h1>
              <p className="text-primary text-sm font-medium tracking-widest uppercase opacity-80">
                Alor Setar, Kedah
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-7xl font-bold text-white tracking-widest font-serif leading-none flex items-start drop-shadow-2xl tabular-nums">
              {formattedTime.split(" ")[0]}
              <span className="text-primary text-3xl mt-2 ml-2 font-sans font-bold tracking-normal uppercase">
                {formattedTime.split(" ")[1]}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="h-px w-12 bg-primary/30"></div>
              <div className="text-xl text-primary/90 font-medium tracking-wide font-serif">
                {hijriDate}
              </div>
              <div className="h-px w-12 bg-primary/30"></div>
            </div>
            <div className="text-slate-400 text-sm font-medium uppercase tracking-widest">
              {gregorianDate}
            </div>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-primary/70">
                <span className="material-symbols-outlined text-xl">cloud</span>
                <span className="font-bold text-xl">32°C</span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Alor Setar
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex gap-8 px-10 pb-8 min-h-0">
          {/* Left Column: Prayer Times */}
          <div className="w-[32%] flex flex-col gap-6 h-full min-h-0 mt-6">
            <div className="bg-[#12100c] rounded-none border border-primary/40 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden shrink-0 py-8 px-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
              <p className="text-primary text-xs uppercase tracking-[0.3em] font-bold z-10 mb-4 border-b border-primary/20 pb-2">
                Next Prayer In
              </p>
              {countdown && nextPrayer ? (
                <div className="flex gap-6 z-10 items-baseline">
                  <div className="flex flex-col items-center">
                    <span className="text-6xl font-serif font-medium text-white leading-none tabular-nums">
                      {String(countdown.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
                      Hour
                    </span>
                  </div>
                  <span className="text-4xl text-primary/40 font-serif font-light -translate-y-4">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-6xl font-serif font-medium text-white leading-none tabular-nums">
                      {String(countdown.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
                      Min
                    </span>
                  </div>
                  <span className="text-4xl text-primary/40 font-serif font-light -translate-y-4">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-6xl font-serif font-medium text-white leading-none tabular-nums">
                      {String(countdown.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
                      Sec
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-6 z-10 items-baseline opacity-50">
                  <span className="text-4xl font-serif text-white">-- : -- : --</span>
                </div>
              )}
              <div className="mt-4 text-slate-300 text-lg font-serif italic z-10">
                Towards{" "}
                <span className="text-primary font-normal not-italic">
                  {nextPrayer?.nameMs || "..."}
                </span>
              </div>
            </div>

            <div className="flex-1 bg-surface-dark/50 border-t border-b border-white/5 flex flex-col justify-between py-2">
              {displayPrayers.map((prayer: PrayerTime, i: number) => {
                const isActive = nextPrayer?.name === prayer.name;
                return (
                  <div
                    key={prayer.name}
                    className={`flex justify-between items-center px-6 py-4 border-b border-white/5 transition-all duration-500 ${isActive
                      ? "bg-gradient-to-r from-primary to-[#bfa140] text-black shadow-lg shadow-black/50 relative my-1 transform scale-105 z-10"
                      : i % 2 === 0
                        ? ""
                        : "bg-white/[0.02]"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
                    )}
                    <span
                      className={`${isActive
                        ? "font-bold text-xl"
                        : "text-slate-400 text-lg font-light"
                        } uppercase tracking-widest`}
                    >
                      {prayer.nameMs}
                    </span>
                    <div className="flex items-center gap-3">
                      {isActive && (
                        <span className="material-symbols-outlined animate-pulse text-2xl">
                          notifications_active
                        </span>
                      )}
                      <span
                        className={`${isActive ? "font-bold text-4xl" : "text-slate-200 text-3xl"
                          } font-serif tabular-nums`}
                      >
                        {prayer.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Announcements & Hadith */}
          <div className="w-[68%] flex flex-col gap-6 h-full min-h-0 mt-6">
            <div className="flex-1 bg-[#161410] overflow-hidden relative group border border-white/5 shadow-2xl flex">
              {/* Background Layer: Blurred Atmosphere */}
              <div className="absolute inset-0 z-0">
                <div
                  className="w-full h-full bg-cover bg-center blur-3xl opacity-30 transition-all duration-1000"
                  style={{
                    backgroundImage: `url('${currentAnn.image_url || "https://images.unsplash.com/photo-1542668595-df7148530663?q=80&w=1920"}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161410] via-transparent to-[#161410]/50 z-10"></div>
                {!currentAnn.image_url && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#161410] via-[#161410]/40 to-transparent z-10"></div>
                )}
              </div>

              {/* Content Layer */}
              <div className="relative z-20 w-full h-full flex animate-fade-in" key={currentAnn.id}>
                {/* Text Side */}
                <div className={`${currentAnn.image_url ? 'w-[55%]' : 'w-full'} flex flex-col justify-end p-12 transition-all duration-700`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-12 bg-primary"></div>
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-sm">
                      Pengumuman Utama
                    </span>
                  </div>
                  <h2 className={`${currentAnn.image_url ? 'text-5xl' : 'text-7xl'} font-bold text-white leading-tight mb-8 font-serif drop-shadow-2xl transition-all`}>
                    {currentAnn.title}
                  </h2>
                  <div className="flex items-center gap-12 pt-8 border-t border-white/10">
                    <div className="max-w-md">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">
                        Huraian
                      </p>
                      <p className={`${currentAnn.image_url ? 'text-xl' : 'text-2xl'} text-slate-200 font-serif line-clamp-3 leading-relaxed transition-all italic`}>
                        "{currentAnn.description}"
                      </p>
                    </div>
                    {currentAnn.event_date && (
                      <div className="shrink-0">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">
                          Tarikh Acara
                        </p>
                        <p className="text-2xl text-primary font-serif font-black">
                          {new Date(currentAnn.event_date).toLocaleDateString("ms-MY", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Side (Fits without cropping) */}
                {currentAnn.image_url && (
                  <div className="w-[45%] h-full p-12 flex items-center justify-center">
                    <div className="relative w-full h-full max-h-[80%] flex items-center justify-center">
                      {/* Shadow/Glow effect behind image */}
                      <div className="absolute inset-4 bg-primary/20 blur-3xl rounded-full"></div>
                      <img
                        src={currentAnn.image_url}
                        alt=""
                        className="relative z-10 max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 scale-105 animate-float"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-32 bg-[#1a1814] border-l-4 border-primary flex items-center relative overflow-hidden px-8 shadow-lg">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1a1814] to-transparent z-10"></div>
              <div className="absolute -right-10 -bottom-10 text-primary/5">
                <span className="material-symbols-outlined text-[180px]">
                  format_quote
                </span>
              </div>
              <div className="flex items-center gap-8 w-full z-20">
                <div className="flex flex-col items-center justify-center shrink-0 pr-8 border-r border-white/10">
                  <span className="material-symbols-outlined text-primary text-4xl mb-1">
                    lightbulb
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest text-center w-max">
                    Hadith of
                    <br />
                    the Day
                  </span>
                </div>
                <div>
                  <p className="text-xl text-slate-200 font-serif italic leading-relaxed">
                    "{hadith.content}"
                  </p>
                  <p className="text-primary/70 text-sm mt-2 font-medium uppercase tracking-wide">
                    — {hadith.source}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="h-12 bg-[#080705] border-t border-primary/20 flex items-center overflow-hidden relative shrink-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
          <div className="bg-[#0f0e0b] h-full px-8 flex items-center justify-center z-30 border-r border-primary/30 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
            <span className="text-primary text-sm font-black uppercase tracking-[0.3em] relative">
              Updates
            </span>
          </div>
          <div className="flex-1 overflow-hidden h-full flex items-center">
            <div className="marquee-content flex items-center gap-32 px-10 text-lg font-medium text-slate-300 animate-ticker whitespace-nowrap">
              {tickerItems.length > 0 ? (
                tickerItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>Selamat Datang ke Masjid Zahir, Alor Setar</span>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
