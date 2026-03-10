import { IconWallet } from "@/components/ui/Icons";
import { CampaignCard } from "@/components/dashboard/CampaignCard";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/types/campaign";

export async function CampaignSection() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1);

  const campaign: Campaign | null = campaigns && campaigns.length > 0 ? campaigns[0] as Campaign : null;

  if (!campaign) return null;

  return (
    <section className="animate-fade-in" style={{ animationDelay: "0.4s" }} data-facility="Infaq Campaign">
      <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light flex items-center gap-2 mb-4">
        <IconWallet size={18} className="text-gold" />
        Kempen Infaq Aktif
      </h2>
      <CampaignCard campaign={campaign} />
    </section>
  );
}
