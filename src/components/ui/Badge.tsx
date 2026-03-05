/* ─── Badge Component ─── */

import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "gold" | "emerald" | "danger" | "warning" | "muted" | "success";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  gold: "bg-gold/15 text-gold border-gold/20",
  emerald: "bg-emerald/15 text-emerald-light border-emerald/20",
  danger: "bg-danger/15 text-danger border-danger/20",
  warning: "bg-warning/15 text-warning border-warning/20",
  success: "bg-emerald/15 text-emerald-light border-emerald/20",
  muted: "bg-dark-surface text-light-muted border-dark-border",
};

export function Badge({ variant = "gold", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
