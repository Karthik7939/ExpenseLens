import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  CalendarDays,
  PiggyBank,
  TrendingUp,
  Download,
  FileText,
  Sparkles,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sidebar, type Section } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import {
  CategoryPie,
  MonthlyBar,
  TrendLine,
} from "@/components/dashboard/AnalyticsCharts";
import { ExpenseForm } from "@/components/dashboard/ExpenseForm";
import { BudgetCard } from "@/components/dashboard/BudgetCard";
import {
  CATEGORIES,
  formatCurrency,
  seedExpenses,
  type Expense,
} from "@/lib/expense-data";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const monthly = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  const topCategory = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    let best = CATEGORIES[0] as string;
    let max = 0;
    map.forEach((v, k) => {
      if (v > max) {
        max = v;
        best = k;
      }
    });
    return best;
  }, [expenses]);

  const budget = 2000;

  const handleAdd = (e: Expense) => {
    setExpenses((prev) => [e, ...prev]);
    setSection("overview");
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.success("Expense removed");
  };

  const exportCSV = () => {
    const header = ["Date", "Category", "Description", "Amount"];
    const rows = expenses.map((e) =>
      [new Date(e.date).toISOString().slice(0, 10), e.category, `"${e.description}"`, e.amount].join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <Sidebar
        active={section}
        onChange={setSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="md:pl-64">
        <Navbar
          onMenu={() => setSidebarOpen(true)}
          dark={dark}
          onToggleDark={() => setDark((v) => !v)}
        />
        <main className="p-4 md:p-8 space-y-8 animate-fade-in">
          {section === "overview" && (
            <>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back, John 👋
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Here's a snapshot of your spending this month.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                  label="Total Expenses"
                  value={formatCurrency(total)}
                  icon={DollarSign}
                  delta="4.2%"
                  trend="up"
                  accent="linear-gradient(135deg, oklch(0.62 0.21 265), oklch(0.55 0.22 285))"
                />
                <SummaryCard
                  label="Monthly Spending"
                  value={formatCurrency(monthly)}
                  icon={CalendarDays}
                  delta="2.1%"
                  trend="down"
                  accent="linear-gradient(135deg, oklch(0.65 0.18 200), oklch(0.55 0.18 220))"
                />
                <SummaryCard
                  label="Remaining Budget"
                  value={formatCurrency(Math.max(0, budget - monthly))}
                  icon={PiggyBank}
                  delta="On track"
                  trend="up"
                  accent="linear-gradient(135deg, oklch(0.7 0.17 155), oklch(0.6 0.17 175))"
                />
                <SummaryCard
                  label="Top Category"
                  value={topCategory}
                  icon={TrendingUp}
                  accent="linear-gradient(135deg, oklch(0.7 0.18 25), oklch(0.65 0.18 50))"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CategoryPie expenses={expenses} />
                <MonthlyBar expenses={expenses} />
                <TrendLine expenses={expenses} />
              </div>
              <TransactionTable expenses={expenses} onDelete={handleDelete} limit={6} />
            </>
          )}

          {section === "add" && <ExpenseForm onAdd={handleAdd} />}

          {section === "reports" && (
            <>
              <div>
                <h2 className="font-display text-2xl font-bold">Reports & Analytics</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Visualize your spending patterns.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CategoryPie expenses={expenses} />
                <MonthlyBar expenses={expenses} />
                <TrendLine expenses={expenses} />
              </div>
              <TransactionTable expenses={expenses} onDelete={handleDelete} />
            </>
          )}

          {section === "budget" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BudgetCard spent={monthly} />
              <CategoryPie expenses={expenses} />
            </div>
          )}

          {section === "export" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold">Export Data</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Download your records or generate a quick summary.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ExportTile
                  title="Export CSV"
                  description="Download all transactions as a spreadsheet."
                  icon={Download}
                  onClick={exportCSV}
                />
                <ExportTile
                  title="Download Report"
                  description="A printable PDF-style monthly report."
                  icon={FileText}
                  onClick={() => toast.success("Report queued for download")}
                />
                <ExportTile
                  title="Generate Summary"
                  description="AI-style spending summary for the month."
                  icon={Sparkles}
                  onClick={() =>
                    toast.success(
                      `You spent ${formatCurrency(monthly)} this month. Top category: ${topCategory}.`,
                    )
                  }
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ExportTile({
  title,
  description,
  icon: Icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300 animate-slide-up"
    >
      <div className="h-12 w-12 rounded-xl bg-gradient-brand text-brand-foreground flex items-center justify-center shadow-soft">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <span className="mt-4 inline-block text-sm font-medium text-primary">Run action →</span>
    </button>
  );
}
