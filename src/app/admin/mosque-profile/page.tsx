"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    IconMosque,
    IconMapPin,
    IconPhone,
    IconImage,
    IconCar,
    IconPlus,
    IconTrash,
    IconEdit,
    IconCheck,
    IconLoader2
} from "@/components/ui/Icons";
import type { MosqueProfile, MosqueFacility, FacilityStatus } from "@/types/mosque";
import { uploadImage } from "@/lib/upload";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function MosqueProfilePage() {
    // Mock State
    const [profile, setProfile] = useState<MosqueProfile>({
        id: "1",
        name: "Masjid Zahir",
        address: "Jalan Kampong Perak, 05150 Alor Setar, Kedah Darul Aman",
        phone: "04-733 3288",
        description: "Masjid Zahir merupakan masjid negeri bagi negeri Kedah yang terletak di Alor Setar, Kedah, Malaysia.",
        hero_image_url: "https://images.unsplash.com/photo-1590076212ef8-251f0f7f32d8?q=80&w=1600&auto=format&fit=crop",
        parking_capacity: 150,
        parking_available: 45,
        parking_notes: "Kawasan letak kereta tambahan tersedia di padang berdekatan semasa solat Jumaat.",
        google_map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.711831862529!2d100.36394157585!3d6.117947127978255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304b449171f65f6d%3A0xe633b4e69b0fa2a!2sMasjid%20Zahir!5e0!3m2!1sen!2smy!4v1709440000000!5m2!1sen!2smy",
        created_at: "",
        updated_at: "",
    });

    const [facilities, setFacilities] = useState<MosqueFacility[]>([
        { id: "1", mosque_id: "1", name: "Parking", description: "Kawasan letak kereta luas", availability_status: "available", icon_name: "car_repair", created_at: "", updated_at: "" },
        { id: "2", mosque_id: "1", name: "WiFi", description: "Percuma untuk jemaah", availability_status: "available", icon_name: "wifi", created_at: "", updated_at: "" },
    ]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data, error } = await supabase
                    .from('mosque_profile')
                    .select('*')
                    .limit(1)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        // Table is empty, we keep default but set a real UUID placeholder if needed
                        console.log('No mosque profile found, using initial state.');
                    } else {
                        throw error;
                    }
                }

                if (data) {
                    setProfile(data as MosqueProfile);
                }
            } catch (err: any) {
                console.error('Initial fetch error:', err);
                Swal.fire({
                    title: 'Ralat',
                    text: 'Gagal memuatkan maklumat masjid.',
                    icon: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFacilityStatusChange = (id: string, status: FacilityStatus) => {
        setFacilities(prev => prev.map(f => f.id === id ? { ...f, availability_status: status } : f));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            Swal.fire({ title: 'Ralat', text: 'Sila pilih fail imej sahaja.', icon: 'error' });
            return;
        }

        setIsUploading(true);
        try {
            const url = await uploadImage(file, 'images', 'mosque-hero');
            setProfile(prev => ({ ...prev, hero_image_url: url }));

            Swal.fire({
                title: 'Berjaya!',
                text: 'Imej telah berjaya dimuat naik.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error: any) {
            console.error('Upload error:', error);
            Swal.fire({
                title: 'Gagal',
                text: error.message || 'Gagal memuat naik imej.',
                icon: 'error'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Updated to be real integration later, but for now we simulate
            const { error } = await supabase
                .from('mosque_profile')
                .update({
                    name: profile.name,
                    address: profile.address,
                    phone: profile.phone,
                    description: profile.description,
                    hero_image_url: profile.hero_image_url,
                    parking_capacity: profile.parking_capacity,
                    parking_available: profile.parking_available,
                    parking_notes: profile.parking_notes,
                    google_map_embed_url: profile.google_map_embed_url
                })
                .eq('id', profile.id);

            if (error) throw error;

            Swal.fire({
                title: 'Tersimpan!',
                text: 'Maklumat masjid telah berjaya dikemaskini.',
                icon: 'success',
                confirmButtonColor: '#D4AF37'
            });
        } catch (error: any) {
            console.error('Save error:', error);
            Swal.fire({
                title: 'Ralat',
                text: error.message || 'Gagal menyimpan maklumat.',
                icon: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-background-dark">
                <IconLoader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-dark">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#3a3528]">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <IconMosque className="text-primary" size={24} />
                        Mosque Profile Management
                    </h2>
                    <p className="text-text-admin-muted text-sm mt-1">
                        Update mosque information, facilities, and parking status.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        View Public Page
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <IconLoader2 className="animate-spin" size={18} /> : <IconCheck size={18} />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto space-y-8">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ─── Main Information ─── */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-surface-dark border-[#3a3528] p-6 space-y-6">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-[#3a3528] pb-3">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    General Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-text-admin-muted uppercase tracking-wider">Mosque Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleProfileChange}
                                            className="w-full bg-background-dark border border-[#3a3528] rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-text-admin-muted uppercase tracking-wider">Address</label>
                                        <textarea
                                            name="address"
                                            value={profile.address}
                                            onChange={handleProfileChange}
                                            rows={2}
                                            className="w-full bg-background-dark border border-[#3a3528] rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-admin-muted uppercase tracking-wider">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profile.phone || ""}
                                            onChange={handleProfileChange}
                                            className="w-full bg-background-dark border border-[#3a3528] rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-admin-muted uppercase tracking-wider">Map Embed URL</label>
                                        <input
                                            type="text"
                                            name="google_map_embed_url"
                                            value={profile.google_map_embed_url || ""}
                                            onChange={handleProfileChange}
                                            className="w-full bg-background-dark border border-[#3a3528] rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-all"
                                            placeholder="https://google.com/maps/embed?..."
                                        />
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-text-admin-muted uppercase tracking-wider">Description (Max 200 words)</label>
                                        <textarea
                                            name="description"
                                            value={profile.description || ""}
                                            onChange={handleProfileChange}
                                            rows={4}
                                            className="w-full bg-background-dark border border-[#3a3528] rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* ─── Facilities Management ─── */}
                            <Card className="bg-surface-dark border-[#3a3528] p-6 space-y-6">
                                <div className="flex items-center justify-between border-b border-[#3a3528] pb-3">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">apps</span>
                                        Manage Facilities
                                    </h3>
                                    <Button variant="outline" size="sm" className="gap-1 bg-background-dark border-[#3a3528]">
                                        <IconPlus size={14} /> Add New
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {facilities.map(facility => (
                                        <div key={facility.id} className="bg-background-dark/50 p-4 rounded-xl border border-[#3a3528] space-y-3 relative group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined text-xl">{facility.icon_name}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white leading-tight">{facility.name}</h4>
                                                    <p className="text-[10px] text-text-admin-muted mt-0.5">{facility.description}</p>
                                                </div>
                                                <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:bg-surface-dark rounded-md text-text-admin-muted hover:text-white"><IconEdit size={14} /></button>
                                                    <button className="p-1.5 hover:bg-red-500/10 rounded-md text-text-admin-muted hover:text-red-400"><IconTrash size={14} /></button>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 p-1 bg-background-dark rounded-lg border border-[#3a3528]">
                                                {(['available', 'limited', 'not_available'] as FacilityStatus[]).map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleFacilityStatusChange(facility.id, status)}
                                                        className={`flex-1 text-[9px] py-1 rounded capitalize font-bold transition-all ${facility.availability_status === status
                                                            ? (status === 'available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                status === 'limited' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                                    'bg-red-500/20 text-red-400 border border-red-500/30')
                                                            : 'text-text-admin-muted hover:text-white'
                                                            }`}
                                                    >
                                                        {status.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* ─── Sidebar Config ─── */}
                        <div className="space-y-6">

                            {/* Hero Image Upload */}
                            <Card className="bg-surface-dark border-[#3a3528] p-6 space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest text-center">Hero Image</h3>
                                <div className="aspect-[16/10] bg-background-dark rounded-xl border border-dashed border-[#3a3528] relative overflow-hidden group">
                                    <input
                                        type="file"
                                        id="hero-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                    {isUploading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-20">
                                            <IconLoader2 className="animate-spin text-primary" size={32} />
                                            <span className="text-[10px] text-primary mt-2 uppercase tracking-widest font-bold">Uploading...</span>
                                        </div>
                                    ) : null}

                                    {profile.hero_image_url ? (
                                        <>
                                            <img src={profile.hero_image_url} alt="Hero" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                <label
                                                    htmlFor="hero-upload"
                                                    className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-white text-xs font-bold cursor-pointer hover:bg-white/20 transition-all"
                                                >
                                                    Change Image
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label
                                            htmlFor="hero-upload"
                                            className="absolute inset-0 flex flex-col items-center justify-center text-text-admin-muted gap-2 cursor-pointer hover:bg-white/5 transition-all"
                                        >
                                            <IconImage size={32} />
                                            <span className="text-[10px]">Click to upload</span>
                                        </label>
                                    )}
                                </div>
                                <p className="text-[10px] text-text-admin-muted text-center italic">Best resolution: 1600x900px</p>
                            </Card>

                            {/* Parking Status Sidecard */}
                            <Card className="bg-surface-dark border-[#3a3528] p-6 space-y-6 shadow-xl shadow-primary/5">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-[#3a3528] pb-3">
                                    <span className="material-symbols-outlined text-primary">local_parking</span>
                                    Live Parking
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-admin-muted uppercase">Total Capacity</label>
                                        <input
                                            type="number"
                                            name="parking_capacity"
                                            value={profile.parking_capacity}
                                            onChange={(e) => setProfile(p => ({ ...p, parking_capacity: parseInt(e.target.value) }))}
                                            className="w-full bg-background-dark border border-[#3a3528] rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5 p-4 bg-primary/5 rounded-xl border border-primary/20 animate-pulse-gold">
                                        <label className="text-xs font-bold text-primary uppercase">Current Available</label>
                                        <input
                                            type="number"
                                            name="parking_available"
                                            value={profile.parking_available}
                                            onChange={(e) => setProfile(p => ({ ...p, parking_available: parseInt(e.target.value) }))}
                                            className="w-full bg-background-dark border border-primary/30 rounded-lg px-4 py-2.5 text-primary text-xl font-bold outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-admin-muted uppercase">Parking Notes</label>
                                        <textarea
                                            name="parking_notes"
                                            value={profile.parking_notes || ""}
                                            onChange={handleProfileChange}
                                            rows={3}
                                            className="w-full bg-background-dark border border-[#3a3528] rounded-lg px-4 py-2 text-white text-xs outline-none"
                                            placeholder="Special parking for OKU, Friday notes..."
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
