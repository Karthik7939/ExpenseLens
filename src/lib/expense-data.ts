export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Other";

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO
  description: string;
}

const today = new Date();
const d = (offset: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() - offset);
  return x.toISOString();
};

export const seedExpenses: Expense[] = [
  { id: "1", amount: 42.5, category: "Food", date: d(0), description: "Lunch with team" },
  { id: "2", amount: 18.0, category: "Transport", date: d(1), description: "Uber to office" },
  { id: "3", amount: 129.99, category: "Shopping", date: d(2), description: "New headphones" },
  { id: "4", amount: 64.2, category: "Bills", date: d(3), description: "Internet bill" },
  { id: "5", amount: 32.0, category: "Entertainment", date: d(4), description: "Movie night" },
  { id: "6", amount: 22.5, category: "Food", date: d(5), description: "Groceries run" },
  { id: "7", amount: 88.0, category: "Health", date: d(7), description: "Pharmacy" },
  { id: "8", amount: 14.75, category: "Food", date: d(9), description: "Coffee & snacks" },
  { id: "9", amount: 210.0, category: "Bills", date: d(12), description: "Electricity" },
  { id: "10", amount: 56.4, category: "Shopping", date: d(15), description: "Books" },
  { id: "11", amount: 9.99, category: "Entertainment", date: d(20), description: "Streaming" },
  { id: "12", amount: 27.3, category: "Transport", date: d(25), description: "Fuel" },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "oklch(0.7 0.18 25)",
  Transport: "oklch(0.65 0.17 200)",
  Shopping: "oklch(0.6 0.22 300)",
  Bills: "oklch(0.6 0.18 145)",
  Entertainment: "oklch(0.7 0.18 60)",
  Health: "oklch(0.65 0.18 350)",
  Other: "oklch(0.55 0.05 260)",
};

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);