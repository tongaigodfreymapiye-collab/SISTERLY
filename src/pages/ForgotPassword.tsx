import { useState } from "react";
import { Link } from "react-router-dom";
import { firebaseStore } from "@/integrations/firebase/client";
import { toast } from "sonner";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await firebaseStore.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Check your inbox for a reset link");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div className="bg-card rounded-3xl p-8 shadow-elevated">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-soft mb-3">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Reset your password</h1>
            <p className="text-sm font-sans text-muted-foreground mt-1 text-center">
              We'll send a secure link to your email
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-3">
              <p className="text-sm font-sans text-foreground">
                If an account exists for <span className="font-semibold">{email}</span>, a reset
                link is on its way.
              </p>
              <p className="text-xs font-sans text-muted-foreground">
                Don't see it? Check your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl gradient-cta text-primary-foreground font-sans font-semibold text-sm shadow-soft hover:shadow-elevated transition-all disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
