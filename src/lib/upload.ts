import { supabase } from "@/lib/supabase";

/**
 * Upload an image to Supabase Storage and return the public URL.
 * @param file The file to upload.
 * @param bucket The bucket to upload to (defaults to 'images').
 * @param folder Optional folder path within the bucket.
 */
export async function uploadImage(
    file: File,
    bucket: string = "images",
    folder: string = "mosque"
): Promise<string> {
    // 1. Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // 2. Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // 3. Get the public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}
