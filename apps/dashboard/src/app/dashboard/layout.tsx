import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-base)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Subtle background glow effect for dashboard */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-brand-primary)]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
          
          <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
