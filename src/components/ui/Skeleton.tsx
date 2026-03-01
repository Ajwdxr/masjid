/* ─── Skeleton Loading Component ─── */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-dark-surface rounded-lg",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-[var(--radius-card)] p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-8 w-1/3 mt-4" />
    </div>
  );
}
