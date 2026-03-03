/* ─── Mosque & Facility Types ─── */

export type FacilityStatus = "available" | "limited" | "not_available";

export interface MosqueProfile {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    description: string | null;
    hero_image_url: string | null;
    parking_capacity: number;
    parking_available: number;
    parking_notes: string | null;
    google_map_embed_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface MosqueFacility {
    id: string;
    mosque_id: string;
    name: string;
    description: string | null;
    availability_status: FacilityStatus;
    icon_name: string | null;
    created_at: string;
    updated_at: string;
}

export type MosqueProfileFormData = Omit<MosqueProfile, "id" | "created_at" | "updated_at">;
export type MosqueFacilityFormData = Omit<MosqueFacility, "id" | "mosque_id" | "created_at" | "updated_at">;
