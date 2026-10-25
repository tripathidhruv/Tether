import type { Metadata } from "next";
import { TooltipProvider } from "@animate-ui/react/primitives/radix-ui/tooltip";
import { Sidebar } from "@/components/demo/sidebar";

export const metadata: Metadata = { title: "Tether demo: Northwind Supply" };

export default function DemoLayout({ children }: LayoutProps<"/demo">) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 p-4 lg:flex-row lg:gap-6">
        <Sidebar />
        <main className="min-w-0 flex-1 px-1 pb-16 pt-4 lg:px-4 lg:pt-8">{children}</main>
      </div>
    </TooltipProvider>
  );
}
