import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryCard({
  label,
  value,
  icon: Icon,
  delta,
  trend,
  accent,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  trend?: "up" | "down";
  accent: string;
}) {
  return (
    <div className="group rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-soft"
          style={{ background: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full",
              trend === "up" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-4">{label}</p>
      <p className="text-2xl md:text-3xl font-display font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}