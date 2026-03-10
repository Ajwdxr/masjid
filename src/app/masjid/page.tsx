"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
    IconMosque,
    IconMapPin,
    IconPhone,
    IconCar,
    IconCheck,
    IconExternalLink,
    IconLoader2,
} from "@/components/ui/Icons";
import type { MosqueProfile, MosqueFacility } from "@/types/mosque";
import { supabase } from "@/lib/supabase";

export default function MosqueInfoPage() {
    const [profile, setProfile] = useState<MosqueProfile | null>(null);
    const [facilities, setFacilities] = useState<MosqueFacility[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMosqueData = async () => {
            try {
                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('mosque_profile')
                    .select('*')
                    .limit(1)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') throw profileError;
                if (profileData) setProfile(profileData as MosqueProfile);

                // Fetch Facilities
                const { data: facilitiesData, error: facilitiesError } = await supabase
                    .from('mosque_facilities')
                    .select('*')
                    .eq('mosque_id', profileData?.id);

                if (facilitiesError) {
                    console.error('Error fetching facilities:', facilitiesError);
                } else if (facilitiesData) {
                    setFacilities(facilitiesData as MosqueFacility[]);
                }
            } catch (error) {
                console.error('Error fetching mosque data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMosqueData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <IconLoader2 className="animate-spin text-gold" size={48} />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 text-center space-y-4">
                <IconMosque size={64} className="text-gold/20" />
                <h1 className="text-xl font-bold text-light">Maklumat Masjid Tidak Ditemui</h1>
                <p className="text-light-muted text-sm max-w-md">
                    Maaf, maklumat profil masjid belum didaftarkan lagi dalam sistem.
                </p>
                <Link href="/">
                    <button className="text-gold hover:underline text-sm">Kembali ke Utama</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark islamic-pattern pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-8">

                {/* ─── Mosque Overview Card ─── */}
                <section className="animate-fade-in">
                    <Card className="p-0 overflow-hidden border-gold/20">
                        {/* Hero Image */}
                        <div className="h-48 md:h-64 relative overflow-hidden bg-dark-surface">
                            {profile.hero_image_url ? (
                                <img
                                    src={profile.hero_image_url}
                                    alt={profile.name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gold/10">
                                    <IconMosque size={80} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-6">
                                <h1 className="text-2xl md:text-3xl font-bold gold-text font-[family-name:var(--font-poppins)]">
                                    {profile.name}
                                </h1>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <IconMapPin size={18} className="text-gold mt-1 shrink-0" />
                                    <p className="text-light-muted text-sm leading-relaxed">
                                        {profile.address || "Alamat tidak tersedia"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <IconPhone size={18} className="text-gold shrink-0" />
                                    <p className="text-light-muted text-sm">{profile.phone || "Tiada no. telefon"}</p>
                                </div>
                            </div>

                            <div className="relative pt-4 pb-2">
                                <div className="absolute top-0 left-0 w-12 h-0.5 gold-gradient rounded-full"></div>
                                <p className="text-light/90 text-sm leading-relaxed line-clamp-6">
                                    {profile.description || "Tiada penerangan ketersediaan."}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-gold/20 flex-1"></div>
                                <div className="text-gold/40 text-xs">✨</div>
                                <div className="h-px bg-gold/20 flex-1"></div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* ─── Facilities Section ─── */}
                {facilities.length > 0 && (
                    <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <h2 className="text-xl font-bold gold-text mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                            <IconMosque size={20} className="text-gold" />
                            Kemudahan & Fasiliti
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {facilities.map((facility) => (
                                <Card key={facility.id} className="p-4 flex flex-col items-center text-center space-y-2 hover:border-gold/40 active:scale-95 transition-all cursor-default">
                                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-1">
                                        <span className="material-symbols-outlined text-2xl">{facility.icon_name}</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-light">{facility.name}</h3>
                                    <p className="text-[10px] text-light-muted line-clamp-2">{facility.description}</p>
                                    <div className="pt-1">
                                        {facility.availability_status === "available" && (
                                            <Badge variant="success" className="text-[9px] px-2 py-0">Tersedia</Badge>
                                        )}
                                        {facility.availability_status === "limited" && (
                                            <Badge variant="warning" className="text-[9px] px-2 py-0">Terhad</Badge>
                                        )}
                                        {facility.availability_status === "not_available" && (
                                            <Badge variant="danger" className="text-[9px] px-2 py-0">Tiada</Badge>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── Parking Information ─── */}
                <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <h2 className="text-xl font-bold gold-text mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                        <IconCar size={20} className="text-gold" />
                        Maklumat Parking
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-xs text-light-muted mb-1">Kapasiti Penuh</p>
                                <p className="text-3xl font-bold text-light">{profile.parking_capacity}</p>
                            </div>
                            <div className="w-px h-12 bg-gold/10"></div>
                            <div className="text-right">
                                <p className="text-xs text-light-muted mb-1">Kekosongan Semasa</p>
                                <p className="text-3xl font-bold gold-text">{profile.parking_available}</p>
                            </div>
                        </Card>
                        <Card className="p-6 flex flex-col justify-center space-y-3">
                            <div className="flex items-center gap-2 text-gold">
                                <IconCheck size={16} />
                                <p className="text-xs font-medium">Letak Kereta OKU Disediakan</p>
                            </div>
                            {profile.parking_notes && (
                                <div className="bg-dark-surface/50 p-3 rounded-lg border border-gold/10">
                                    <p className="text-xs text-light-muted italic leading-relaxed">
                                        "{profile.parking_notes}"
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </section>

                {/* ─── Map Section ─── */}
                {profile.google_map_embed_url && (
                    <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                        <h2 className="text-xl font-bold gold-text mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                            <IconMapPin size={20} className="text-gold" />
                            Lokasi Masjid
                        </h2>
                        <Card className="p-0 overflow-hidden min-h-[300px] border-gold/20 flex flex-col">
                            <iframe
                                src={profile.google_map_embed_url}
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="p-4 flex justify-between items-center bg-dark-card">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald animate-pulse"></div>
                                    <span className="text-xs text-light-muted">Buka pada waktu solat</span>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address || profile.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-semibold gold-text hover:text-gold-light transition-colors"
                                >
                                    <span>Open in Google Maps</span>
                                    <IconExternalLink size={14} />
                                </a>
                            </div>
                        </Card>
                    </section>
                )}

                <section className="text-center pt-4">
                    <Link href="/">
                        <p className="text-xs text-gold/60 hover:text-gold transition-colors font-medium">
                            ← Kembali ke Halaman Utama
                        </p>
                    </Link>
                </section>
            </div>
        </div>
    );
}
