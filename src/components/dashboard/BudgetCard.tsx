import { useEffect, useState } from "react";
import { AlertTriangle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/expense-data";
import { cn } from "@/lib/utils";

export function BudgetCard({ spent }: { spent: number }) {
  const [budget, setBudget] = useState(2000);
  const [draft, setDraft] = useState(String(2000));

  useEffect(() => {
    const savedBudget = window.localStorage.getItem("expenselens-budget");
    if (!savedBudget) return;

    const parsedBudget = Number(savedBudget);
    if (Number.isFinite(parsedBudget) && parsedBudget > 0) {
      setBudget(parsedBudget);
      setDraft(String(parsedBudget));
    }
  }, []);

  const updateBudget = () => {
    const parsedBudget = parseFloat(draft);
    const nextBudget = Number.isFinite(parsedBudget) && parsedBudget > 0 ? parsedBudget : 0;
    setBudget(nextBudget);
    setDraft(String(nextBudget));
    window.localStorage.setItem("expenselens-budget", String(nextBudget));
  };

  const pct = Math.min(100, Math.round((spent / budget) * 100));
  const remaining = budget - spent;
  const exceeded = remaining < 0;

  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft p-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-brand-foreground shadow-soft">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Monthly Budget</h3>
            <p className="text-xs text-muted-foreground">Your spending allowance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="font-display text-2xl font-bold text-foreground">{formatCurrency(budget)}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Spent {formatCurrency(spent)}</span>
          <span
            className={cn(
              "font-medium",
              exceeded ? "text-destructive" : "text-success",
            )}
          >
            {pct}%
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              exceeded ? "bg-destructive" : "bg-gradient-brand",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-3 text-sm">
          {exceeded ? (
            <span className="text-destructive font-medium">
              Over budget by {formatCurrency(Math.abs(remaining))}
            </span>
          ) : (
            <span className="text-muted-foreground">
              <span className="text-foreground font-semibold">{formatCurrency(remaining)}</span>{" "}
              remaining this month
            </span>
          )}
        </p>
      </div>

      {exceeded && (
        <div className="mt-5 flex items-start gap-3 p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <p className="text-sm">You've exceeded your monthly budget. Consider reviewing your spending.</p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Input
          type="number"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="h-10 rounded-xl"
          placeholder="Update budget"
        />
        <Button
          onClick={updateBudget}
          className="h-10 rounded-xl bg-gradient-brand text-brand-foreground"
        >
          Update
        </Button>
      </div>
    </div>
  );
}