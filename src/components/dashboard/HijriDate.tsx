"use client";

import { getHijriDate, getGregorianDate } from "@/lib/hijri";
import { useState, useEffect } from "react";

interface HijriDateProps {
  hijriFromApi?: string;
}

export function HijriDate({ hijriFromApi }: HijriDateProps) {
  const [gregorian, setGregorian] = useState("");
  const [hijri, setHijri] = useState("");

  useEffect(() => {
    setGregorian(getGregorianDate());
    setHijri(hijriFromApi || getHijriDate());
  }, [hijriFromApi]);

  if (!gregorian) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2">
        <span className="text-gold text-sm">📅</span>
        <span className="text-light text-sm font-medium">{gregorian}</span>
      </div>
      {hijri && (
        <>
          <span className="hidden sm:block text-dark-border">|</span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-light text-sm">🌙</span>
            <span className="text-light-muted text-sm">{hijri}</span>
          </div>
        </>
      )}
    </div>
  );
}
