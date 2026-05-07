import { useState } from "react";
import { CalendarIcon, PlusCircle, Banknote, Tag, FileText } from "lucide-react";
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
      date: date.toISOString().slice(0, 10),
      description: description || category,
    });
    toast.success("Expense added");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-brand text-brand-foreground shadow-soft mb-4">
            <PlusCircle className="h-7 w-7" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Add New Expense
          </h2>
          <p className="text-muted-foreground text-base">
            Record your spending in seconds. All fields are required.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-card border border-border shadow-soft p-8 backdrop-blur-sm animate-slide-up">
          <form onSubmit={submit} className="space-y-8">
            {/* Amount Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-brand/10 flex items-center justify-center">
                  <Banknote className="h-4 w-4 text-primary" />
                </div>
                <Label htmlFor="amount" className="text-base font-semibold">
                  Amount
                </Label>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-lg">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9 h-12 rounded-xl border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all bg-background/50"
                />
              </div>
            </div>

            {/* Category & Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Field */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-brand/10 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <Label className="text-base font-semibold">Category</Label>
                </div>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger className="h-12 rounded-xl border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all bg-background/50">
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

              {/* Date Field */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-brand/10 flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                  <Label className="text-base font-semibold">Date</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 rounded-xl justify-start text-left font-normal border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all bg-background/50",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {date ? format(date, "MMM dd, yyyy") : "Pick a date"}
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
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-brand/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <Label htmlFor="desc" className="text-base font-semibold">
                  Description
                </Label>
              </div>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for? (optional)"
                className="rounded-xl min-h-[100px] border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all bg-background/50 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-brand text-brand-foreground font-semibold shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300 text-base"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Expense
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground text-center">
              Your expense will be saved and synced to your account immediately.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}