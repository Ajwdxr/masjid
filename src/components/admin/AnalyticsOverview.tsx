"use client";

import { useEffect, useState } from "react";

export function AnalyticsOverview() {
  const [stats, setStats] = useState<{ pageViews: any; facilityClicks: any }>({
    pageViews: {},
    facilityClicks: {},
  });

  useEffect(() => {
    const stored = localStorage.getItem("masjid_zahir_analytics");
    if (stored) {
      setStats(JSON.parse(stored));
    }
  }, []);

  const totalViews = Object.values(stats.pageViews).reduce((a: any, b: any) => a + b, 0) as number;
  const sortedFacilities = Object.entries(stats.facilityClicks).sort((a: any, b: any) => b[1] - a[1]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* Page Views Card */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-200 font-serif italic">Traffic Overview</h3>
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">Live Data</span>
        </div>
        <div className="flex items-baseline gap-4 mb-8">
          <span className="text-5xl font-serif text-white">{totalViews}</span>
          <span className="text-sm text-[#888888] uppercase tracking-widest">Total Page Views</span>
        </div>
        <div className="space-y-4">
          {Object.entries(stats.pageViews).map(([path, count]) => (
            <div key={path} className="flex items-center justify-between group">
              <span className="text-xs text-[#888888] font-mono group-hover:text-slate-300 transition-colors">{path}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1 bg-[#111111] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary/40" 
                    style={{ width: `${Math.min(100, ((count as number) / totalViews) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-slate-200 min-w-[2rem] text-right">{count as number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities Card */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-200 font-serif italic">Most Popular Facilities</h3>
          <span className="material-symbols-outlined text-[#888888] text-xl">bar_chart</span>
        </div>
        <div className="space-y-6">
          {sortedFacilities.length > 0 ? (
            sortedFacilities.map(([name, count]) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-[#888888] font-semibold">{name}</span>
                  <span className="text-primary font-bold">{count as number} interactions</span>
                </div>
                <div className="h-1.5 bg-[#111111] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${Math.min(100, ((count as number) / (sortedFacilities[0][1] as number)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-10 opacity-30">
              <span className="material-symbols-outlined text-4xl mb-2">monitoring</span>
              <p className="text-xs uppercase tracking-widest">No Interaction Data Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
