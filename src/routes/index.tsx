import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  CalendarDays,
  PiggyBank,
  TrendingUp,
  Download,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  type Expense,
} from "@/lib/expense-data";
import * as api from "@/lib/api";
import { jsPDF } from "jspdf";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [dark, setDark] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return expenses;
    const query = searchQuery.toLowerCase();
    return expenses.filter((e) =>
      e.description.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      e.amount.toString().includes(query) ||
      new Date(e.date).toISOString().slice(0, 10).includes(query)
    );
  }, [expenses, searchQuery]);

  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);
  const monthly = useMemo(() => {
    const now = new Date();
    return filtered
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [filtered]);

  const topCategory = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    let best = CATEGORIES[0] as string;
    let max = 0;
    map.forEach((v, k) => {
      if (v > max) {
        max = v;
        best = k;
      }
    });
    return best;
  }, [filtered]);

  const budget = 2000;

  const handleAdd = (e: Expense) => {
    // Post to backend, then insert returned record (which contains id)
    (async () => {
      try {
        const created = await api.createExpense({
          date: e.date,
          category: e.category,
          description: e.description,
          amount: e.amount,
        });
        setExpenses((prev) => [created, ...prev]);
        setSection("overview");
        toast.success("Expense added");
      } catch (err) {
        console.error(err);
        toast.error("Failed to add expense");
      }
    })();
  };

  const handleDelete = (id: string) => {
    (async () => {
      try {
        await api.deleteExpense(id);
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        toast.success("Expense removed");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete expense");
      }
    })();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await api.fetchExpenses();
        if (mounted) setExpenses(list);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load expenses");
      } finally {
        if (mounted) setLoadingExpenses(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      const ensureSpace = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = 18;
        }
      };

      const sectionTitle = (title: string) => {
        ensureSpace(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(title, margin, y);
        y += 6;
        doc.setDrawColor(180);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
      };

      doc.setFillColor(46, 111, 64);
      doc.rect(0, 0, pageWidth, 24, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("ExpenseLens Report", margin, 15);

      y = 34;
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      y += 10;

      sectionTitle("Overview");
      doc.setFontSize(11);
      const overviewLines = [
        `Total expenses: INR ${total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `This month: INR ${monthly.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Remaining budget: INR ${Math.max(0, budget - monthly).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Top category: ${topCategory}`,
        `Total transactions: ${expenses.length}`,
      ];
      overviewLines.forEach((line) => {
        ensureSpace(7);
        doc.text(line, margin, y);
        y += 7;
      });

      y += 2;
      sectionTitle("Transactions");

      if (expenses.length === 0) {
        ensureSpace(10);
        doc.setFont("helvetica", "normal");
        doc.text("No expense data available yet.", margin, y);
      } else {
        const sortedExpenses = [...expenses].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        const drawHeader = () => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Date", margin, y);
          doc.text("Category", margin + 30, y);
          doc.text("Amount", margin + 70, y);
          doc.text("Description", margin + 102, y);
          y += 4;
          doc.setDrawColor(220);
          doc.line(margin, y, pageWidth - margin, y);
          y += 6;
        };

        drawHeader();

        sortedExpenses.forEach((expense) => {
          const date = new Date(expense.date).toISOString().slice(0, 10);
          const amountText = `INR ${expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          const descriptionLines = doc.splitTextToSize(expense.description, contentWidth - 102);
          const rowHeight = Math.max(8, descriptionLines.length * 5);

          ensureSpace(rowHeight + 6);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(date, margin, y);
          doc.text(expense.category, margin + 30, y);
          doc.text(amountText, margin + 70, y);
          doc.text(descriptionLines, margin + 102, y);
          y += rowHeight;
        });
      }

      doc.save(`ExpenseLens-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <Sidebar
        active={section}
        onChange={setSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        onWidthChange={setSidebarWidth}
      />
      <div
        className={cn(
          "transition-[padding] duration-200 ease-out will-change-[padding]",
          sidebarCollapsed ? "md:pl-20" : ""
        )}
        style={sidebarCollapsed ? {} : { paddingLeft: `${sidebarWidth}px` }}
      >
        <Navbar
          onMenu={() => setSidebarOpen(true)}
          dark={dark}
          onToggleDark={() => setDark((v) => !v)}
          onSearch={setSearchQuery}
        />
        <main className="p-4 md:p-8 space-y-8 animate-fade-in">
          {section === "overview" && (
            <>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back! 👋
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Here's a snapshot of your spending this month.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                  label="Total Expenses"
                  value={formatCurrency(total)}
                  icon={IndianRupee}
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
                <CategoryPie expenses={filtered} />
                <MonthlyBar expenses={filtered} />
                <TrendLine expenses={filtered} />
              </div>
              <TransactionTable expenses={filtered} onDelete={handleDelete} limit={6} />
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
                <CategoryPie expenses={filtered} />
                <MonthlyBar expenses={filtered} />
                <TrendLine expenses={filtered} />
              </div>
              <TransactionTable expenses={filtered} onDelete={handleDelete} />
            </>
          )}

          {section === "budget" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BudgetCard spent={monthly} />
              <CategoryPie expenses={filtered} />
            </div>
          )}

          {section === "export" && (
            <div>
              <div className="mb-8">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Export Data</h2>
                <p className="text-muted-foreground text-base">
                  Download your records in multiple formats for further analysis.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
                <ExportTile
                  title="Export as CSV"
                  description="Download all your transactions as a spreadsheet file. Perfect for Excel, Google Sheets, or data analysis tools."
                  icon={Download}
                  onClick={exportCSV}
                  accent="linear-gradient(135deg, oklch(0.62 0.21 265), oklch(0.55 0.22 285))"
                />
                <ExportTile
                  title="Download PDF Report"
                  description="Generate a professionally formatted PDF report with your spending summary and transaction details."
                  icon={FileText}
                  onClick={exportPDF}
                  accent="linear-gradient(135deg, oklch(0.65 0.18 200), oklch(0.55 0.18 220))"
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
  accent,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative text-left rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 animate-slide-up"
    >
      {/* Background gradient accent */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={accent ? { background: accent } : {}}
      />
      
      <div className="relative p-8 h-full flex flex-col">
        {/* Icon Container */}
        <div 
          className="h-16 w-16 rounded-2xl text-brand-foreground flex items-center justify-center shadow-soft mb-6 transition-transform duration-300 group-hover:scale-110"
          style={accent ? { background: accent } : { backgroundColor: 'var(--color-primary)' }}
        >
          <Icon className="h-7 w-7" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-display text-xl font-bold text-foreground mb-3">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>

        {/* CTA */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all duration-300">
            Download now
            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </div>
      </div>
    </button>
  );
}
