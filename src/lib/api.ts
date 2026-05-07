import { Expense } from "./expense-data";

const BASE = "http://127.0.0.1:8000";

export async function fetchExpenses(): Promise<Expense[]> {
  const res = await fetch(`${BASE}/expenses`);
  if (!res.ok) throw new Error("Failed to load expenses");
  const data = await res.json();
  // map backend ids (numbers) to strings to match frontend types
  return data.map((e: any) => ({ ...e, id: String(e.id) }));
}

export async function createExpense(e: Omit<Expense, "id">): Promise<Expense> {
  const res = await fetch(`${BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  const data = await res.json();
  return { ...data, id: String(data.id) };
}

export async function deleteExpense(id: string | number): Promise<void> {
  const res = await fetch(`${BASE}/expenses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}
