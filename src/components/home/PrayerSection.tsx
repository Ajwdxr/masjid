import { HijriDate } from "@/components/dashboard/HijriDate";
import { LiveClock } from "@/components/dashboard/LiveClock";
import { PrayerTimes } from "@/components/dashboard/PrayerTimes";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconMosque } from "@/components/ui/Icons";
import { fetchPrayerTimes } from "@/lib/prayer-times";

export async function PrayerSection() {
  const prayerData = await fetchPrayerTimes();

  return (
    <div className="space-y-6">
      {/* ─── Date & Clock ─── */}
      <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Card className="text-center py-6 space-y-3">
          <HijriDate hijriFromApi={prayerData.hijriDate} />
          <LiveClock />
        </Card>
      </section>

      {/* ─── Prayer Times ─── */}
      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }} data-facility="Prayer Times">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] gold-text flex items-center gap-2">
              <IconMosque size={20} className="text-gold" />
              Waktu Solat
            </h2>
            <Badge variant="muted">{prayerData.zone}</Badge>
          </div>
          <PrayerTimes prayers={prayerData.prayers} />
        </Card>
      </section>
    </div>
  );
}
