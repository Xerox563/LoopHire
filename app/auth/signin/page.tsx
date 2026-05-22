import { signIn } from "@/auth";
import { Rocket, Mail } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent shadow-lg shadow-accent/20 mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Welcome to LoopHire
          </h1>
          <p className="text-text-secondary text-sm">
            Sign in to start automating your career growth.
          </p>
        </div>

        <div className="glass-card !p-8 space-y-6">
          <form
            action={async (formData) => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/[0.03] border border-white/5 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all group"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Sign in with Google
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="bg-background px-4 text-text-muted">Or continue with</span>
            </div>
          </div>

          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("email", { email });
            }}
            className="space-y-4"
          >
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-4 text-sm text-white focus:outline-none focus:border-accent/30 transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-cinematic w-full !py-4 flex items-center justify-center gap-2 !text-sm !font-bold !uppercase !tracking-widest"
            >
              Send Magic Link
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-text-muted uppercase tracking-widest font-bold">
          By signing in, you agree to our terms & privacy policy.
        </p>
      </div>
      
      <div className="noise-bg opacity-40" />
    </div>
  );
}
