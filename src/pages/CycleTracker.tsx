import AppNavigation from "@/components/AppNavigation";
import PhaseBadge from "@/components/PhaseBadge";
import AIConfidenceMeter from "@/components/AIConfidenceMeter";
import InsightCard from "@/components/InsightCard";
import { Thermometer, Droplets, Sparkles, Plus, Save, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { firebaseStore } from "@/integrations/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";
type Flow = "none" | "spotting" | "light" | "medium" | "heavy";

interface Cycle {
  id: string;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
  notes: string | null;
}

interface DailyLog {
  id?: string;
  log_date: string;
  flow: Flow | null;
  symptoms: string[];
  mood: string | null;
  bbt: number | null;
  notes: string | null;
}

const SYMPTOMS = ["Cramps", "Bloating", "Headache", "Fatigue", "Tender breasts", "Acne", "Cravings", "Nausea"];
const MOODS = ["Happy", "Calm", "Anxious", "Sad", "Irritable", "Energetic"];
const FLOWS: Flow[] = ["none", "spotting", "light", "medium", "heavy"];

const PHASE_COLORS: Record<Phase, string> = {
  menstrual: "bg-blush/40 text-foreground",
  follicular: "bg-petal/60 text-foreground",
  ovulation: "bg-lavender/30 text-foreground",
  luteal: "bg-royal/10 text-foreground",
};

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const parseISO = (s: string) => new Date(s + "T00:00:00");
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);

const computePhase = (date: Date, cycles: Cycle[], avgLength: number): Phase | null => {
  if (!cycles.length) return null;
  // Find most recent cycle starting on or before this date
  const sorted = [...cycles].sort((a, b) => b.start_date.localeCompare(a.start_date));
  const ref = sorted.find((c) => parseISO(c.start_date) <= date);
  if (!ref) return null;
  const dayInCycle = daysBetween(parseISO(ref.start_date), date) + 1;
  if (dayInCycle > avgLength + 5) return null; // beyond predicted cycle
  const periodLen = ref.end_date ? daysBetween(parseISO(ref.start_date), parseISO(ref.end_date)) + 1 : 5;
  const ovulationDay = avgLength - 14;
  if (dayInCycle <= periodLen) return "menstrual";
  if (dayInCycle < ovulationDay - 1) return "follicular";
  if (dayInCycle <= ovulationDay + 1) return "ovulation";
  return "luteal";
};

const computeAvgCycleLength = (cycles: Cycle[]): number => {
  const lengths = cycles.map((c) => c.cycle_length).filter((l): l is number => !!l);
  if (!lengths.length) return 28;
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
};

const CycleTracker = () => {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => toISO(new Date()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [flow, setFlow] = useState<Flow>("none");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>("");
  const [bbt, setBbt] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const avgLength = useMemo(() => computeAvgCycleLength(cycles), [cycles]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const [cyclesRes, logsRes] = await Promise.all([
      firebaseStore.from("cycles").select("*").order("start_date", { ascending: false }),
      firebaseStore.from("cycle_daily_logs").select("*").order("log_date", { ascending: false }).limit(180),
    ]);
    if (cyclesRes.error) toast.error("Failed to load cycles");
    if (logsRes.error) toast.error("Failed to load logs");

    const cyclesData = (cyclesRes.data || []) as Cycle[];
    setCycles(cyclesData);
    const logMap: Record<string, DailyLog> = {};
    (logsRes.data || []).forEach((l: any) => { logMap[l.log_date] = l; });
    setLogs(logMap);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user]);

  // Load selected day form
  useEffect(() => {
    const log = logs[selectedDate];
    setFlow((log?.flow as Flow) || "none");
    setSymptoms(log?.symptoms || []);
    setMood(log?.mood || "");
    setBbt(log?.bbt != null ? String(log.bbt) : "");
    setNotes(log?.notes || "");
  }, [selectedDate, logs]);

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const saveLog = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.uid,
      log_date: selectedDate,
      flow,
      symptoms,
      mood: mood || null,
      bbt: bbt ? parseFloat(bbt) : null,
      notes: notes || null,
    };
    const { data, error } = await firebaseStore
      .from("cycle_daily_logs")
      .upsert(payload, { onConflict: "user_id,log_date" })
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast.error("Couldn't save log");
      return;
    }
    setLogs((prev) => ({ ...prev, [selectedDate]: data as DailyLog }));
    toast.success("Log saved");
  };

  const startCycleHere = async () => {
    if (!user) return;
    // Check if a cycle already exists for this date
    if (cycles.some((c) => c.start_date === selectedDate)) {
      toast.info("Cycle already starts on this day");
      return;
    }
    setSaving(true);
    const { data, error } = await firebaseStore
      .from("cycles")
      .insert({ user_id: user.uid, start_date: selectedDate })
      .select()
      .single();

    if (!error && data) {
      // Update cycle_length on the previous cycle (if any)
      const newCycle = data as Cycle;
      const prev = cycles.find((c) => c.start_date < newCycle.start_date);
      if (prev) {
        const len = daysBetween(parseISO(prev.start_date), parseISO(newCycle.start_date));
        await firebaseStore.from("cycles").update({ cycle_length: len }).eq("id", prev.id);
      }
      await loadData();
      toast.success("Period start logged");
    } else {
      toast.error("Couldn't log cycle start");
    }
    setSaving(false);
  };

  const deleteCycleHere = async () => {
    const cycle = cycles.find((c) => c.start_date === selectedDate);
    if (!cycle) return;
    const { error } = await firebaseStore.from("cycles").delete().eq("id", cycle.id);
    if (error) { toast.error("Couldn't delete cycle"); return; }
    await loadData();
    toast.success("Cycle removed");
  };

  // Calendar generation
  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDayOffset = viewMonth.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1);
    return { day: i + 1, iso: toISO(d), date: d };
  });

  const cycleStartDates = new Set(cycles.map((c) => c.start_date));
  const isCycleStart = cycleStartDates.has(selectedDate);

  // Predictions
  const lastCycle = cycles[0];
  const nextPeriodDate = lastCycle
    ? new Date(parseISO(lastCycle.start_date).getTime() + avgLength * 86400000)
    : null;
  const ovulationStart = lastCycle
    ? new Date(parseISO(lastCycle.start_date).getTime() + (avgLength - 15) * 86400000)
    : null;
  const ovulationEnd = lastCycle
    ? new Date(parseISO(lastCycle.start_date).getTime() + (avgLength - 13) * 86400000)
    : null;
  const confidence = Math.min(95, 60 + cycles.length * 8);

  const formatPretty = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <main className="md:ml-64 pb-24 md:pb-8">
        <header className="px-6 pt-8 pb-4">
          <div className="max-w-4xl mx-auto flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Cycle Tracker</h1>
              <p className="text-sm font-sans text-muted-foreground mt-1">
                {cycles.length} cycle{cycles.length !== 1 ? "s" : ""} logged · avg {avgLength} days
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 space-y-6">
          {/* Calendar */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="font-serif font-semibold text-foreground min-w-[160px] text-center">{monthLabel}</h3>
                <button
                  onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["menstrual", "follicular", "ovulation", "luteal"] as Phase[]).map((p) => (
                  <PhaseBadge key={p} phase={p} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-xs font-sans font-medium text-muted-foreground py-1">{d}</div>
              ))}
              {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e${i}`} />)}
              {monthDays.map(({ day, iso, date }) => {
                const phase = computePhase(date, cycles, avgLength);
                const isSelected = iso === selectedDate;
                const hasLog = !!logs[iso];
                const isStart = cycleStartDates.has(iso);
                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDate(iso)}
                    className={cn(
                      "h-10 rounded-xl text-sm font-sans font-medium transition-all duration-200 relative",
                      phase ? PHASE_COLORS[phase] : "hover:bg-muted",
                      isSelected && "ring-2 ring-royal shadow-soft scale-110",
                      isStart && "ring-2 ring-blush"
                    )}
                  >
                    {day}
                    {hasLog && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-royal" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Detail */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <h3 className="font-serif font-semibold text-foreground">
                  {parseISO(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </h3>
                {(() => {
                  const p = computePhase(parseISO(selectedDate), cycles, avgLength);
                  return p ? <PhaseBadge phase={p} /> : null;
                })()}
              </div>

              {isCycleStart ? (
                <button
                  onClick={deleteCycleHere}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-sans font-medium text-blush hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove period start
                </button>
              ) : (
                <button
                  onClick={startCycleHere}
                  disabled={saving}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-full bg-blush/20 text-foreground hover:bg-blush/30 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" /> Log period start
                </button>
              )}

              <p className="text-xs font-sans font-medium text-muted-foreground mb-2 mt-5">Flow</p>
              <div className="flex flex-wrap gap-2">
                {FLOWS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlow(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all capitalize",
                      flow === f
                        ? "bg-blush/30 border-blush text-foreground"
                        : "bg-muted/50 border-transparent text-muted-foreground hover:border-border"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <p className="text-xs font-sans font-medium text-muted-foreground mb-2 mt-4">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all",
                      symptoms.includes(s)
                        ? "bg-lavender/20 border-lavender text-foreground"
                        : "bg-muted/50 border-transparent text-muted-foreground hover:border-border"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="text-xs font-sans font-medium text-muted-foreground mb-2 mt-4">Mood</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(mood === m ? "" : m)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all",
                      mood === m
                        ? "bg-petal/40 border-petal text-foreground"
                        : "bg-muted/50 border-transparent text-muted-foreground hover:border-border"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">BBT (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={bbt}
                    onChange={(e) => setBbt(e.target.value)}
                    placeholder="36.5"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="How are you feeling?"
                    className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all resize-none"
                  />
                </div>
              </div>

              <button
                onClick={saveLog}
                disabled={saving || loading}
                className="mt-4 w-full py-2.5 rounded-2xl gradient-cta text-primary-foreground font-sans font-semibold text-sm shadow-soft hover:shadow-elevated transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save log"}
              </button>
            </div>

            <div className="space-y-4">
              <InsightCard
                title="BBT Today"
                value={logs[selectedDate]?.bbt ? `${logs[selectedDate].bbt}°C` : "—"}
                subtitle={logs[selectedDate]?.bbt ? "Logged" : "Not logged"}
                icon={<Thermometer className="w-5 h-5 text-blush" />}
                variant="blush"
              />
              <InsightCard
                title="Flow"
                value={(logs[selectedDate]?.flow || "None").replace(/^\w/, (c) => c.toUpperCase())}
                subtitle={(() => {
                  const p = computePhase(parseISO(selectedDate), cycles, avgLength);
                  return p ? `${p.charAt(0).toUpperCase()}${p.slice(1)} phase` : "No cycle data yet";
                })()}
                icon={<Droplets className="w-5 h-5 text-lavender" />}
                variant="lavender"
              />
            </div>
          </div>

          {/* AI Predictions */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-lavender" />
              <h3 className="font-serif font-semibold text-foreground">AI Cycle Predictions</h3>
            </div>
            {cycles.length === 0 ? (
              <p className="text-sm font-sans text-muted-foreground">
                Log your first period start above to unlock personalized predictions.
              </p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/50">
                    <p className="text-xs font-sans text-muted-foreground">Next Period</p>
                    <p className="text-lg font-serif font-bold text-foreground">
                      {nextPeriodDate ? formatPretty(nextPeriodDate) : "—"}
                    </p>
                    <AIConfidenceMeter confidence={confidence} className="mt-2" />
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/50">
                    <p className="text-xs font-sans text-muted-foreground">Ovulation Window</p>
                    <p className="text-lg font-serif font-bold text-foreground">
                      {ovulationStart && ovulationEnd
                        ? `${formatPretty(ovulationStart)}–${ovulationEnd.getDate()}`
                        : "—"}
                    </p>
                    <AIConfidenceMeter confidence={Math.max(50, confidence - 10)} className="mt-2" />
                  </div>
                </div>
                <p className="text-[10px] font-sans text-muted-foreground mt-4 italic">
                  Based on your logged data, this is an AI-assisted estimate. Please consult a healthcare professional for medical decisions.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CycleTracker;
