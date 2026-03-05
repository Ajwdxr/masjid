"use client";

import { usePageTracker, trackFacilityClick } from "@/lib/analytics";
import { useEffect } from "react";

interface PageTrackerProps {
  path: string;
}

export function PageTracker({ path }: PageTrackerProps) {
  usePageTracker(path);

  useEffect(() => {
    // Helper to track clicks on elements with data-facility attribute
    const handleFacilityClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const facility = target.closest("[data-facility]")?.getAttribute("data-facility");
      if (facility) {
        trackFacilityClick(facility);
      }
    };

    document.addEventListener("click", handleFacilityClick);
    return () => document.removeEventListener("click", handleFacilityClick);
  }, []);

  return null;
}
