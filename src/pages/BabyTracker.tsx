import AppNavigation from "@/components/AppNavigation";
import InsightCard from "@/components/InsightCard";
import { Baby, Ruler, Weight, Syringe, Moon, Utensils, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const vaccines = [
  { name: "BCG", status: "completed" as const, date: "Jan 15, 2026" },
  { name: "Hepatitis B (1st)", status: "completed" as const, date: "Jan 15, 2026" },
  { name: "DPT (1st)", status: "due" as const, date: "Apr 21, 2026" },
  { name: "Polio (2nd)", status: "due" as const, date: "Apr 21, 2026" },
  { name: "Rotavirus (2nd)", status: "overdue" as const, date: "Apr 10, 2026" },
];

const milestones = [
  { month: 1, text: "First smile", done: true },
  { month: 2, text: "Holds head up", done: true },
  { month: 3, text: "Follows objects with eyes", done: true },
  { month: 3, text: "Coos and babbles", done: false },
  { month: 4, text: "Rolls over", done: false },
];

const statusColors: Record<string, string> = {
  completed: "bg-lavender/20 text-lavender border-lavender/30",
  due: "bg-petal/40 text-plum border-petal/50",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

const BabyTracker = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <main className="md:ml-64 pb-24 md:pb-8">
        <header className="gradient-hero px-6 pt-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-serif font-bold text-foreground">Baby Dashboard</h1>
            <p className="text-sm font-sans text-muted-foreground mt-1">Baby growth snapshot</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 -mt-6 space-y-6">
          {/* Baby Profile Card */}
          <div className="bg-card rounded-3xl p-6 shadow-elevated">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center">
                <Baby className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground">Baby Amara</h2>
                <p className="text-sm font-sans text-muted-foreground">Born January 15, 2026</p>
                <p className="text-lg font-serif font-semibold text-lavender mt-0.5">3 months old</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <Weight className="w-4 h-4 text-blush mx-auto mb-1" />
                <p className="text-lg font-serif font-bold text-foreground">6.2 kg</p>
                <p className="text-[10px] font-sans text-muted-foreground">Weight</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <Ruler className="w-4 h-4 text-lavender mx-auto mb-1" />
                <p className="text-lg font-serif font-bold text-foreground">61 cm</p>
                <p className="text-[10px] font-sans text-muted-foreground">Height</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <Star className="w-4 h-4 text-royal mx-auto mb-1" />
                <p className="text-lg font-serif font-bold text-foreground">15.8</p>
                <p className="text-[10px] font-sans text-muted-foreground">BMI</p>
              </div>
            </div>
          </div>

          {/* Today's Log */}
          <div className="grid sm:grid-cols-2 gap-4">
            <InsightCard title="Feeding Today" value="5 sessions" subtitle="Last: 2h ago — breastfed" icon={<Utensils className="w-5 h-5 text-blush" />} variant="blush" />
            <InsightCard title="Sleep Today" value="14.5 hrs" subtitle="3 naps + overnight" icon={<Moon className="w-5 h-5 text-lavender" />} variant="lavender" />
          </div>

          {/* Milestones */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="font-serif font-semibold text-foreground mb-4">Development Milestones</h3>
            <div className="space-y-2">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border-2",
                    m.done ? "bg-lavender border-lavender" : "border-border"
                  )}>
                    {m.done && <span className="text-accent-foreground text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-sans", m.done ? "font-medium text-foreground" : "text-muted-foreground")}>{m.text}</p>
                    <p className="text-[10px] font-sans text-muted-foreground">Month {m.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vaccination Schedule */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Syringe className="w-4 h-4 text-lavender" />
              <h3 className="font-serif font-semibold text-foreground">Vaccination Schedule</h3>
            </div>
            <div className="space-y-2">
              {vaccines.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                  <div>
                    <p className="text-sm font-sans font-medium text-foreground">{v.name}</p>
                    <p className="text-xs font-sans text-muted-foreground">{v.date}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-sans font-semibold border capitalize",
                    statusColors[v.status]
                  )}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BabyTracker;
