"use client";

import { useState, useEffect, useCallback } from "react";
import type { PrayerTime, PrayerCountdown } from "@/types/prayer";
import { getNextPrayer, getCountdown } from "@/lib/prayer-times";

/**
 * Prayer countdown hook — updates every second
 */
export function usePrayerCountdown(prayers: PrayerTime[]) {
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<PrayerCountdown | null>(null);

  const updateCountdown = useCallback(() => {
    const next = getNextPrayer(prayers);
    setNextPrayer(next);

    if (next) {
      const cd = getCountdown(next.time);
      setCountdown({
        prayer: next,
        hours: cd.hours,
        minutes: cd.minutes,
        seconds: cd.seconds,
        isNext: true,
      });
    }
  }, [prayers]);

  useEffect(() => {
    if (prayers.length === 0) return;
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayers, updateCountdown]);

  return { nextPrayer, countdown };
}
