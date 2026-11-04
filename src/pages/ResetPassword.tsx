import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/integrations/firebase/client";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { toast } from "sonner";
import { Lock, Sparkles } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  const [actionCode, setActionCode] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    if (!code) return;
    verifyPasswordResetCode(auth, code)
      .then(() => { setActionCode(code); setReady(true); })
      .catch(() => toast.error("This password reset link is invalid or has expired."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setSubmitting(true);
    let error: any = null;
    try { if (!actionCode) throw new Error("Reset link is invalid or expired."); await confirmPasswordReset(auth, actionCode, password); } catch (e: any) { error = e; }
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated");
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl p-8 shadow-elevated">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shadow-soft mb-3">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Set a new password</h1>
            <p className="text-sm font-sans text-muted-foreground mt-1 text-center">
              Choose something strong and memorable
            </p>
          </div>

          {!ready ? (
            <p className="text-sm font-sans text-muted-foreground text-center">
              Verifying your reset link…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-muted-foreground mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-transparent focus:bg-card focus:border-royal focus:outline-none text-sm font-sans transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl gradient-cta text-primary-foreground font-sans font-semibold text-sm shadow-soft hover:shadow-elevated transition-all disabled:opacity-60"
              >
                {submitting ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
