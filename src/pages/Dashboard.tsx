import AppNavigation from "@/components/AppNavigation";
import InsightCard from "@/components/InsightCard";
import PhaseBadge from "@/components/PhaseBadge";
import AIConfidenceMeter from "@/components/AIConfidenceMeter";
import MoodSelector from "@/components/MoodSelector";
import PregnancyWeekCard from "@/components/PregnancyWeekCard";
import SisterlyLogo from "@/components/SisterlyLogo";
import { CalendarHeart, Droplets, Moon, Sparkles, TrendingUp, Baby, Heart, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <main className="md:ml-64 pb-24 md:pb-8">
        {/* Header */}
        <header className="gradient-hero px-6 pt-8 pb-12 md:pt-10 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6 md:hidden">
              <SisterlyLogo size={34} />
              <span className="font-serif font-bold text-foreground">SISTERLY</span>
            </div>
            <p className="text-sm font-sans text-muted-foreground">Good morning ✨</p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-1">
              Your Wellness Overview
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <PhaseBadge phase="follicular" />
              <span className="text-xs font-sans text-muted-foreground">Day 8 of 28</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 -mt-6 space-y-6">
          {/* Cycle Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InsightCard
              title="Next Period"
              value="12 days"
              subtitle="Apr 28"
              icon={<CalendarHeart className="w-5 h-5 text-blush" />}
              variant="blush"
            />
            <InsightCard
              title="Fertile Window"
              value="In 3 days"
              subtitle="Apr 19–23"
              icon={<Heart className="w-5 h-5 text-lavender" />}
              variant="lavender"
            />
            <InsightCard
              title="Ovulation"
              value="Apr 21"
              subtitle="AI estimate"
              icon={<Sparkles className="w-5 h-5 text-royal" />}
            />
            <InsightCard
              title="Cycle Length"
              value="28 days"
              subtitle="Regular"
              icon={<Activity className="w-5 h-5 text-blush" />}
            />
          </div>

          {/* AI Insights */}
          <InsightCard title="AI Insight of the Day" variant="royal" icon={<Sparkles className="w-5 h-5 text-petal" />}>
            <p className="text-sm font-sans text-primary-foreground/80 mt-3 leading-relaxed">
              Based on your logged data, your cycle has been consistent for the past 3 months. Your next fertile window is estimated in 3 days — a great time to plan if you're trying to conceive.
            </p>
            <AIConfidenceMeter confidence={87} className="mt-4 [&_span]:text-primary-foreground/70 [&_p]:text-primary-foreground/50 [&>div>div>div]:bg-petal" />
          </InsightCard>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mood */}
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <MoodSelector />
            </div>

            {/* Wellness Stats */}
            <div className="bg-card rounded-3xl p-6 shadow-card space-y-4">
              <p className="text-sm font-sans font-medium text-muted-foreground">Today's Wellness</p>
              <div className="space-y-3">
                {[
                  { icon: Droplets, label: "Water", value: "5/8 glasses", pct: 62 },
                  { icon: Moon, label: "Sleep", value: "7.2 hrs", pct: 80 },
                  { icon: TrendingUp, label: "Energy", value: "Good", pct: 72 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-lavender" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-sans font-medium text-foreground">{item.label}</span>
                        <span className="text-xs font-sans text-muted-foreground">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-lavender transition-all duration-500" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pregnancy Preview */}
          <PregnancyWeekCard
            week={24}
            day={3}
            trimester={2}
            daysRemaining={112}
            babySize="An ear of corn"
          />

          {/* Baby Growth Quick View */}
          <InsightCard
            title="Baby Growth Snapshot"
            icon={<Baby className="w-5 h-5 text-blush" />}
            variant="blush"
          >
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center">
                <p className="text-xl font-serif font-bold text-foreground">3 mo</p>
                <p className="text-[10px] font-sans text-muted-foreground">Age</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-serif font-bold text-foreground">6.2 kg</p>
                <p className="text-[10px] font-sans text-muted-foreground">Weight</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-serif font-bold text-foreground">61 cm</p>
                <p className="text-[10px] font-sans text-muted-foreground">Height</p>
              </div>
            </div>
          </InsightCard>

          {/* Reminders */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <p className="text-sm font-sans font-medium text-muted-foreground mb-3">Upcoming Reminders</p>
            <div className="space-y-2">
              {[
                { text: "OB-GYN appointment", date: "Apr 22", type: "appointment" },
                { text: "DPT Vaccine — due in 5 days", date: "Apr 21", type: "vaccine" },
                { text: "Log your period when it starts", date: "~Apr 28", type: "cycle" },
              ].map((reminder, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-lavender flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-sans font-medium text-foreground">{reminder.text}</p>
                    <p className="text-xs font-sans text-muted-foreground">{reminder.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] font-sans text-muted-foreground text-center pb-4">
            This app supports health tracking and does not replace professional medical care. Please consult a healthcare professional for diagnosis or urgent medical concerns.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
