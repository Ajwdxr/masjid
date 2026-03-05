"use client";

import { useEffect } from "react";

// In a real app, this would send data to a database like Supabase
// For this demo, we'll track things in localStorage to show persistent data in the admin dashboard
// without needing a complex backend setup yet.

const ANALYTICS_KEY = "masjid_zahir_analytics";

type AnalyticsData = {
  pageViews: Record<string, number>;
  facilityClicks: Record<string, number>;
};

const getAnalytics = (): AnalyticsData => {
  if (typeof window === "undefined") return { pageViews: {}, facilityClicks: {} };
  const stored = localStorage.getItem(ANALYTICS_KEY);
  if (stored) return JSON.parse(stored);
  return { pageViews: {}, facilityClicks: {} };
};

const saveAnalytics = (data: AnalyticsData) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
};

export const trackPageView = (path: string) => {
  const data = getAnalytics();
  data.pageViews[path] = (data.pageViews[path] || 0) + 1;
  saveAnalytics(data);
};

export const trackFacilityClick = (facilityName: string) => {
  const data = getAnalytics();
  data.facilityClicks[facilityName] = (data.facilityClicks[facilityName] || 0) + 1;
  saveAnalytics(data);
  console.log(`[Analytics] Tracked click for: ${facilityName}`);
};

export const usePageTracker = (path: string) => {
  useEffect(() => {
    trackPageView(path);
  }, [path]);
};
