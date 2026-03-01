"use client";

import { useLiveClock } from "@/hooks/useLiveClock";

export function LiveClock() {
  const { formattedTime } = useLiveClock();

  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] gold-text tracking-wider tabular-nums">
        {formattedTime}
      </p>
    </div>
  );
}
