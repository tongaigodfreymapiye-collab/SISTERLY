import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavigation from "@/components/AppNavigation";
import GradientButton from "@/components/GradientButton";
import SisterlyLogo from "@/components/SisterlyLogo";
import { User, Bell, Shield, Download, Trash2, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { firebaseStore, db } from "@/integrations/firebase/client";
import { deleteUser } from "firebase/auth";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { toast } from "sonner";

const settingsSections = [
  {
    title: "Health Preferences",
    icon: Heart,
    items: ["Active tracking mode: Cycle + Pregnancy", "Pregnancy due date: Aug 5, 2026", "Baby profile: Amara"],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: ["Period reminders: On", "Vaccination alerts: On", "Appointment reminders: On"],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    items: ["Data encryption: Active", "Two-factor authentication: Off", "Data sharing: None"],
  },
];

interface ProfileRow {
  display_name: string | null;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    if (!user) return;
    firebaseStore
      .from("profiles")
      .select("display_name, created_at")
      .eq("id", user.uid)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const exportData = async () => {
    if (!user) return;
    const names = ["profiles", "cycles", "cycle_daily_logs", "pregnancies", "pregnancy_milestones", "pregnancy_appointments", "baby_profiles", "baby_logs", "vaccinations"];
    const result: Record<string, unknown[]> = {};
    for (const name of names) {
      const snap = await getDocs(query(collection(db, name), where("owner_uid", "==", user.uid)));
      result[name] = snap.docs.map(item => ({ id: item.id, ...item.data() }));
    }
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), data: result }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sisterly-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Your data export is ready");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm("Permanently delete your SISTERLY account and all saved health records? This cannot be undone.");
    if (!confirmed) return;
    try {
      const names = ["profiles", "cycles", "cycle_daily_logs", "pregnancies", "pregnancy_milestones", "pregnancy_appointments", "baby_profiles", "baby_logs", "vaccinations"];
      for (const name of names) {
        const snap = await getDocs(query(collection(db, name), where("owner_uid", "==", user.uid)));
        await Promise.all(snap.docs.map(item => deleteDoc(doc(db, name, item.id))));
      }
      const storage = getStorage();
      const userFiles = ref(storage, `users/${user.uid}`);
      const files = await listAll(userFiles).catch(() => ({ items: [] as any[], prefixes: [] as any[] }));
      await Promise.all(files.items.map(item => deleteObject(item)));
      await deleteUser(user);
      toast.success("Your account and saved records have been deleted");
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(error?.code === "auth/requires-recent-login" ? "For security, sign out and sign in again before deleting your account." : (error?.message || "Account deletion failed"));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/", { replace: true });
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <main className="md:ml-64 pb-24 md:pb-8">
        <header className="gradient-hero px-6 pt-8 pb-12">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-cta flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">
                {profile?.display_name || user?.email?.split("@")[0] || "Welcome"}
              </h1>
              <p className="text-sm font-sans text-muted-foreground">{user?.email}</p>
              <p className="text-xs font-sans text-muted-foreground mt-0.5">Member since {memberSince}</p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 -mt-4 space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="bg-card rounded-3xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-lavender" />
                <h3 className="font-serif font-semibold text-foreground">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                    <span className="text-sm font-sans text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Account */}
          <div className="bg-card rounded-3xl p-6 shadow-card space-y-3">
            <h3 className="font-serif font-semibold text-foreground">Account</h3>
            <div className="flex flex-wrap gap-3">
              <GradientButton variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" /> Export Data
              </GradientButton>
              <GradientButton variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </GradientButton>
              <GradientButton variant="ghost" size="sm" onClick={handleDeleteAccount} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </GradientButton>
            </div>
          </div>

          {/* Brand */}
          <div className="text-center py-6 space-y-2">
            <SisterlyLogo size={48} className="mx-auto" />
            <p className="font-serif font-bold text-sm text-foreground">SISTERLY</p>
            <p className="text-[10px] font-sans text-muted-foreground">
              Designed by AI-powered Software & Cybersecurity Engineer — Tongai Godfrey Mapiye © 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
