"use client";

import { getHijriDate, getGregorianDate } from "@/lib/hijri";
import { useState, useEffect } from "react";
import { IconCalendar, IconMoon } from "@/components/ui/Icons";

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
        <IconCalendar size={14} className="text-gold" />
        <span className="text-light text-sm font-medium">{gregorian}</span>
      </div>
      {hijri && (
        <>
          <span className="hidden sm:block text-dark-border">|</span>
          <div className="flex items-center gap-2">
            <IconMoon size={14} className="text-emerald-light" />
            <span className="text-light-muted text-sm">{hijri}</span>
          </div>
        </>
      )}
    </div>
  );
}
