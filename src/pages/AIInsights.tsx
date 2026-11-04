import AppNavigation from "@/components/AppNavigation";
import AIConfidenceMeter from "@/components/AIConfidenceMeter";
import InsightCard from "@/components/InsightCard";
import { Sparkles, ChevronDown, CalendarHeart, Heart, Baby, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const predictions = [
  {
    category: "Menstrual",
    icon: CalendarHeart,
    title: "Next Period Prediction",
    value: "April 28, 2026",
    confidence: 91,
    explanation: "Based on your last 6 cycles averaging 28.2 days, with a standard deviation of 1.1 days. Your recent cycle consistency is excellent.",
  },
  {
    category: "Fertility",
    icon: Heart,
    title: "Optimal Conception Window",
    value: "April 19–21, 2026",
    confidence: 84,
    explanation: "Calculated from your BBT pattern showing a consistent pre-ovulatory dip around day 13. Combined with cervical mucus logs showing peak fertility signals.",
  },
  {
    category: "Pregnancy",
    icon: TrendingUp,
    title: "Due Date Estimate",
    value: "August 5, 2026",
    confidence: 89,
    explanation: "Calculated using Naegele's rule from your LMP of October 29, 2025, cross-referenced with your reported ovulation date and clinician-confirmed measurements.",
  },
  {
    category: "Baby",
    icon: Baby,
    title: "Growth Trajectory",
    value: "On track — 50th percentile",
    confidence: 78,
    explanation: "Based on 3 months of weight and length data compared to WHO growth standards. Baby Amara is tracking steadily along the 50th percentile curve.",
  },
];

const AIInsights = () => {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <main className="md:ml-64 pb-24 md:pb-8">
        <header className="px-6 pt-8 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-lavender" />
              <h1 className="text-2xl font-serif font-bold text-foreground">AI Insights</h1>
            </div>
            <p className="text-sm font-sans text-muted-foreground">Wellness trends tailored to you</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 space-y-6">
          {/* Overview */}
          <InsightCard title="AI Health Score" value="92" subtitle="Based on cycle regularity, wellness habits, and tracking consistency" variant="royal" icon={<Sparkles className="w-5 h-5 text-petal" />}>
            <AIConfidenceMeter confidence={92} className="mt-3 [&_span]:text-primary-foreground/70 [&_p]:text-primary-foreground/50 [&>div>div>div]:bg-petal" />
          </InsightCard>

          {/* Prediction Cards */}
          <div className="space-y-3">
            {predictions.map((p, i) => (
              <div key={i} className="bg-card rounded-3xl shadow-card overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className="w-10 h-10 rounded-2xl gradient-accent flex items-center justify-center flex-shrink-0">
                    <p.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-sans text-muted-foreground">{p.category}</p>
                    <p className="text-sm font-sans font-semibold text-foreground truncate">{p.title}</p>
                    <p className="text-lg font-serif font-bold text-foreground">{p.value}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs font-sans font-semibold text-lavender">{p.confidence}%</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      expanded === i && "rotate-180"
                    )} />
                  </div>
                </button>
                {expanded === i && (
                  <div className="px-5 pb-5 pt-0 animate-fade-in">
                    <div className="p-4 rounded-2xl bg-muted/50 space-y-3">
                      <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">Why this prediction</p>
                      <p className="text-sm font-sans text-foreground leading-relaxed">{p.explanation}</p>
                      <AIConfidenceMeter confidence={p.confidence} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[10px] font-sans text-muted-foreground text-center italic pb-4">
            All predictions are AI-assisted estimates based on your logged data. This app does not replace professional medical care.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
