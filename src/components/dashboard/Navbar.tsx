import { Search, Menu, Bell, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import logoUrl from "@/components/ui/expenselens.png";

export function Navbar({
  onMenu,
  dark,
  onToggleDark,
  onSearch,
}: {
  onMenu: () => void;
  dark: boolean;
  onToggleDark: () => void;
  onSearch: (query: string) => void;
}) {
  const [notificationCount, setNotificationCount] = useState(3);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  const notifications = [
    { id: 1, title: "Budget Alert", message: "You're nearing your monthly budget", time: "5m ago", read: false },
    { id: 2, title: "New Expense", message: "Your grocery expense was recorded", time: "1h ago", read: false },
    { id: 3, title: "Category Spike", message: "Dining expenses increased by 23%", time: "2h ago", read: true },
  ];

  const handleNotificationClick = () => {
    setHasNewNotifications(false);
    setNotificationCount(0);
    toast.success("All notifications marked as read");
  };

  return (
    <header className="sticky top-0 z-20 h-32 border-b border-border/50 bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-xl shadow-lg">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="h-full px-6 md:px-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-accent/50 transition-colors rounded-xl" onClick={onMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-brand p-2 shadow-soft hover:shadow-lift transition-all duration-300 flex items-center justify-center">
              <img src={logoUrl} alt="ExpenseLens logo" className="h-full w-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                ExpenseLens
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Smart expense tracking
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses…"
              className="pl-11 w-72 bg-gradient-to-br from-background to-background/50 border-border/50 rounded-full focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md text-sm"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-accent/50 transition-colors rounded-xl">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-xl hover:bg-accent/50 transition-all duration-300 group">
                <Bell className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                {hasNewNotifications && (
                  <>
                    <span className="absolute top-0 right-0 h-3 w-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full animate-pulse shadow-lg" />
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full opacity-30 animate-ping" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold text-base">
                Notifications {notificationCount > 0 && `(${notificationCount})`}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className="flex flex-col items-start gap-1 py-3 px-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          notif.read ? "bg-muted" : "bg-primary"
                        }`}
                      />
                      <span className="font-semibold text-sm text-foreground flex-1">
                        {notif.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{notif.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-4">
                      {notif.message}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleNotificationClick}
                className="text-center justify-center text-xs font-semibold text-primary cursor-pointer"
              >
                Mark all as read
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}