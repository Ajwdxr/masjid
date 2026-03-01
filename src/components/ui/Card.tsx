/* ─── Reusable Card Component ─── */

import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-dark-card border border-dark-border rounded-[var(--radius-card)] p-6 transition-all duration-300",
        hover && "hover:border-gold/20 hover:shadow-[0_0_20px_rgba(200,169,81,0.05)]",
        className
      )}
    >
      {children}
    </div>
  );
}
