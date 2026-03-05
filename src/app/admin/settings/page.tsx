"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [hadith, setHadith] = useState({
    content: '"The best among you are those who have the best manners and character."',
    source: "Sahih Bukhari",
  });

  const [branding, setBranding] = useState({
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRIlF417Nrsn469D9Vxq4hcQUuj9oMKcTDMAl6Q3AA2vw2PSBCUCeqA9DzjIy0V36TooicVau1Snvn84FYUJUs5rtWrKun3jKsV9fu0gf87ym_oGb5bd0OFsrWa94XbCQV6u6XGfMHC6yTfzXTJKHatHYiyiy2SSfyyQOoqw06QXjkVsePuZCY1R5_g1_lXvA2M3j2OJLbDhro9UueZ3L2fUtWjmtJ-xoxxetXClr1Nw9dlfVakQ2Q1fDyamy5DT4nmYHfM7CFKf0",
  });

  const [user, setUser] = useState({
    name: "Ahmad bin Ismail",
    role: "Super Admin",
    email: "admin@masjidzahir.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5W_jNMw5_K6Zfq7_F2LbJ7Z40cqPgZe5gSWISQJSMEe9A9L2R8jqPZpz1w6g1SRETC58BuGKDhutbcAAGASvFzZqIOUhBUqUF_uMCr3rqe0S46lSjJTmuJRS0etrCEcEeQl8GPRS0XPqPf7u7mzEYp0vqbKoS_xZgeEeKWtOj2tj0Zs2AgZUppLvti4eWgO-oKhcvEUZ3YWeghDknGVM_FDtAqs1c9txAbitmVOP5ulOGlGSpUu-KnICvwdEXBh4YQT3-BQICWY",
  });

  /* New Ticker State */
  const [tickerItems, setTickerItems] = useState([
    "Masjid Expansion Fund: RM 187,500 raised of RM 500,000 goal",
    "Weekend Quran Class registration is open until 15 Mar",
    "Please ensure phones are on silent mode during prayer",
  ]);
  const [newTicker, setNewTicker] = useState("");

  /* New TV Theme State */
  const [tvTheme, setTvTheme] = useState({
    primaryColor: "#c8a851",
    backgroundColor: "#1e1b14",
    fontSize: "large",
  });

  /* New Admins State */
  const [admins, setAdmins] = useState([
    { id: 1, name: "Ustaz Ahmad", email: "ahmad@zahir.com", role: "Super Admin" },
    { id: 2, name: "Haji Razak", email: "razak@zahir.com", role: "Manager" },
  ]);

  return (
    <div className="flex flex-col gap-10 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* 1. Hadith Management Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  Hadith Display
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
              <button className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-bold px-4 py-1.5 rounded text-[10px] uppercase tracking-widest transition-all">
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
                      onClick={() => setTickerItems(tickerItems.filter((_, i) => i !== idx))}
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
                      setTickerItems([...tickerItems, newTicker]);
                      setNewTicker("");
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (newTicker) {
                      setTickerItems([...tickerItems, newTicker]);
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
              <div className="bg-[#111111] border border-[#333333] rounded p-4 flex flex-col items-center gap-3">
                <p className="text-[10px] text-[#888888] uppercase tracking-widest self-start">Visual Sample</p>
                <div 
                  className="w-full h-24 rounded flex items-center justify-center gap-4 px-4 overflow-hidden relative"
                  style={{ backgroundColor: tvTheme.backgroundColor }}
                >
                  <div className="w-1/3 h-10 border" style={{ borderColor: `${tvTheme.primaryColor}40`, background: `${tvTheme.primaryColor}10` }}></div>
                  <div className="flex-1 h-10 border" style={{ borderColor: `${tvTheme.primaryColor}40`, background: `${tvTheme.primaryColor}10` }}></div>
                   <div 
                    className="absolute bottom-0 left-0 right-0 h-4 border-t" 
                    style={{ borderColor: `${tvTheme.primaryColor}30`, backgroundColor: 'black' }}
                  >
                    <div className="flex items-center h-full px-2" style={{ color: tvTheme.primaryColor, fontSize: '6px' }}>
                      RUNNING TICKER PREVIEW • {tickerItems[0].slice(0, 30)}...
                    </div>
                  </div>
                </div>
              </div>
              <button className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-bold px-4 py-1.5 rounded text-[10px] uppercase tracking-widest transition-all">
                Apply Theme to TV
              </button>
            </div>
          </section>

          {/* 4. Branding (Logo) Section */}
          <section className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">frame_person</span>
                <h3 className="text-base font-medium text-slate-200 tracking-tight font-serif italic">
                  Mosque Identity
                </h3>
              </div>
            </div>
            <div className="p-6 flex items-center gap-6">
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Logo URL</label>
                  <input 
                    type="text"
                    value={branding.logoUrl}
                    onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                    className="w-full bg-[#111111] border border-[#333333] rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <button className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-bold px-4 py-1.5 rounded text-[10px] uppercase tracking-widest transition-all">
                  Update Logo
                </button>
              </div>
              <div 
                className="size-20 bg-center bg-no-repeat bg-cover rounded-full border border-[#333333] shadow-lg shrink-0"
                style={{ backgroundImage: `url("${branding.logoUrl}")` }}
              ></div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. User Management (Admins) Section */}
      <section className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-[#333333] flex items-center justify-between bg-[#222222]/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">group</span>
            <h3 className="text-lg font-medium text-slate-200 tracking-tight font-serif italic">
              Administrative Accounts
            </h3>
          </div>
          <button className="bg-primary hover:bg-primary-dark text-background-dark font-bold px-4 py-2 rounded text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Add New Admin
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#888888]">Name</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#888888]">Email</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#888888]">Role</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#888888] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]/50">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-4 text-sm text-slate-200">{adm.name}</td>
                  <td className="px-8 py-4 text-sm text-[#888888] font-mono">{adm.email}</td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-[#111111] border border-[#333333] text-primary">
                      {adm.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-[#888888] hover:text-white p-1">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Current User Profile Summary */}
      <section className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-primary shadow-lg">
        <div className="flex items-center gap-4">
          <div 
            className="size-16 bg-center bg-no-repeat bg-cover rounded-full border border-primary/20"
            style={{ backgroundImage: `url("${user.avatar}")` }}
          ></div>
          <div>
            <p className="text-lg font-serif italic text-white leading-tight">{user.name}</p>
            <p className="text-xs text-primary font-medium tracking-widest uppercase mt-1">{user.role}</p>
            <p className="text-[10px] text-[#888888] mt-1">{user.email}</p>
          </div>
        </div>
        <button className="border border-[#333333] hover:border-primary/30 text-slate-300 hover:text-white px-6 py-2 rounded text-xs uppercase tracking-widest transition-all">
          Edit Profile
        </button>
      </section>
    </div>
  );
}
