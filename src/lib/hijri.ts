/* ─── Hijri Date Utility ─── */

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiulawal",
  "Rabiulakhir",
  "Jamadilawal",
  "Jamadilakhir",
  "Rejab",
  "Syaaban",
  "Ramadan",
  "Syawal",
  "Zulkaedah",
  "Zulhijjah",
];

const MALAY_DAYS = [
  "Ahad",
  "Isnin",
  "Selasa",
  "Rabu",
  "Khamis",
  "Jumaat",
  "Sabtu",
];

const MALAY_MONTHS = [
  "Januari",
  "Februari",
  "Mac",
  "April",
  "Mei",
  "Jun",
  "Julai",
  "Ogos",
  "September",
  "Oktober",
  "November",
  "Disember",
];

/**
 * Get approximate Hijri date using Intl (built-in)
 */
export function getHijriDate(): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("ms-MY-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(now);
  } catch {
    return "";
  }
}

/**
 * Get formatted Gregorian date in Malay
 */
export function getGregorianDate(): string {
  const now = new Date();
  const day = MALAY_DAYS[now.getDay()];
  const date = now.getDate();
  const month = MALAY_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
}

/**
 * Get Hijri month name
 */
export function getHijriMonthName(monthIndex: number): string {
  return HIJRI_MONTHS[monthIndex] || "";
}
