"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Github, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid credentials or unverified email.");
        setIsSubmitting(false);
        return;
      }

      // Hard navigation forces a fresh document request so the freshly-set
      // session cookie is sent and proxy.ts evaluates the session cleanly.
      // (A soft router.push races the cookie commit and causes a login loop.)
      window.location.assign(callbackUrl);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or unverified email.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex bg-[var(--color-bg-base)]">
      {/* Left side: Brand/Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden border-r border-[var(--color-border-subtle)]">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-[var(--color-brand-primary)]/20 via-black to-[var(--color-brand-secondary)]/10 animate-pulse-glow" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-md px-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[var(--color-brand-primary)]/30">
              TS
            </div>
            <span className="font-bold text-3xl tracking-tight text-white">TraceStack</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Observability that <span className="text-gradient">actually works</span> for developers.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Real-time log streaming, powerful querying, and instant alerts. Built for speed and scale.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
            <div className="px-3 py-1.5 rounded-md bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]">
              $ npm install @trace-stack/node
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 animate-slide-up">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white">
              TS
            </div>
            <span className="font-bold text-xl tracking-tight text-white">TraceStack</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-400">Sign in to your TraceStack account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 z-10 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-gray-600 bg-gray-800 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)] focus:ring-offset-gray-900" />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[var(--color-brand-secondary)] hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 rounded-lg border border-[var(--color-brand-error)]/30 bg-[var(--color-brand-error)]/10 text-[var(--color-brand-error)] text-sm animate-fade-in flex items-start gap-2">
                <div className="mt-0.5 font-bold">!</div>
                <div>{error}</div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 text-base mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]"></div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full text-gray-400 hover:text-white" disabled>
              <Github size={18} className="mr-2" /> GitHub
            </Button>
            <Button variant="outline" className="w-full text-gray-400 hover:text-white" disabled>
              <Mail size={18} className="mr-2" /> Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-[var(--color-brand-secondary)] hover:text-white font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
