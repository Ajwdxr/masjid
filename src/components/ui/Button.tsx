/* ─── Reusable Button Component ─── */

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variants = {
  primary:
    "gold-gradient text-dark font-semibold hover:opacity-90 shadow-lg",
  secondary:
    "bg-emerald text-light hover:bg-emerald-light",
  outline:
    "border border-gold/30 text-gold hover:bg-gold/10",
  ghost:
    "text-light-muted hover:text-light hover:bg-dark-surface",
  danger:
    "bg-danger text-light hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-[var(--radius-btn)]",
  lg: "px-7 py-3.5 text-base rounded-[var(--radius-btn)]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
