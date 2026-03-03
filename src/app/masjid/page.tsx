import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
    IconMosque,
    IconMapPin,
    IconPhone,
    IconCar,
    IconCheck,
    IconAlertTriangle,
    IconXCircle,
    IconExternalLink,
} from "@/components/ui/Icons";
import type { MosqueProfile, MosqueFacility } from "@/types/mosque";

// Mock data for initial UI (will be fetched from Supabase later)
const mockProfile: MosqueProfile = {
    id: "1",
    name: "Masjid Zahir",
    address: "Jalan Kampong Perak, 05150 Alor Setar, Kedah Darul Aman",
    phone: "04-733 3288",
    description:
        "Masjid Zahir merupakan masjid negeri bagi negeri Kedah yang terletak di Alor Setar, Kedah, Malaysia. Ia merupakan salah satu masjid yang tercantik di Malaysia dan dunia. Masjid ini dibina pada tahun 1912 dan dibuka secara rasmi pada Jumaat, 15 Oktober 1915.",
    hero_image_url: "https://images.unsplash.com/photo-1590076212ef8-251f0f7f32d8?q=80&w=1600&auto=format&fit=crop",
    parking_capacity: 150,
    parking_available: 45,
    parking_notes: "Kawasan letak kereta tambahan tersedia di padang berdekatan semasa solat Jumaat.",
    google_map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.711831862529!2d100.36394157585!3d6.117947127978255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304b449171f65f6d%3A0xe633b4e69b0fa2a!2sMasjid%20Zahir!5e0!3m2!1sen!2smy!4v1709440000000!5m2!1sen!2smy",
    created_at: "",
    updated_at: "",
};

const mockFacilities: MosqueFacility[] = [
    { id: "1", mosque_id: "1", name: "Parking", description: "Kawasan letak kereta luas", availability_status: "available", icon_name: "car", created_at: "", updated_at: "" },
    { id: "2", mosque_id: "1", name: "OKU Access", description: "Ramp dan laluan kerusi roda", availability_status: "available", icon_name: "accessible", created_at: "", updated_at: "" },
    { id: "3", mosque_id: "1", name: "Air Conditioning", description: "Dewan solat berhawa dingin", availability_status: "available", icon_name: "ac_unit", created_at: "", updated_at: "" },
    { id: "4", mosque_id: "1", name: "Dewan Serbaguna", description: "Tersedia untuk majlis nikah/kenduri", availability_status: "available", icon_name: "meeting_room", created_at: "", updated_at: "" },
    { id: "5", mosque_id: "1", name: "Toilet", description: "Bersih dan selesa", availability_status: "available", icon_name: "wc", created_at: "", updated_at: "" },
    { id: "6", mosque_id: "1", name: "Kelas Pengajian", description: "Diadakan setiap malam", availability_status: "limited", icon_name: "school", created_at: "", updated_at: "" },
    { id: "7", mosque_id: "1", name: "WiFi", description: "WiFi percuma untuk jemaah", availability_status: "available", icon_name: "wifi", created_at: "", updated_at: "" },
    { id: "8", mosque_id: "1", name: "Lift", description: "Hanya untuk zon wanita", availability_status: "not_available", icon_name: "elevator", created_at: "", updated_at: "" },
];

export default function MosqueInfoPage() {
    return (
        <div className="min-h-screen bg-dark islamic-pattern pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-8">

                {/* ─── Mosque Overview Card ─── */}
                <section className="animate-fade-in">
                    <Card className="p-0 overflow-hidden border-gold/20">
                        {/* Hero Image */}
                        <div className="h-48 md:h-64 relative overflow-hidden">
                            <img
                                src={mockProfile.hero_image_url || ""}
                                alt={mockProfile.name}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-6">
                                <h1 className="text-2xl md:text-3xl font-bold gold-text font-[family-name:var(--font-poppins)]">
                                    {mockProfile.name}
                                </h1>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <IconMapPin size={18} className="text-gold mt-1 shrink-0" />
                                    <p className="text-light-muted text-sm leading-relaxed">
                                        {mockProfile.address}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <IconPhone size={18} className="text-gold shrink-0" />
                                    <p className="text-light-muted text-sm">{mockProfile.phone}</p>
                                </div>
                            </div>

                            <div className="relative pt-4 pb-2">
                                <div className="absolute top-0 left-0 w-12 h-0.5 gold-gradient rounded-full"></div>
                                <p className="text-light/90 text-sm leading-relaxed line-clamp-6">
                                    {mockProfile.description}
                                </p>
                            </div>

                            {/* Elegant Divider */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-gold/20 flex-1"></div>
                                <div className="text-gold/40 text-xs">✨</div>
                                <div className="h-px bg-gold/20 flex-1"></div>
                            </div>
                        </div>
                    </Card> Section
                </section>

                {/* ─── Facilities Section ─── */}
                <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <h2 className="text-xl font-bold gold-text mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                        <IconMosque size={20} className="text-gold" />
                        Kemudahan & Fasiliti
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {mockFacilities.map((facility) => (
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
                                <p className="text-3xl font-bold text-light">{mockProfile.parking_capacity}</p>
                            </div>
                            <div className="w-px h-12 bg-gold/10"></div>
                            <div className="text-right">
                                <p className="text-xs text-light-muted mb-1">Kekosongan Semasa</p>
                                <p className="text-3xl font-bold gold-text">{mockProfile.parking_available}</p>
                            </div>
                        </Card>
                        <Card className="p-6 flex flex-col justify-center space-y-3">
                            <div className="flex items-center gap-2 text-gold">
                                <IconCheck size={16} />
                                <p className="text-xs font-medium">Letak Kereta OKU Disediakan</p>
                            </div>
                            <div className="bg-dark-surface/50 p-3 rounded-lg border border-gold/10">
                                <p className="text-xs text-light-muted italic leading-relaxed">
                                    "{mockProfile.parking_notes}"
                                </p>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* ─── Map Section ─── */}
                <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <h2 className="text-xl font-bold gold-text mb-4 font-[family-name:var(--font-poppins)] flex items-center gap-2">
                        <IconMapPin size={20} className="text-gold" />
                        Lokasi Masjid
                    </h2>
                    <Card className="p-0 overflow-hidden min-h-[300px] border-gold/20 flex flex-col">
                        <iframe
                            src={mockProfile.google_map_embed_url || ""}
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
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mockProfile.address)}`}
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
