import { LayoutDashboard, PlusCircle, BarChart3, Wallet, Download, X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import logoUrl from "@/components/ui/expenselens.png";

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
  collapsed,
  onToggleCollapse,
  onWidthChange,
}: {
  active: Section;
  onChange: (s: Section) => void;
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onWidthChange?: (width: number) => void;
}) {
  const [width, setWidth] = useState(256); // 256px = w-64
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLAsideElement>(null);

  useEffect(() => {
    onWidthChange?.(width);
  }, [width, onWidthChange]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const newWidth = e.clientX;
      // Constrain width between 160px (min) and 400px (max)
      if (newWidth >= 160 && newWidth <= 400) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Use custom width unless collapsed
  const sidebarWidth = collapsed ? "w-20" : undefined;
  const sidebarStyle = collapsed ? {} : { width: `${width}px` };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed z-40 top-0 left-0 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:translate-x-0",
          "transition-[width] duration-200 ease-out will-change-[width]",
          sidebarWidth || "md:w-64",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={sidebarStyle}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="ExpenseLens logo" className="h-8 w-8 object-contain" />
              <span className="font-display text-lg font-bold">ExpenseLens</span>
            </div>
          )}
          {collapsed && (
            <img src={logoUrl} alt="ExpenseLens logo" className="h-8 w-8 object-contain" />
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex items-center justify-center h-8 w-8 rounded-md hover:bg-sidebar-accent transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")} />
            </button>
            <button
              onClick={onClose}
              className="md:hidden text-muted-foreground hover:text-foreground h-8 w-8 flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className={cn("space-y-1", collapsed ? "p-2" : "p-4")}>
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
                title={collapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-brand text-brand-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "md:p-3 md:justify-center",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-gradient-soft p-4 border border-sidebar-border">
            <p className="text-xs font-semibold text-foreground">Stay on track</p>
            <p className="text-xs text-muted-foreground mt-1">
              Review your monthly budget to avoid surprises.
            </p>
          </div>
        )}
        {/* Resize Handle */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className={cn(
            "absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-accent/60 transition-colors",
            isDragging && "bg-accent",
            "hidden md:block"
          )}
        />
      </aside>
    </>
  );
}