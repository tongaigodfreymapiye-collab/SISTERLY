import AppNavigation from "@/components/AppNavigation";
import PregnancyWeekCard from "@/components/PregnancyWeekCard";
import InsightCard from "@/components/InsightCard";
import AIConfidenceMeter from "@/components/AIConfidenceMeter";
import { Heart, Sparkles, Apple, Activity, Calendar, Plus, Save, Trash2, Baby } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { firebaseStore } from "@/integrations/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Pregnancy {
  id: string;
  due_date: string;
  lmp_date: string | null;
  conception_date: string | null;
  status: "active" | "completed" | "ended";
  notes: string | null;
}

interface Milestone {
  id: string;
  pregnancy_id: string;
  week: number;
  title: string;
  note: string | null;
  milestone_date: string | null;
}

interface Appointment {
  id: string;
  pregnancy_id: string;
  title: string;
  appointment_date: string;
  notes: string | null;
}

const BABY_SIZES: Record<number, string> = {
  4: "Poppy seed", 5: "Sesame seed", 6: "Lentil", 7: "Blueberry", 8: "Kidney bean",
  9: "Grape", 10: "Kumquat", 11: "Fig", 12: "Lime", 13: "Lemon", 14: "Peach",
  15: "Apple", 16: "Avocado", 17: "Pear", 18: "Bell pepper", 19: "Mango",
  20: "Banana", 21: "Carrot", 22: "Papaya", 23: "Grapefruit", 24: "Ear of corn",
  25: "Cauliflower", 26: "Lettuce head", 27: "Cabbage", 28: "Eggplant",
  29: "Butternut squash", 30: "Cucumber", 31: "Coconut", 32: "Squash",
  33: "Pineapple", 34: "Cantaloupe", 35: "Honeydew melon", 36: "Romaine lettuce",
  37: "Swiss chard", 38: "Leek", 39: "Mini watermelon", 40: "Small pumpkin",
};

const DEFAULT_MILESTONES: Record<number, string> = {
  4: "Heart begins to form", 8: "All major organs forming", 12: "End of first trimester",
  16: "Baby can hear sounds", 20: "Halfway point — anatomy scan", 24: "Viability milestone reached",
  28: "Third trimester begins", 32: "Bones fully formed", 36: "Considered full-term soon",
  40: "Estimated due date",
};

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const parseISO = (s: string) => new Date(s + "T00:00:00");
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);

const computeWeekAndDay = (dueDate: string) => {
  const due = parseISO(dueDate);
  const conceptionPlus40 = due;
  // 40 weeks (280 days) from LMP. Today's gestational day = 280 - daysUntilDue
  const daysUntilDue = daysBetween(new Date(), conceptionPlus40);
  const gestDay = 280 - daysUntilDue;
  const week = Math.max(0, Math.floor(gestDay / 7));
  const day = Math.max(0, gestDay % 7);
  const trimester = week < 13 ? 1 : week < 27 ? 2 : 3;
  return { week, day, trimester, daysRemaining: Math.max(0, daysUntilDue) };
};

const formatDate = (s: string) =>
  parseISO(s).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const PregnancyTracker = () => {
  const { user } = useAuth();
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Setup form
  const [setupDueDate, setSetupDueDate] = useState("");
  const [setupLmpDate, setSetupLmpDate] = useState("");
  const [savingSetup, setSavingSetup] = useState(false);

  // Edit due date
  const [editingDue, setEditingDue] = useState(false);
  const [newDueDate, setNewDueDate] = useState("");

  // Add milestone
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneWeek, setMilestoneWeek] = useState<number>(1);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneNote, setMilestoneNote] = useState("");

  // Add appointment
  const [showAptForm, setShowAptForm] = useState(false);
  const [aptTitle, setAptTitle] = useState("");
  const [aptDate, setAptDate] = useState("");

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    const { data: preg } = await firebaseStore
      .from("pregnancies")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const p = preg as Pregnancy | null;
    setPregnancy(p);

    if (p) {
      const [{ data: ms }, { data: apts }] = await Promise.all([
        firebaseStore.from("pregnancy_milestones").select("*").eq("pregnancy_id", p.id).order("week"),
        firebaseStore.from("pregnancy_appointments").select("*").eq("pregnancy_id", p.id).order("appointment_date"),
      ]);
      setMilestones((ms || []) as Milestone[]);
      setAppointments((apts || []) as Appointment[]);
      setMilestoneWeek(computeWeekAndDay(p.due_date).week || 1);
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [user]);

  const computed = useMemo(() => (pregnancy ? computeWeekAndDay(pregnancy.due_date) : null), [pregnancy]);

  const startPregnancy = async () => {
    if (!user) return;
    let dueDate = setupDueDate;
    // Allow LMP-based calc if due date not provided
    if (!dueDate && setupLmpDate) {
      const lmp = parseISO(setupLmpDate);
      dueDate = toISO(new Date(lmp.getTime() + 280 * 86400000));
    }
    if (!dueDate) {
      toast.error("Provide a due date or LMP date");
      return;
    }
    setSavingSetup(true);
    const { data, error } = await firebaseStore
      .from("pregnancies")
      .insert({
        user_id: user.uid,
        due_date: dueDate,
        lmp_date: setupLmpDate || null,
      })
      .select()
      .single();
    setSavingSetup(false);
    if (error) { toast.error("Couldn't start pregnancy"); return; }
    setPregnancy(data as Pregnancy);
    setMilestoneWeek(computeWeekAndDay((data as Pregnancy).due_date).week || 1);
    toast.success("Pregnancy started — congratulations!");
  };

  const saveDueDate = async () => {
    if (!pregnancy || !newDueDate) return;
    const { data, error } = await firebaseStore
      .from("pregnancies")
      .update({ due_date: newDueDate })
      .eq("id", pregnancy.id)
      .select()
      .single();
    if (error) { toast.error("Couldn't update"); return; }
    setPregnancy(data as Pregnancy);
    setEditingDue(false);
    toast.success("Due date updated");
  };

  const endPregnancy = async () => {
    if (!pregnancy) return;
    if (!confirm("End this pregnancy record? It will be archived.")) return;
    const { error } = await firebaseStore
      .from("pregnancies")
      .update({ status: "completed" })
      .eq("id", pregnancy.id);
    if (error) { toast.error("Couldn't archive"); return; }
    setPregnancy(null);
    setMilestones([]);
    setAppointments([]);
    toast.success("Pregnancy archived");
  };

  const addMilestone = async () => {
    if (!user || !pregnancy || !milestoneTitle.trim()) {
      toast.error("Add a title");
      return;
    }
    const { data, error } = await firebaseStore
      .from("pregnancy_milestones")
      .insert({
        user_id: user.uid,
        pregnancy_id: pregnancy.id,
        week: milestoneWeek,
        title: milestoneTitle.trim(),
        note: milestoneNote.trim() || null,
        milestone_date: toISO(new Date()),
      })
      .select()
      .single();
    if (error) { toast.error("Couldn't save milestone"); return; }
    setMilestones((prev) => [...prev, data as Milestone].sort((a, b) => a.week - b.week));
    setMilestoneTitle("");
    setMilestoneNote("");
    setShowMilestoneForm(false);
    toast.success("Milestone saved");
  };

  const deleteMilestone = async (id: string) => {
    const { error } = await firebaseStore.from("pregnancy_milestones").delete().eq("id", id);
    if (error) { toast.error("Couldn't delete"); return; }
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const addAppointment = async () => {
    if (!user || !pregnancy || !aptTitle.trim() || !aptDate) {
      toast.error("Add title and date");
      return;
    }
    const { data, error } = await firebaseStore
      .from("pregnancy_appointments")
      .insert({
        user_id: user.uid,
        pregnancy_id: pregnancy.id,
        title: aptTitle.trim(),
        appointment_date: new Date(aptDate).toISOString(),
      })
      .select()
      .single();
    if (error) { toast.error("Couldn't save"); return; }
    setAppointments((prev) => [...prev, data as Appointment].sort((a, b) => a.appointment_date.localeCompare(b.appointment_date)));
    setAptTitle("");
    setAptDate("");
    setShowAptForm(false);
    toast.success("Appointment saved");
  };

  const deleteAppointment = async (id: string) => {
    const { error } = await firebaseStore.from("pregnancy_appointments").delete().eq("id", id);
    if (error) { toast.error("Couldn't delete"); return; }
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Build display milestones: defaults near current week + user-saved
  const displayMilestones = useMemo(() => {
    if (!computed) return [];
    const w = computed.week;
    const defaultsNearby = [w - 2, w - 1, w, w + 1, w + 2]
      .filter((x) => x >= 4 && x <= 40)
      .map((week) => ({
        id: `default-${week}`,
        week,
        title: DEFAULT_MILESTONES[week] || `Week ${week} development`,
        note: null,
        isDefault: true,
        size: BABY_SIZES[week],
      }));
    const userSaved = milestones.map((m) => ({
      id: m.id, week: m.week, title: m.title, note: m.note, isDefault: false, size: BABY_SIZES[m.week],
    }));
    return [...defaultsNearby, ...userSaved].sort((a, b) => a.week - b.week);
  }, [computed, milestones]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <main className="md:ml-64 pb-24 md:pb-8 px-6 pt-8">
          <p className="text-sm font-sans text-muted-foreground">Loading…</p>
        </main>
      </div>
    );
  }

  // Setup empty state
  if (!pregnancy) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <main className="md:ml-64 pb-24 md:pb-8">
          <header className="px-6 pt-8 pb-4">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-serif font-bold text-foreground">Pregnancy Journey</h1>
              <p className="text-sm font-sans text-muted-foreground mt-1">Let's set up your tracker</p>
            </div>
          </header>
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-card rounded-3xl p-8 shadow-card">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl gradient-pregnancy flex items-center justify-center">
                  <Baby className="w-7 h-7 text-plum" />
                </div>
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground text-center">Start tracking your pregnancy</h2>
              <p className="text-sm font-sans text-muted-foreground text-center mt-1 mb-6">
                Enter your due date or last menstrual period — we'll calculate the rest.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">Estimated due date</label>
                  <input
                    type="date"
                    value={setupDueDate}
                    onChange={(e) => setSetupDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                  />
                </div>
                <div className="text-center text-xs font-sans text-muted-foreground">— or —</div>
                <div>
                  <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">Last menstrual period</label>
                  <input
                    type="date"
                    value={setupLmpDate}
                    onChange={(e) => setSetupLmpDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                  />
                  <p className="text-[11px] font-sans text-muted-foreground mt-1">Due date = LMP + 280 days</p>
                </div>
                <button
                  onClick={startPregnancy}
                  disabled={savingSetup}
                  className="w-full py-3 rounded-2xl gradient-cta text-primary-foreground font-sans font-semibold text-sm shadow-soft hover:shadow-elevated transition-all disabled:opacity-60"
                >
                  {savingSetup ? "Starting…" : "Start tracking"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const w = computed!;
  const upcomingApts = appointments.filter((a) => new Date(a.appointment_date) >= new Date());

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <main className="md:ml-64 pb-24 md:pb-8">
        <header className="px-6 pt-8 pb-4">
          <div className="max-w-4xl mx-auto flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Pregnancy Journey</h1>
              <p className="text-sm font-sans text-muted-foreground mt-1">Trimester {w.trimester} · {w.daysRemaining} days to go</p>
            </div>
            <button
              onClick={endPregnancy}
              className="text-xs font-sans text-muted-foreground hover:text-blush underline-offset-4 hover:underline"
            >
              Archive pregnancy
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <PregnancyWeekCard
            week={w.week}
            day={w.day}
            trimester={w.trimester}
            daysRemaining={w.daysRemaining}
            babySize={BABY_SIZES[w.week] || "Growing fast"}
          />

          {/* Due Date */}
          <InsightCard
            title="Estimated Due Date"
            value={formatDate(pregnancy.due_date)}
            subtitle={pregnancy.lmp_date ? `Based on LMP ${formatDate(pregnancy.lmp_date)}` : "User provided"}
            icon={<Calendar className="w-5 h-5 text-royal" />}
          >
            <AIConfidenceMeter confidence={89} className="mt-3" />
            {editingDue ? (
              <div className="mt-3 flex gap-2 items-center">
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans"
                />
                <button onClick={saveDueDate} className="px-3 py-2 rounded-xl bg-royal text-primary-foreground text-xs font-sans font-semibold">Save</button>
                <button onClick={() => setEditingDue(false)} className="px-3 py-2 rounded-xl bg-muted text-xs font-sans">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setNewDueDate(pregnancy.due_date); setEditingDue(true); }}
                className="mt-3 text-xs font-sans text-royal hover:underline"
              >
                Edit due date
              </button>
            )}
          </InsightCard>

          {/* Fetal Development & Milestones */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lavender" />
                <h3 className="font-serif font-semibold text-foreground">Fetal Development & Your Milestones</h3>
              </div>
              <button
                onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-full bg-lavender/20 text-foreground hover:bg-lavender/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add milestone
              </button>
            </div>

            {showMilestoneForm && (
              <div className="mb-4 p-4 rounded-2xl bg-muted/40 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">Week</label>
                    <input
                      type="number"
                      min={1}
                      max={42}
                      value={milestoneWeek}
                      onChange={(e) => setMilestoneWeek(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-muted-foreground mb-1">Title</label>
                    <input
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      placeholder="First kick felt"
                      className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm font-sans"
                    />
                  </div>
                </div>
                <textarea
                  value={milestoneNote}
                  onChange={(e) => setMilestoneNote(e.target.value)}
                  placeholder="Notes (optional)"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm font-sans resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={addMilestone} className="flex-1 py-2 rounded-xl gradient-cta text-primary-foreground text-xs font-sans font-semibold inline-flex items-center justify-center gap-1.5">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={() => setShowMilestoneForm(false)} className="px-4 py-2 rounded-xl bg-muted text-xs font-sans">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {displayMilestones.map((m) => {
                const isCurrent = m.week === w.week;
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl transition-all",
                      isCurrent ? "gradient-pregnancy shadow-soft" : "bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                      isCurrent ? "bg-card/60" : "bg-card"
                    )}>
                      <span className="text-sm font-serif font-bold text-foreground">{m.week}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-semibold text-foreground">{m.title}</p>
                      {m.size && <p className="text-xs font-sans text-muted-foreground">Size: ~{m.size}</p>}
                      {m.note && <p className="text-xs font-sans text-foreground/70 mt-1 italic">{m.note}</p>}
                      <div className="flex gap-2 items-center mt-1">
                        {isCurrent && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-lavender/20 text-lavender text-[10px] font-sans font-semibold">
                            This week
                          </span>
                        )}
                        {!("isDefault" in m && m.isDefault) && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-blush/20 text-blush text-[10px] font-sans font-semibold">
                            Yours
                          </span>
                        )}
                      </div>
                    </div>
                    {!("isDefault" in m && m.isDefault) && (
                      <button
                        onClick={() => deleteMilestone(m.id)}
                        className="p-1.5 rounded-lg hover:bg-blush/20 text-muted-foreground hover:text-blush transition-colors"
                        aria-label="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] font-sans text-muted-foreground mt-4 italic">
              AI-assisted developmental estimates. Educational reference only — not a diagnosis.
            </p>
          </div>

          {/* Maternal Health */}
          <div className="grid sm:grid-cols-3 gap-4">
            <InsightCard title="Weight" value="—" subtitle="Log to track" icon={<Activity className="w-5 h-5 text-blush" />} variant="blush" />
            <InsightCard title="Blood Pressure" value="—" subtitle="Log to track" icon={<Heart className="w-5 h-5 text-lavender" />} variant="lavender" />
            <InsightCard title="Nutrition" value="Tips" subtitle="Iron + folic acid" icon={<Apple className="w-5 h-5 text-blush" />} />
          </div>

          {/* Appointments */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
              <h3 className="font-serif font-semibold text-foreground">Upcoming Appointments</h3>
              <button
                onClick={() => setShowAptForm(!showAptForm)}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-full bg-royal/10 text-royal hover:bg-royal/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAptForm && (
              <div className="mb-4 p-4 rounded-2xl bg-muted/40 space-y-3">
                <input
                  value={aptTitle}
                  onChange={(e) => setAptTitle(e.target.value)}
                  placeholder="Appointment title"
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm font-sans"
                />
                <input
                  type="datetime-local"
                  value={aptDate}
                  onChange={(e) => setAptDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm font-sans"
                />
                <div className="flex gap-2">
                  <button onClick={addAppointment} className="flex-1 py-2 rounded-xl gradient-cta text-primary-foreground text-xs font-sans font-semibold">Save</button>
                  <button onClick={() => setShowAptForm(false)} className="px-4 py-2 rounded-xl bg-muted text-xs font-sans">Cancel</button>
                </div>
              </div>
            )}

            {upcomingApts.length === 0 ? (
              <p className="text-sm font-sans text-muted-foreground">No upcoming appointments. Add your next prenatal visit.</p>
            ) : (
              <div className="space-y-2">
                {upcomingApts.map((apt) => {
                  const d = new Date(apt.appointment_date);
                  return (
                    <div key={apt.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-lavender" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans font-medium text-foreground truncate">{apt.title}</p>
                        <p className="text-xs font-sans text-muted-foreground">
                          {d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteAppointment(apt.id)}
                        className="p-1.5 rounded-lg hover:bg-blush/20 text-muted-foreground hover:text-blush transition-colors"
                        aria-label="Delete appointment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PregnancyTracker;
