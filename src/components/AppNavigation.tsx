import { cn } from "@/lib/utils";
import { Home, CalendarHeart, Baby, Heart, Sparkles, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SisterlyLogo from "@/components/SisterlyLogo";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/cycle", icon: CalendarHeart, label: "Cycle" },
  { path: "/pregnancy", icon: Heart, label: "Pregnancy" },
  { path: "/baby", icon: Baby, label: "Baby" },
  { path: "/insights", icon: Sparkles, label: "AI Insights" },
  { path: "/profile", icon: User, label: "Profile" },
];

const AppNavigation = () => {
  const location = useLocation();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200",
                  active ? "text-royal" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", active && "animate-pulse-soft")} />
                <span className="text-[10px] font-sans font-medium">{item.label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-royal" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-card border-r border-border z-40">
        <div className="p-6">
          <SisterlyLogo size={44} showWordmark tagline />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-sans text-sm transition-all duration-200",
                  active
                    ? "gradient-cta text-primary-foreground font-semibold shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mx-3 mb-4 rounded-2xl bg-muted/50">
          <p className="text-[10px] font-sans text-muted-foreground text-center leading-relaxed">
            This app supports health tracking and does not replace professional medical care.
          </p>
        </div>
      </aside>
    </>
  );
};

export default AppNavigation;
