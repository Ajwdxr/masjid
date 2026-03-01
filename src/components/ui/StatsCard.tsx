/* ─── Stats Card Component ─── */

import { Card } from "./Card";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  variant?: "gold" | "emerald" | "default";
}

export function StatsCard({
  label,
  value,
  icon,
  change,
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
            {label}
          </p>
          <p className={`text-2xl font-bold font-[family-name:var(--font-poppins)] mt-1 ${accentColor}`}>
            {value}
          </p>
          {change && (
            <p className="text-xs text-emerald-light mt-1">{change}</p>
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
