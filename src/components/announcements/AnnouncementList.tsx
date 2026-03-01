import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Announcement } from "@/types/announcement";
import { formatDate, truncate } from "@/lib/utils";

interface AnnouncementListProps {
  announcements: Announcement[];
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <Card className="text-center py-12">
        <span className="text-4xl mb-4 block">📭</span>
        <p className="text-light-muted">Tiada pengumuman buat masa ini.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((item, index) => (
        <Card
          key={item.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.08}s` } as React.CSSProperties}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            {item.image_url ? (
              <div className="shrink-0 w-full sm:w-40 h-40 sm:h-28 rounded-lg overflow-hidden bg-dark-surface">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="shrink-0 w-full sm:w-40 h-40 sm:h-28 rounded-lg bg-gradient-to-br from-gold/10 to-emerald/10 flex items-center justify-center border border-dark-border">
                <span className="text-5xl opacity-30">🕌</span>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-light leading-tight">
                  {item.title}
                </h3>
                {item.is_active ? (
                  <Badge variant="emerald">Aktif</Badge>
                ) : (
                  <Badge variant="muted">Tamat</Badge>
                )}
              </div>

              <p className="text-sm text-light-muted mt-2 leading-relaxed">
                {truncate(item.description, 200)}
              </p>

              <div className="flex items-center gap-3 mt-3">
                {item.event_date && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-gold text-xs">📅</span>
                    <span className="text-xs text-gold font-medium">
                      {formatDate(item.event_date)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-light-muted text-xs">🕐</span>
                  <span className="text-xs text-light-muted">
                    Ditambah: {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
