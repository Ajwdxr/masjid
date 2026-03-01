import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Campaign } from "@/types/campaign";
import { formatCurrency, calcPercentage, formatShortDate } from "@/lib/utils";
import Link from "next/link";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const percentage = calcPercentage(
    campaign.collected_amount,
    campaign.target_amount
  );

  return (
    <Card className="relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <Badge variant="emerald">Kempen Aktif</Badge>
            <h3 className="text-lg font-bold font-[family-name:var(--font-poppins)] text-light mt-2">
              {campaign.title}
            </h3>
          </div>
          <span className="text-3xl">💰</span>
        </div>

        {/* Description */}
        <p className="text-sm text-light-muted mb-4 leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-light-muted">Terkumpul</span>
            <span className="font-bold gold-text">
              {formatCurrency(campaign.collected_amount)}{" "}
              <span className="text-light-muted font-normal text-xs">
                / {formatCurrency(campaign.target_amount)}
              </span>
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-emerald-light font-medium">
              {percentage}% tercapai
            </span>
            <span className="text-xs text-light-muted">
              Tamat: {formatShortDate(campaign.end_date)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link href="/infaq">
          <Button variant="primary" className="w-full animate-pulse-gold">
            💳 Derma Sekarang
          </Button>
        </Link>
      </div>
    </Card>
  );
}
