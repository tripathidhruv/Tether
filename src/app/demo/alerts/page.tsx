import { AlertList } from "@/components/demo/alert-list";
import { PageHeader } from "@/components/ui";

export default function AlertsPage() {
  return (
    <>
      <PageHeader
        title="Alerts"
        intro="Every alert carries a Drift Score, the reason behind each point, the input that caused it and what Tether already did about it."
      />
      <AlertList />
    </>
  );
}
