import Link from "next/link";
import { TripwireList } from "@/components/demo/tripwire-list";
import { Card, CardTitle, PageHeader } from "@/components/ui";
import { tripwires } from "@/lib/data";

export default function TripwiresPage() {
  const armed = tripwires.filter((t) => t.armed).length;

  return (
    <>
      <PageHeader
        title="Tripwires"
        intro="Fake files, keys and links that no real task ever needs. An attacker who copies an agent's normal behavior perfectly still has to reach for something valuable, and a tripwire is what they find."
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardTitle aside={<span className="text-[14.5px] text-ink-3">{armed} of {tripwires.length} armed</span>}>Placed tripwires</CardTitle>
          <TripwireList />
        </Card>
        <section className="rounded-[26px] bg-forest p-7 text-white xl:col-span-4">
          <p className="text-[15.5px] font-semibold text-leaf">Caught today, 08:15</p>
          <p className="mt-3 text-[20px] font-bold leading-snug">Report Builder opened salaries_2026_FINAL.xlsx</p>
          <p className="mt-3 text-[16px] leading-relaxed text-[#DCE5DE]">
            Its sequence and timing looked normal, so habit scoring alone stayed quiet. The tripwire set its score to 100: it was served decoy data and isolated read-only.
          </p>
          <Link href="/demo/alerts/ALR-1039" className="mt-6 inline-block text-[15.5px] font-semibold text-leaf underline-offset-4 hover:underline">
            Open the alert
          </Link>
        </section>
      </div>
    </>
  );
}
