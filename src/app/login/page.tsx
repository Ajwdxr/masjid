"use client";

import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconMosque, IconLock, IconUser, IconGoogle } from "@/components/ui/Icons";

function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isRegister) {
      // Sign Up Logic
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else if (data.user) {
        setSuccess("Pendaftaran berjaya! Sila semak e-mel anda atau terus log masuk.");
        setIsRegister(false);
        setLoading(false);
      }
    } else {
      // Login Logic
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
      } else {
        router.push(redirectPath);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Gagal untuk log masuk dengan Google');
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full relative z-10 border border-gold/10 bg-dark-surface/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-50" />

      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 shadow-inner">
          <img
            src="/logo.jpg"
            alt="Masjid Zahir Logo"
            className="w-16 h-16 object-cover rounded-2xl"
          />
        </div>
        <Badge variant="gold" className="mb-2">
          {isRegister ? "Pendaftaran Jemaah" : "Log Masuk Portal"}
        </Badge>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)] gold-text">
          {isRegister ? "Daftar Akaun" : "Selamat Datang"}
        </h1>
        <p className="text-light-muted text-sm mt-2">
          {isRegister
            ? "Sertai komuniti digital Masjid Zahir untuk menjejak amalan harian anda."
            : "Sila masukkan kredential anda untuk mengakses profil."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {isRegister && (
          <div className="relative">
            <label className="block text-xs font-semibold text-gold/80 uppercase tracking-widest mb-1.5 ml-1">
              Nama Penuh
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light-muted group-focus-within:text-gold transition-colors">
                <IconUser size={18} />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-background-dark/50 border border-dark-border rounded-2xl text-light focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-light-muted/30"
                placeholder="Ahmad bin Ismail"
              />
            </div>
          </div>
        )}

        <div className="relative">
          <label className="block text-xs font-semibold text-gold/80 uppercase tracking-widest mb-1.5 ml-1">
            E-mel
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light-muted group-focus-within:text-gold transition-colors">
              <IconUser size={18} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-background-dark/50 border border-dark-border rounded-2xl text-light focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-light-muted/30"
              placeholder="emel@contoh.com"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-semibold text-gold/80 uppercase tracking-widest mb-1.5 ml-1">
            Kata Laluan
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light-muted group-focus-within:text-gold transition-colors">
              <IconLock size={18} />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-background-dark/50 border border-dark-border rounded-2xl text-light focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-light-muted/30"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 text-lg rounded-2xl mt-4 font-bold tracking-wide shadow-lg shadow-gold/20"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
              Sila tunggu...
            </span>
          ) : (
            isRegister ? "Daftar Sekarang" : "Log Masuk"
          )}
        </Button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dark-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#111] px-4 text-light-muted/50 tracking-widest font-medium">Atau</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-dark font-semibold rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconGoogle />
          <span>Log Masuk Google</span>
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              setSuccess(null);
            }}
            className="text-gold text-sm hover:underline"
          >
            {isRegister ? "Sudah ada akaun? Log masuk" : "Belum ada akaun? Daftar di sini"}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] islamic-pattern relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald/5 rounded-full blur-3xl animate-pulse" />

      <Suspense fallback={
        <Card className="max-w-md w-full border border-gold/10 bg-dark-surface/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </Card>
      }>
        <LoginForm />
      </Suspense>

      <div className="absolute bottom-6 left-0 w-full text-center text-light-muted/40 text-[10px] uppercase tracking-[0.2em] font-medium">
        Powered by Zahir Digital &copy; 2026
      </div>
    </div>
  );
}
