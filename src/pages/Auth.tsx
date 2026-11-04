import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { firebaseStore } from "@/integrations/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import SisterlyLogo from "@/components/SisterlyLogo";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "signup") {
        const { error } = await firebaseStore.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already")) {
            toast.error("An account with this email already exists. Please sign in.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome to SISTERLY 💗");
          navigate(from, { replace: true });
        }
      } else {
        const { error } = await firebaseStore.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("invalid")) {
            toast.error("Invalid email or password.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back");
          navigate(from, { replace: true });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>

        <div className="bg-card rounded-3xl p-8 shadow-elevated">
          <div className="flex flex-col items-center mb-6">
            <SisterlyLogo size={72} className="mb-3" />
            <h1 className="text-2xl font-serif font-bold text-foreground">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm font-sans text-muted-foreground mt-1 text-center">
              {mode === "signin"
                ? "Continue your wellness journey"
                : "Start tracking your wellness with care"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-muted/60 mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "py-2 rounded-xl text-sm font-sans font-medium transition-all",
                  mode === m
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">
                  Display name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Amara"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-sans font-medium text-muted-foreground">
                  Password
                </label>
                {mode === "signin" && (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-sans text-royal hover:underline"
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl gradient-cta text-primary-foreground font-sans font-semibold text-sm shadow-soft hover:shadow-elevated transition-all disabled:opacity-60"
            >
              {submitting
                ? "Please wait…"
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          <p className="text-[10px] font-sans text-muted-foreground text-center mt-6 leading-relaxed">
            By continuing, you agree to our supportive use of your health data.
            This app does not replace professional medical care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
