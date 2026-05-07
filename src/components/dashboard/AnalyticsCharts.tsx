import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { CATEGORY_COLORS, formatCurrency, type Expense, CATEGORIES } from "@/lib/expense-data";
import { useMemo } from "react";

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-card border border-border shadow-soft p-5 animate-slide-up ${className ?? ""}`}
    >
      <div className="mb-4">
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function CategoryPie({ expenses }: { expenses: Expense[] }) {
  const data = useMemo(() => {
    return CATEGORIES.map((c) => ({
      name: c,
      value: expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0),
    })).filter((d) => d.value > 0);
  }, [expenses]);

  if (data.length === 0) {
    return (
      <ChartCard title="Spending by Category" subtitle="Where your money goes">
        <EmptyChartState message="No expense data yet." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Spending by Category" subtitle="Where your money goes">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={CATEGORY_COLORS[d.name as keyof typeof CATEGORY_COLORS]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
            }}
            formatter={(v: number) => formatCurrency(v)}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MonthlyBar({ expenses }: { expenses: Expense[] }) {
  const data = useMemo(() => {
    if (expenses.length === 0) return [];

    const map = new Map<string, number>();
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = d.toLocaleString("en-US", { month: "short" });
      map.set(key, (map.get(key) ?? 0) + e.amount);
    });
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date().getMonth();
    return Array.from({ length: 6 }).map((_, i) => {
      const m = months[(now - 5 + i + 12) % 12];
      return { month: m, amount: map.get(m) ?? 0 };
    });
  }, [expenses]);

  if (data.length === 0) {
    return (
      <ChartCard title="Monthly Spending" subtitle="Last 6 months">
        <EmptyChartState message="No expense data yet." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Monthly Spending" subtitle="Last 6 months">
      <ResponsiveContainer>
        <BarChart data={data}>
          <defs>
            <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.21 265)" />
              <stop offset="100%" stopColor="oklch(0.55 0.22 285)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "color-mix(in oklab, var(--primary) 8%, transparent)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
            }}
            formatter={(v: number) => formatCurrency(v)}
          />
          <Bar dataKey="amount" fill="url(#barFill)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TrendLine({ expenses }: { expenses: Expense[] }) {
  const data = useMemo(() => {
    if (expenses.length === 0) return [];

    const days = 14;
    return Array.from({ length: days }).map((_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (days - 1 - i));
      const total = expenses
        .filter((e) => new Date(e.date).toDateString() === day.toDateString())
        .reduce((s, e) => s + e.amount, 0);
      return {
        day: day.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
        amount: total,
      };
    });
  }, [expenses]);

  if (data.length === 0) {
    return (
      <ChartCard title="Expense Trend" subtitle="Daily spending over the last 14 days">
        <EmptyChartState message="No expense data yet." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Expense Trend" subtitle="Daily spending over the last 14 days">
      <ResponsiveContainer>
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.62 0.21 265)" />
              <stop offset="100%" stopColor="oklch(0.55 0.22 285)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
            }}
            formatter={(v: number) => formatCurrency(v)}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="url(#lineFill)"
            strokeWidth={3}
            dot={{ r: 3, fill: "oklch(0.55 0.22 268)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}