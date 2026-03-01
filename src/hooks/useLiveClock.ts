"use client";

import { useState, useEffect } from "react";

/**
 * Live clock hook — updates every second
 */
export function useLiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client
    setTime(new Date());
    
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ms-MY", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return {
    time,
    formattedTime: time ? formatTime(time) : "--:--:--",
  };
}
