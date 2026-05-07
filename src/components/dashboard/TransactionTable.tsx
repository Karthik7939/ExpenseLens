import { useMemo, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS, formatCurrency, type Expense } from "@/lib/expense-data";
import { format } from "date-fns";

export function TransactionTable({
  expenses,
  onDelete,
  limit,
}: {
  expenses: Expense[];
  onDelete?: (id: string) => void;
  limit?: number;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const list = expenses.filter(
      (e) =>
        e.description.toLowerCase().includes(q.toLowerCase()) ||
        e.category.toLowerCase().includes(q.toLowerCase()),
    );
    return limit ? list.slice(0, limit) : list;
  }, [expenses, q, limit]);

  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
      <div className="p-5 flex items-center justify-between gap-3 border-b border-border">
        <div>
          <h3 className="font-display font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground">Latest spending activity</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter…"
            className="pl-9 rounded-full bg-background"
          />
        </div>
      </div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Description</th>
              <th className="text-right px-5 py-3 font-medium">Amount</th>
              {onDelete && <th className="text-right px-5 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  No transactions found.
                </td>
              </tr>
            )}
            {filtered.map((e) => (
              <tr
                key={e.id}
                className="border-t border-border hover:bg-muted/40 transition-colors"
              >
                <td className="px-5 py-3 text-muted-foreground">
                  {format(new Date(e.date), "MMM d, yyyy")}
                </td>
                <td className="px-5 py-3">
                  <Badge
                    variant="secondary"
                    className="rounded-full font-medium"
                    style={{
                      background: `color-mix(in oklab, ${CATEGORY_COLORS[e.category]} 18%, transparent)`,
                      color: CATEGORY_COLORS[e.category],
                    }}
                  >
                    {e.category}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-foreground">{e.description}</td>
                <td className="px-5 py-3 text-right font-semibold text-foreground">
                  {formatCurrency(e.amount)}
                </td>
                {onDelete && (
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(e.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked list */}
      <div className="md:hidden px-4 py-3 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-6">No transactions found.</div>
        )}
        {filtered.map((e) => (
          <div key={e.id} className="rounded-xl bg-background/60 border border-border p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">{format(new Date(e.date), "MMM d, yyyy")}</div>
                <div className="mt-1 font-semibold text-foreground">{e.description}</div>
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full font-medium text-xs"
                    style={{
                      background: `color-mix(in oklab, ${CATEGORY_COLORS[e.category]} 18%, transparent)`,
                      color: CATEGORY_COLORS[e.category],
                    }}
                  >
                    {e.category}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm font-semibold">{formatCurrency(e.amount)}</div>
                {onDelete && (
                  <div className="inline-flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(e.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}