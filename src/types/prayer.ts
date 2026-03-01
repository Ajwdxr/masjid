/* ─── Prayer Time Types ─── */

export interface PrayerTime {
  name: string;
  nameMs: string;
  time: string; // "HH:mm"
}

export interface PrayerTimesData {
  date: string;
  hijriDate: string;
  zone: string;
  prayers: PrayerTime[];
}

export interface PrayerCountdown {
  prayer: PrayerTime;
  hours: number;
  minutes: number;
  seconds: number;
  isNext: boolean;
}
