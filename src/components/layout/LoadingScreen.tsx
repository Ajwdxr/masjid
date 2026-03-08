"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 700); // Duration of fade-out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#111111] transition-opacity duration-700 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center max-w-[480px] px-6 text-center">
        {/* Logo Section */}
        <div className="relative mb-10 group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl gold-gradient overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(200,169,81,0.3)] animate-pulse-gold relative z-10">
            <img 
              src="/logo.jpg" 
              alt="Masjid Zahir Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative rotating borders */}
          <div className="absolute inset-[-12px] border border-gold/20 rounded-[2.5rem] animate-spin-slow" />
          <div className="absolute inset-[-24px] border border-gold/10 rounded-[3.2rem] animate-spin-slow-reverse" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-3xl -z-10 animate-pulse" />
        </div>

        {/* Text Branding */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-poppins)] gold-text">
            Zahir Digital
          </h1>
          <div className="flex flex-col items-center">
            <p className="text-light-muted text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium">
              Masjid Zahir, Alor Setar
            </p>
            <div className="h-[1px] w-12 bg-gold/30 mt-2" />
          </div>
        </div>

        {/* Loading Progress */}
        <div className="mt-16 space-y-4 flex flex-col items-center">
          <div className="w-48 h-1 bg-dark-border rounded-full overflow-hidden">
            <div className="h-full gold-gradient animate-loading-bar" />
          </div>
          <p className="text-gold/60 text-[10px] uppercase tracking-widest animate-pulse">
            Memuatkan...
          </p>
        </div>
      </div>

      {/* Ambient background glows */}
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] aspect-square rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[-15%] right-[-10%] w-[50%] aspect-square rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
    </div>
  );
}
