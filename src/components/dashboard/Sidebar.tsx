import { LayoutDashboard, PlusCircle, BarChart3, Wallet, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Section = "overview" | "add" | "reports" | "budget" | "export";

const items: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "add", label: "Add Expense", icon: PlusCircle },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "export", label: "Export", icon: Download },
];

export function Sidebar({
  active,
  onChange,
  open,
  onClose,
}: {
  active: Section;
  onChange: (s: Section) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}
      <aside
        className={cn(
          "fixed z-40 top-0 left-0 h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-brand-foreground font-bold shadow-soft">
              P
            </div>
            <span className="font-display text-lg font-bold">Pennywise</span>
          </div>
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-brand text-brand-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-gradient-soft p-4 border border-sidebar-border">
          <p className="text-xs font-semibold text-foreground">Stay on track</p>
          <p className="text-xs text-muted-foreground mt-1">
            Review your monthly budget to avoid surprises.
          </p>
        </div>
      </aside>
    </>
  );
}