"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { IconLoader2 } from "@/components/ui/Icons";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [hadith, setHadith] = useState({
    content: "",
    source: "",
  });

  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const [newTicker, setNewTicker] = useState("");

  const [tvTheme, setTvTheme] = useState({
    primaryColor: "#c8a851",
    backgroundColor: "#1e1b14",
    fontSize: "large",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;

      data?.forEach((item) => {
        if (item.key === "hadith") setHadith(item.value);
        if (item.key === "tv_ticker") setTickerItems(item.value);
        if (item.key === "tv_theme") setTvTheme(item.value);
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: any) {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (error) throw error;

      Swal.fire({
        title: 'Berjaya',
        text: `Tetapan ${key} telah disimpan.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error("Save error:", err);
      Swal.fire('Ralat', err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <IconLoader2 className="animate-spin text-gold" size={48} />
    </div>
  );

  return (
    <div className="flex flex-col gap-10 pb-12 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* 1. Hadith Management Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  Hadith Display (TV)
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Hadith Content</label>
                <textarea
                  value={hadith.content}
                  onChange={(e) => setHadith({ ...hadith, content: e.target.value })}
                  rows={2}
                  className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary/50 transition-colors font-serif italic"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Source</label>
                <input
                  type="text"
                  value={hadith.source}
                  onChange={(e) => setHadith({ ...hadith, source: e.target.value })}
                  className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                onClick={() => saveSetting('hadith', hadith)}
                disabled={saving}
                className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-bold px-4 py-1.5 rounded text-[10px] uppercase tracking-widest transition-all"
              >
                Save Hadith
              </button>
            </div>
          </section>

          {/* 2. TV Ticker Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">view_carousel</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  TV Ticker Messages
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {tickerItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#111111] p-3 rounded border border-[#333333] group">
                    <span className="text-xs text-slate-300 truncate pr-4">{item}</span>
                    <button
                      onClick={() => {
                        const newList = tickerItems.filter((_, i) => i !== idx);
                        setTickerItems(newList);
                        saveSetting('tv_ticker', newList);
                      }}
                      className="text-red-500/50 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new ticker message..."
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  className="flex-1 bg-[#111111] border border-[#333333] rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTicker) {
                      const newList = [...tickerItems, newTicker];
                      setTickerItems(newList);
                      saveSetting('tv_ticker', newList);
                      setNewTicker("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newTicker) {
                      const newList = [...tickerItems, newTicker];
                      setTickerItems(newList);
                      saveSetting('tv_ticker', newList);
                      setNewTicker("");
                    }
                  }}
                  className="bg-primary text-background-dark font-bold px-4 py-2 rounded text-[10px] uppercase tracking-widest"
                >
                  Add
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* 3. TV Theme Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">palette</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  TV Appearance
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tvTheme.primaryColor}
                      onChange={(e) => setTvTheme({ ...tvTheme, primaryColor: e.target.value })}
                      className="size-10 bg-transparent border-none p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={tvTheme.primaryColor}
                      onChange={(e) => setTvTheme({ ...tvTheme, primaryColor: e.target.value })}
                      className="flex-1 bg-[#111111] border border-[#333333] rounded px-3 py-1.5 text-xs text-slate-300 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tvTheme.backgroundColor}
                      onChange={(e) => setTvTheme({ ...tvTheme, backgroundColor: e.target.value })}
                      className="size-10 bg-transparent border-none p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={tvTheme.backgroundColor}
                      onChange={(e) => setTvTheme({ ...tvTheme, backgroundColor: e.target.value })}
                      className="flex-1 bg-[#111111] border border-[#333333] rounded px-3 py-1.5 text-xs text-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => saveSetting('tv_theme', tvTheme)}
                className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-bold px-4 py-1.5 rounded text-[10px] uppercase tracking-widest transition-all"
              >
                Apply Theme to TV
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
