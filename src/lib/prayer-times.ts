/* ─── Prayer Times Utility ─── */
/* Uses the JAKIM e-Solat API for Kedah zone (KDH01) */

import type { PrayerTime, PrayerTimesData } from "@/types/prayer";

const ZONE = "KDH01"; // Alor Setar, Kedah
const API_URL = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${ZONE}`;

interface ESolatPrayer {
  hijri: string;
  date: string;
  day: string;
  imsak: string;
  fajr: string;
  syuruk: string;
  dhuha: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface ESolatResponse {
  prayerTime: ESolatPrayer[];
  status: string;
  serverTime: string;
  periodType: string;
  lang: string;
  zone: string;
  bearing: string;
}

/** Convert "HH:MM:SS" to "HH:MM" */
function formatTime(timeStr: string): string {
  const parts = timeStr.split(":");
  return `${parts[0]}:${parts[1]}`;
}

function parseHijriDate(hijriStr: string): string {
  // hijriStr format: "1447-09-12"
  const hijriMonths = [
    "", "Muharram", "Safar", "Rabiulawal", "Rabiulakhir",
    "Jamadilawal", "Jamadilakhir", "Rejab", "Syaaban",
    "Ramadan", "Syawal", "Zulkaedah", "Zulhijjah",
  ];

  const parts = hijriStr.split("-");
  if (parts.length !== 3) return hijriStr;

  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  return `${day} ${hijriMonths[month] || ""} ${year}H`;
}

export async function fetchPrayerTimes(): Promise<PrayerTimesData> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data: ESolatResponse = await res.json();

    if (data.status !== "OK!" || !data.prayerTime?.length) {
      throw new Error("Invalid API response");
    }

    const todayData = data.prayerTime[0];

    const prayers: PrayerTime[] = [
      { name: "Imsak", nameMs: "Imsak", time: formatTime(todayData.imsak) },
      { name: "Fajr", nameMs: "Subuh", time: formatTime(todayData.fajr) },
      { name: "Syuruk", nameMs: "Syuruk", time: formatTime(todayData.syuruk) },
      { name: "Dhuhr", nameMs: "Zohor", time: formatTime(todayData.dhuhr) },
      { name: "Asr", nameMs: "Asar", time: formatTime(todayData.asr) },
      { name: "Maghrib", nameMs: "Maghrib", time: formatTime(todayData.maghrib) },
      { name: "Isha", nameMs: "Isyak", time: formatTime(todayData.isha) },
    ];

    const today = new Date();

    return {
      date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
      hijriDate: parseHijriDate(todayData.hijri),
      zone: ZONE,
      prayers,
    };
  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    return getDefaultPrayerTimes();
  }
}

function getDefaultPrayerTimes(): PrayerTimesData {
  const today = new Date();
  return {
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
    hijriDate: "",
    zone: ZONE,
    prayers: [
      { name: "Imsak", nameMs: "Imsak", time: "06:12" },
      { name: "Fajr", nameMs: "Subuh", time: "06:22" },
      { name: "Syuruk", nameMs: "Syuruk", time: "07:29" },
      { name: "Dhuhr", nameMs: "Zohor", time: "13:33" },
      { name: "Asr", nameMs: "Asar", time: "16:50" },
      { name: "Maghrib", nameMs: "Maghrib", time: "19:32" },
      { name: "Isha", nameMs: "Isyak", time: "20:42" },
    ],
  };
}

/**
 * Find the next prayer based on current time
 */
export function getNextPrayer(prayers: PrayerTime[]): PrayerTime | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Skip Imsak and Syuruk for "next prayer" countdown (not obligatory)
  const mainPrayers = prayers.filter(
    (p) => !["Imsak", "Syuruk"].includes(p.name)
  );

  for (const prayer of mainPrayers) {
    const [h, m] = prayer.time.split(":").map(Number);
    const prayerMinutes = h * 60 + m;
    if (prayerMinutes > currentMinutes) {
      return prayer;
    }
  }

  // If all prayers have passed, next is tomorrow's Subuh
  return mainPrayers[0] || null;
}

/**
 * Get countdown to a prayer time
 */
export function getCountdown(prayerTime: string): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const [h, m] = prayerTime.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}
