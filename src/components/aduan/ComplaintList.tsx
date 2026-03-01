import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Complaint } from "@/types/complaint";
import { formatDate } from "@/lib/utils";

interface ComplaintListProps {
  complaints: Complaint[];
}

const categoryIcons: Record<string, string> = {
  Kebersihan: "🧹",
  Kemudahan: "🔧",
  Pengurusan: "📋",
  Keselamatan: "🛡️",
  "Lain-lain": "📌",
};

export function ComplaintList({ complaints }: ComplaintListProps) {
  if (complaints.length === 0) {
    return (
      <Card className="text-center py-12">
        <span className="text-4xl mb-4 block">📭</span>
        <p className="text-light-muted">Tiada aduan direkodkan.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {complaints.map((item, index) => (
        <Card
          key={item.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.06}s` } as React.CSSProperties}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-dark-surface flex items-center justify-center text-lg border border-dark-border">
              {categoryIcons[item.category] || "📌"}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="gold">{item.category}</Badge>
                <Badge
                  variant={
                    item.status === "Selesai" ? "emerald" : "warning"
                  }
                >
                  {item.status}
                </Badge>
                {item.is_anonymous && (
                  <Badge variant="muted">🙈 Tanpa Nama</Badge>
                )}
              </div>
              <p className="text-sm text-light mt-1.5 leading-relaxed">
                {item.description}
              </p>
              {item.image_url && (
                <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-dark-surface border border-dark-border">
                  <img
                    src={item.image_url}
                    alt="Lampiran"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-light-muted mt-2">
                {formatDate(item.created_at)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
