"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { IconLoader2, IconUpload, IconImage, IconTrash, IconCheck } from "@/components/ui/Icons";
import { uploadImage } from "@/lib/upload";

interface HadithItem {
  content: string;
  source: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hadith state - now an array
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [newHadith, setNewHadith] = useState<HadithItem>({
    content: "",
    source: "",
  });

  const [tickerItems, setTickerItems] = useState<string[]>([]);
  const [newTicker, setNewTicker] = useState("");

  const [hijriOffset, setHijriOffset] = useState<number>(0);

  const [tvTheme, setTvTheme] = useState({
    primaryColor: "#c8a851",
    backgroundColor: "#1e1b14",
    fontSize: "large",
  });

  const [donationQR, setDonationQR] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;

      data?.forEach((item) => {
        if (item.key === "hadith") {
          // Compatibility check: if old data is object, wrap in array
          if (Array.isArray(item.value)) {
            setHadiths(item.value);
          } else if (item.value && item.value.content) {
            setHadiths([item.value]);
          }
        }
        if (item.key === "tv_ticker") setTickerItems(item.value);
        if (item.key === "hijri_offset") setHijriOffset(item.value);
        if (item.key === "tv_theme") setTvTheme(item.value);
        if (item.key === "donation_qr") setDonationQR(item.value);
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("Ralat", "Sila pilih fail imej sahaja.", "error");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(file, "images", "general-qr");
      setDonationQR(url);
      await saveSetting("donation_qr", url, true);
    } catch (err: any) {
      console.error("Upload error:", err);
      Swal.fire("Ralat", "Gagal memuat naik imej.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  async function saveSetting(key: string, value: any, silent = false) {
    if (!silent) setSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (error) throw error;

      if (!silent) {
        Swal.fire({
          title: 'Berjaya',
          text: `Tetapan ${key} telah disimpan.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err: any) {
      console.error("Save error:", err);
      if (!silent) Swal.fire('Ralat', err.message, 'error');
    } finally {
      if (!silent) setSaving(false);
    }
  }

  const handleAddHadith = () => {
    if (!newHadith.content) return;
    const newList = [...hadiths, newHadith];
    setHadiths(newList);
    saveSetting('hadith', newList);
    setNewHadith({ content: "", source: "" });
  };

  const handleRemoveHadith = (index: number) => {
    const newList = hadiths.filter((_, i) => i !== index);
    setHadiths(newList);
    saveSetting('hadith', newList);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <IconLoader2 className="animate-spin text-gold" size={48} />
    </div>
  );

  return (
    <div className="flex flex-col gap-10 pb-12 p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* 1. Hadith Management Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  Senarai Hadith (Koleksi)
                </h3>
              </div>
              <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">
                Tukar Setiap Hari
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Add New Hadith */}
              <div className="bg-[#222222]/50 p-5 rounded-lg border border-primary/20 space-y-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Tambah Hadith Baru</p>
                <div className="space-y-3">
                  <textarea
                    placeholder="Teks Hadith..."
                    value={newHadith.content}
                    onChange={(e) => setNewHadith({ ...newHadith, content: e.target.value })}
                    rows={3}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-primary/50 transition-all font-serif italic"
                  />
                  <input
                    type="text"
                    placeholder="Sumber (Contoh: Sahih Bukhari)"
                    value={newHadith.source}
                    onChange={(e) => setNewHadith({ ...newHadith, source: e.target.value })}
                    className="w-full bg-[#111111] border border-[#333333] rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-primary/50 transition-all"
                  />
                  <button
                    onClick={handleAddHadith}
                    disabled={saving || !newHadith.content}
                    className="w-full bg-primary text-black font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest transition-all disabled:opacity-30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Simpan ke Koleksi
                  </button>
                </div>
              </div>

              {/* Hadith List */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em] px-1">Koleksi Sedia Ada ({hadiths.length})</p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {hadiths.map((item, idx) => (
                    <div key={idx} className="group relative bg-[#111111] p-5 rounded-xl border border-[#333333] hover:border-primary/30 transition-all">
                      <p className="text-sm text-slate-300 font-serif italic leading-relaxed mb-3">"{item.content}"</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">— {item.source || "Tiada Sumber"}</span>
                        <button
                          onClick={() => handleRemoveHadith(idx)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-red-500/50 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {hadiths.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-[#333333] rounded-xl">
                      <p className="text-xs text-[#888888] italic">Tiada hadith dalam koleksi.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Hijri Calendar Offset Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">event_note</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  Hijri Calendar Offset
                </h3>
              </div>
              <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">
                Pelarasan Tarikh
              </span>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-col gap-4">
                <p className="text-xs text-[#888888] leading-relaxed">
                  Gunakan tetapan ini jika tarikh Hijri dalam aplikasi tidak bertepatan dengan pengisytiharan rasmi (cth: berbeza 1 hari).
                </p>
                <div className="flex items-center gap-6 bg-[#111111] p-6 rounded-xl border border-[#333333]">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Offset Hari</span>
                    <p className="text-[11px] text-[#555555] italic">Tukar kepada -1, 0, atau +1</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newOffset = (hijriOffset || 0) - 1;
                        setHijriOffset(newOffset);
                        saveSetting('hijri_offset', newOffset);
                      }}
                      className="size-10 bg-[#222222] border border-[#333333] rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 transition-all font-bold"
                    >
                      -
                    </button>
                    <div className="w-16 h-10 bg-[#0A0A0A] border border-primary/20 rounded-lg flex items-center justify-center text-xl font-bold text-white font-mono">
                      {hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset}
                    </div>
                    <button
                      onClick={() => {
                        const newOffset = (hijriOffset || 0) + 1;
                        setHijriOffset(newOffset);
                        saveSetting('hijri_offset', newOffset);
                      }}
                      className="size-10 bg-[#222222] border border-[#333333] rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 transition-all font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. TV Ticker Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">view_carousel</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  TV Ticker Messages
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {tickerItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#111111] p-4 rounded-xl border border-[#333333] group hover:border-primary/20 transition-all">
                    <span className="text-xs text-slate-300 truncate pr-4">{item}</span>
                    <button
                      onClick={() => {
                        const newList = tickerItems.filter((_, i) => i !== idx);
                        setTickerItems(newList);
                        saveSetting('tv_ticker', newList);
                      }}
                      className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tulis mesej bergerak baru..."
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  className="flex-1 bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-primary/50 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTicker) {
                      const newList = [...tickerItems, newTicker];
                      setTickerItems(newList);
                      saveSetting('tv_ticker', newList, true);
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
                  className="bg-primary text-black font-bold px-6 py-2 rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
                >
                  Tambah
                </button>
              </div>
            </div>
          </section>

          {/* 4. General Donation QR Code */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">qr_code_2</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  General Donation QR Code
                </h3>
              </div>
            </div>
            <div className="p-8 flex flex-col items-center gap-6">
              <div className="relative group">
                <div className={`w-48 h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-[#111111] overflow-hidden ${donationQR ? 'border-primary/50' : 'border-[#333333] hover:border-primary/50'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                       <IconLoader2 className="animate-spin text-primary" size={32} />
                       <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Uploading...</span>
                    </div>
                  ) : donationQR ? (
                    <>
                      <img src={donationQR} alt="General Donation QR" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs text-white font-bold uppercase tracking-widest text-center px-4">Tukar Imej QR</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-[#555555] group-hover:text-primary transition-colors">
                      <IconUpload size={48} />
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">E-wallet QR Code</p>
                        <p className="text-[8px] mt-1 text-[#666666] italic">Sokong TNG, DuitNow dsb.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {donationQR && (
                  <button
                    onClick={() => {
                      if (confirm('Padam QR code ini?')) {
                        setDonationQR(null);
                        saveSetting('donation_qr', null);
                      }
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg hover:bg-red-500 transition-all z-20 border border-white/20"
                  >
                    <IconTrash size={14} />
                  </button>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-[11px] text-[#888888] max-w-sm leading-relaxed">
                  QR code ini akan dipaparkan secara <span className="text-primary italic">fallback</span> sekiranya tiada kempen yang sedang aktif.
                </p>
                {donationQR && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-primary/10 rounded-full border border-primary/20">
                    <IconCheck size={12} className="text-primary" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Sedia Dipaparkan</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* 3. TV Appearance Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">palette</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  TV Appearance (Theme)
                </h3>
              </div>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Primary Color</label>
                  <div className="flex items-center gap-3 bg-[#111111] p-3 rounded-xl border border-[#333333]">
                    <input
                      type="color"
                      value={tvTheme.primaryColor}
                      onChange={(e) => setTvTheme({ ...tvTheme, primaryColor: e.target.value })}
                      className="size-12 bg-transparent border-none p-0 cursor-pointer rounded-lg overflow-hidden"
                    />
                    <input
                      type="text"
                      value={tvTheme.primaryColor.toUpperCase()}
                      onChange={(e) => setTvTheme({ ...tvTheme, primaryColor: e.target.value })}
                      className="flex-1 bg-transparent border-none p-0 text-sm text-slate-300 font-mono tracking-widest focus:ring-0"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Background Color</label>
                  <div className="flex items-center gap-3 bg-[#111111] p-3 rounded-xl border border-[#333333]">
                    <input
                      type="color"
                      value={tvTheme.backgroundColor}
                      onChange={(e) => setTvTheme({ ...tvTheme, backgroundColor: e.target.value })}
                      className="size-12 bg-transparent border-none p-0 cursor-pointer rounded-lg overflow-hidden"
                    />
                    <input
                      type="text"
                      value={tvTheme.backgroundColor.toUpperCase()}
                      onChange={(e) => setTvTheme({ ...tvTheme, backgroundColor: e.target.value })}
                      className="flex-1 bg-transparent border-none p-0 text-sm text-slate-300 font-mono tracking-widest focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => saveSetting('tv_theme', tvTheme)}
                  className="w-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-black px-4 py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Apply Preview Theme to TV
                </button>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined">info</span>
              <h4 className="font-bold uppercase text-xs tracking-widest">Tips Pengurusan TV</h4>
            </div>
            <ul className="space-y-3">
              <li className="text-xs text-slate-400 flex gap-2">
                <span className="text-primary">•</span>
                Hadith akan bertukar secara automatik setiap hari mengikut tarikh terkini.
              </li>
              <li className="text-xs text-slate-400 flex gap-2">
                <span className="text-primary">•</span>
                Gunakan warna kontras tinggi (cth: Emas atas Hitam) untuk keterbacaan yang lebih baik di skrin TV.
              </li>
              <li className="text-xs text-slate-400 flex gap-2">
                <span className="text-primary">•</span>
                Mesej Ticker sebaiknya pendek dan padat untuk keselesaan jemaah membaca.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
