"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/layout/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  IconUser, 
  IconMail, 
  IconCalendar, 
  IconCheck, 
  IconCreditCard, 
  IconHeart,
  IconClock
} from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

type Task = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  completed?: boolean;
};

type Donation = {
  id: string;
  amount: number;
  created_at: string;
  campaigns: {
    title: string;
  };
};

export default function VisitorProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayDeeds, setTodayDeeds] = useState<string[]>([]); // Array of task IDs completed today

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Task Definitions
      const { data: taskData } = await supabase
        .from("task_definitions")
        .select("*")
        .order("created_at", { ascending: true });

      // 2. Fetch Today's Completed Deeds
      const { data: deedData } = await supabase
        .from("user_deed_logs")
        .select("task_id")
        .eq("user_id", user?.id)
        .eq("completed_at", new Date().toISOString().split("T")[0]);

      // 3. Fetch Personal Donations
      const { data: donationData } = await supabase
        .from("donations")
        .select(`
          id,
          amount,
          created_at,
          campaigns (title)
        `)
        .eq("profile_id", user?.id)
        .order("created_at", { ascending: false });

      if (taskData) setTasks(taskData);
      if (deedData) setTodayDeeds(deedData.map(d => d.task_id));
      if (donationData) setDonations(donationData as any);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDeed = async (taskId: string) => {
    const isCompleted = todayDeeds.includes(taskId);
    const today = new Date().toISOString().split("T")[0];

    try {
      if (isCompleted) {
        // Remove completion
        await supabase
          .from("user_deed_logs")
          .delete()
          .eq("user_id", user?.id)
          .eq("task_id", taskId)
          .eq("completed_at", today);
        
        setTodayDeeds(todayDeeds.filter(id => id !== taskId));
      } else {
        // Add completion
        await supabase
          .from("user_deed_logs")
          .insert([
            {
              user_id: user?.id,
              task_id: taskId,
              completed_at: today
            }
          ]);
        
        setTodayDeeds([...todayDeeds, taskId]);
      }
    } catch (err) {
      console.error("Error toggling deed:", err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-gold animate-pulse">Memuatkan profil anda...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center space-y-4">
        <div className="text-light-muted">Sila log masuk untuk melihat profil.</div>
        <Link href="/login">
          <Button variant="primary">Log Masuk</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 islamic-pattern">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <section className="animate-fade-in">
          <Card className="p-8 border-gold/10 bg-dark-surface/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold/30 shadow-inner">
                <IconUser size={40} className="text-gold" />
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-light">
                    {profile?.full_name || "Jemaah Masjid"}
                  </h1>
                  <Badge variant="gold" className="text-[10px] uppercase tracking-wider">Jemaah</Badge>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-light-muted">
                    <IconMail size={14} className="text-gold" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-light-muted">
                    <IconCalendar size={14} className="text-gold" />
                    Sertai pada {new Date(user.created_at).toLocaleDateString("ms-MY")}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-gold/20 text-gold hover:bg-gold/10">
                Kemaskini Profil
              </Button>
            </div>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Deeds Tracker */}
          <section className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light mb-4 flex items-center gap-2">
              <IconHeart size={18} className="text-red-400" />
              Amalan Harian ({new Date().toLocaleDateString("ms-MY", { day: 'numeric', month: 'long' })})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tasks.length > 0 ? tasks.map((task) => (
                <Card 
                  key={task.id}
                  className={`p-4 border-gold/10 transition-all cursor-pointer group hover:border-gold/30 ${
                    todayDeeds.includes(task.id) ? "bg-gold/10 border-gold/40" : "bg-dark-surface/30"
                  }`}
                  onClick={() => toggleDeed(task.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      todayDeeds.includes(task.id) ? "bg-gold text-dark" : "bg-gold/10 text-gold"
                    }`}>
                      <IconCheck size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm transition-colors ${
                        todayDeeds.includes(task.id) ? "text-gold" : "text-light"
                      }`}>
                        {task.title}
                      </h3>
                      <p className="text-xs text-light-muted line-clamp-1">{task.description}</p>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="col-span-2 text-center p-8 border border-dashed border-dark-border rounded-xl text-light-muted">
                  Tiada amalan ditetapkan. Sila hubungi admin.
                </div>
              )}
            </div>
          </section>

          {/* Side Info / History */}
          <section className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {/* Stats */}
            <Card className="p-6 border-gold/10 bg-dark-surface/30">
              <h3 className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">Ringkasan</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-light-muted">Amalan Hari Ini</span>
                  <span className="text-sm font-bold text-light">{todayDeeds.length}/{tasks.length}</span>
                </div>
                <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold transition-all duration-500" 
                    style={{ width: `${(todayDeeds.length / tasks.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-light-muted">Jumlah Infaq</span>
                  <span className="text-sm font-bold text-gold">
                    RM {donations.reduce((sum, d) => sum + Number(d.amount), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Donation History */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold font-[family-name:var(--font-poppins)] text-light flex items-center gap-2">
                <IconCreditCard size={14} className="text-gold" />
                Sejarah Infaq
              </h2>
              <div className="space-y-3">
                {donations.length > 0 ? donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="p-3 border-b border-gold/5 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-light">{donation.campaigns?.title || "Sumbangan Umum"}</div>
                      <div className="text-[10px] text-light-muted flex items-center gap-1">
                        <IconClock size={10} />
                        {new Date(donation.created_at).toLocaleDateString("ms-MY")}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gold">RM {Number(donation.amount).toFixed(2)}</div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-[10px] text-light-muted uppercase tracking-wider">
                    Tiada sejarah rekod
                  </div>
                )}
                {donations.length > 5 && (
                  <button className="w-full text-center text-xs text-gold hover:underline">Lihat Semua</button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
