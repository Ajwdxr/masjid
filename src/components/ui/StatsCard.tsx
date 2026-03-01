/* ─── Stats Card Component ─── */

import { Card } from "./Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  variant?: "gold" | "emerald" | "default";
}

export function StatsCard({
  title,
  value,
  icon,
  subtitle,
  variant = "default",
}: StatsCardProps) {
  const accentColor =
    variant === "gold"
      ? "text-gold"
      : variant === "emerald"
        ? "text-emerald-light"
        : "text-light";

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-light-muted font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className={`text-2xl font-bold font-[family-name:var(--font-poppins)] mt-1 ${accentColor}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-emerald-light mt-1">{subtitle}</p>
          )}
        </div>
        <span className="text-2xl opacity-50">{icon}</span>
      </div>
      {variant === "gold" && (
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gold/5 rounded-full blur-xl" />
      )}
    </Card>
  );
}
