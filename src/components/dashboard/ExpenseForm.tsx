import { useState } from "react";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CATEGORIES, type Category, type Expense } from "@/lib/expense-data";

export function ExpenseForm({ onAdd }: { onAdd: (e: Expense) => void }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || !category || !date) {
      toast.error("Please fill in amount, category and date.");
      return;
    }
    onAdd({
      id: Math.random().toString(36).slice(2),
      amount: num,
      category,
      date: date.toISOString(),
      description: description || category,
    });
    toast.success("Expense added");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date());
  };

  return (
    <div className="max-w-xl mx-auto rounded-2xl bg-card border border-border shadow-soft p-6 md:p-8 animate-slide-up">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Add Expense</h2>
        <p className="text-sm text-muted-foreground">Log a new transaction in seconds.</p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 h-11 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-11 rounded-xl justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="rounded-xl min-h-[88px]"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-gradient-brand text-brand-foreground shadow-soft hover:shadow-lift transition-shadow"
        >
          <PlusCircle className="h-4 w-4" />
          Add Expense
        </Button>
      </form>
    </div>
  );
}