import { Search, Moon, Sun, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar({
  onMenu,
  dark,
  onToggleDark,
}: {
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base md:text-lg font-display font-bold text-foreground">
              Personal Expense Tracker
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Reports & insights at a glance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses…"
              className="pl-9 w-64 bg-background border-border rounded-full"
            />
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleDark} aria-label="Toggle dark mode">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-gradient-brand flex items-center justify-center text-brand-foreground text-sm font-semibold shadow-soft">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}