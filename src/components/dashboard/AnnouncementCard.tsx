import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Announcement } from "@/types/announcement";
import { formatShortDate, truncate } from "@/lib/utils";
import { IconMegaphone, IconCalendar } from "@/components/ui/Icons";

interface AnnouncementCardProps {
  announcement: Announcement;
  compact?: boolean;
}

export function AnnouncementCard({
  announcement,
  compact = false,
}: AnnouncementCardProps) {
  return (
    <Card className={compact ? "p-4" : "p-6"}>
      <div className="flex gap-4">
        {/* Image or placeholder */}
        {announcement.image_url ? (
          <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-dark-surface">
            <img
              src={announcement.image_url}
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="shrink-0 w-16 h-16 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
            <IconMegaphone size={24} className="text-gold/60" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold font-[family-name:var(--font-poppins)] text-light leading-tight ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {announcement.title}
          </h3>
          <p className="text-xs text-light-muted mt-1 leading-relaxed">
            {truncate(announcement.description, compact ? 60 : 120)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {announcement.event_date && (
              <Badge variant="gold">
                {formatShortDate(announcement.event_date)}
              </Badge>
            )}
            {announcement.is_active && (
              <Badge variant="emerald">Aktif</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
