"use client";

import type { PrayerTime as PrayerTimeType } from "@/types/prayer";
import { usePrayerCountdown } from "@/hooks/usePrayerTimes";
import {
  IconMoon,
  IconSunrise,
  IconSun,
  IconCloudSun,
  IconCloud,
  IconSunset,
} from "@/components/ui/Icons";

interface PrayerTimesProps {
  prayers: PrayerTimeType[];
}

const prayerIcons: Record<string, React.ReactNode> = {
  Imsak: <IconMoon size={22} />,
  Fajr: <IconSunrise size={22} />,
  Syuruk: <IconSun size={22} />,
  Dhuhr: <IconCloudSun size={22} />,
  Asr: <IconCloud size={22} />,
  Maghrib: <IconSunset size={22} />,
  Isha: <IconMoon size={22} />,
};

export function PrayerTimes({ prayers }: PrayerTimesProps) {
  const { nextPrayer, countdown } = usePrayerCountdown(prayers);

  // Main prayers to display (skip Imsak for dashboard)
  const displayPrayers = prayers.filter((p) => p.name !== "Imsak");

  return (
    <div className="space-y-4">
      {/* Countdown to next prayer */}
      {countdown && nextPrayer && (
        <div className="text-center p-4 rounded-xl bg-emerald/10 border border-emerald/20">
          <p className="text-xs text-emerald-light uppercase tracking-wider font-medium mb-1">
            Waktu {nextPrayer.nameMs} dalam
          </p>
          <p className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-poppins)] text-light tabular-nums">
            {String(countdown.hours).padStart(2, "0")}
            <span className="text-gold mx-1">:</span>
            {String(countdown.minutes).padStart(2, "0")}
            <span className="text-gold mx-1">:</span>
            {String(countdown.seconds).padStart(2, "0")}
          </p>
        </div>
      )}

      {/* Prayer times grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {displayPrayers.map((prayer) => {
          const isNext = nextPrayer?.name === prayer.name;
          return (
            <div
              key={prayer.name}
              className={`relative text-center p-3 rounded-xl transition-all duration-300 ${
                isNext
                  ? "bg-gold/10 border border-gold/30 shadow-[0_0_15px_rgba(200,169,81,0.1)]"
                  : "bg-dark-surface/50 border border-dark-border/50"
              }`}
            >
              {isNext && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-gold text-dark rounded-full">
                    Seterusnya
                  </span>
                </div>
              )}
              <div
                className={`flex justify-center mb-1 ${
                  isNext ? "text-gold" : "text-light-muted"
                }`}
              >
                {prayerIcons[prayer.name]}
              </div>
              <p
                className={`text-xs font-medium mb-0.5 ${
                  isNext ? "text-gold" : "text-light-muted"
                }`}
              >
                {prayer.nameMs}
              </p>
              <p
                className={`text-sm font-bold font-[family-name:var(--font-poppins)] tabular-nums ${
                  isNext ? "text-light" : "text-light/80"
                }`}
              >
                {prayer.time}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
