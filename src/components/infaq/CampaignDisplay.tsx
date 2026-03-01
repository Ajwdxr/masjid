import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Campaign } from "@/types/campaign";
import { formatCurrency, calcPercentage, formatDate } from "@/lib/utils";

interface CampaignDisplayProps {
  campaign: Campaign;
}

export function CampaignDisplay({ campaign }: CampaignDisplayProps) {
  const percentage = calcPercentage(
    campaign.collected_amount,
    campaign.target_amount
  );

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <Card className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald/5 rounded-full blur-2xl" />

      <div className="relative space-y-5">
        {/* Badge + Title */}
        <div>
          <Badge variant="emerald">Kempen Aktif</Badge>
          <h2 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-poppins)] text-light mt-3">
            {campaign.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-light-muted leading-relaxed">
          {campaign.description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-dark-surface/50 border border-dark-border/50">
            <p className="text-xs text-light-muted mb-1">Sasaran</p>
            <p className="text-sm font-bold gold-text">
              {formatCurrency(campaign.target_amount)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-emerald/10 border border-emerald/20">
            <p className="text-xs text-emerald-light mb-1">Terkumpul</p>
            <p className="text-sm font-bold text-light">
              {formatCurrency(campaign.collected_amount)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-dark-surface/50 border border-dark-border/50">
            <p className="text-xs text-light-muted mb-1">Baki Hari</p>
            <p className="text-sm font-bold text-gold">
              {daysLeft} <span className="text-xs font-normal text-light-muted">hari</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-light-muted">Kemajuan</span>
            <span className="font-bold text-gold">{percentage}%</span>
          </div>
          <div className="progress-bar h-4 rounded-full">
            <div
              className="progress-bar-fill h-full rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* End date */}
        <p className="text-xs text-light-muted text-center">
          Tamat: {formatDate(campaign.end_date)}
        </p>
      </div>
    </Card>
  );
}
