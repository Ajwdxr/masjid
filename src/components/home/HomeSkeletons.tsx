export function SectionSkeleton() {
  return (
    <div className="w-full h-40 bg-dark-card border border-dark-border rounded-2xl animate-pulse flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
    </div>
  );
}

export function PrayerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="w-full h-32 bg-dark-card border border-dark-border rounded-2xl animate-pulse" />
      <div className="w-full h-64 bg-dark-card border border-dark-border rounded-2xl animate-pulse" />
    </div>
  );
}
