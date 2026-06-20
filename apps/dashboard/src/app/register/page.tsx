"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, MailCheck, Check, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegisterResponse {
  success: boolean;
  data?: {
    verificationEmailSent: boolean;
  };
  error?: string;
  errors?: { field: string; message: string }[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple password strength calculation
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z\d]/.test(pwd)) score += 1;
    return Math.min(score, 4);
  };
  
  const strength = calculateStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-[var(--color-brand-error)]", "bg-[var(--color-brand-warning)]", "bg-[var(--color-brand-secondary)]", "bg-[var(--color-brand-success)]"];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!apiUrl) {
        setError("Dashboard API URL is not configured.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = (await response.json()) as RegisterResponse;

      if (!response.ok || !result.success) {
        setError(
          result.errors?.[0]?.message ??
            result.error ??
            "Could not create your account."
        );
        return;
      }

      setRegisteredEmail(email);
      setEmailSent(Boolean(result.data?.verificationEmailSent));
    } catch {
      setError("Could not reach the authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success State View
  if (registeredEmail) {
    return (
      <main className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full p-8 text-center animate-slide-up">
          <div className="mx-auto w-16 h-16 bg-[var(--color-brand-primary)]/10 rounded-full flex items-center justify-center mb-6">
            <MailCheck className="text-[var(--color-brand-primary)] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-gray-400 mb-6">
            We sent a verification link to <span className="text-white font-medium">{registeredEmail}</span>.
          </p>
          
          {!emailSent && (
            <div className="mb-6 p-4 rounded-lg bg-[var(--color-brand-warning)]/10 border border-[var(--color-brand-warning)]/20 text-left">
              <div className="flex gap-2 text-[var(--color-brand-warning)] font-medium text-sm mb-1">
                <span>⚠️</span> Local Development Notice
              </div>
              <p className="text-gray-400 text-xs">
                Email delivery is not configured. Check the API server console to find your verification link.
              </p>
            </div>
          )}
          
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Continue to sign in
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Default Register View
  return (
    <main className="min-h-screen flex bg-[var(--color-bg-base)]">
      {/* Left side: Brand/Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden border-r border-[var(--color-border-subtle)]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-gradient-to-tl from-[var(--color-brand-primary)]/20 via-black to-[var(--color-brand-secondary)]/10 animate-pulse-glow" style={{ animationDuration: '10s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        
        <div className="relative z-10 max-w-md px-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[var(--color-brand-primary)]/30">
              TS
            </div>
            <span className="font-bold text-3xl tracking-tight text-white">TraceStack</span>
          </div>

          <div className="space-y-6">
            {[
              "Real-time log ingestion at scale",
              "Advanced querying and filtering",
              "Secure multi-tenant architecture",
              "Instant performance insights"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-brand-secondary)]/10 flex items-center justify-center text-[var(--color-brand-secondary)]">
                  <Check size={14} />
                </div>
                <span className="text-lg">{feature}</span>
              </div>
            ))}
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
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create your account</h2>
            <p className="text-gray-400">Start monitoring your applications in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="John Doe"
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
            />

            <div className="space-y-2">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2 animate-fade-in">
                  <div className="flex-1 flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`flex-1 rounded-full transition-colors duration-300 ${
                          strength >= level ? strengthColors[Math.max(0, strength - 1)] : "bg-[var(--color-bg-surface-hover)]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 w-12 text-right">
                    {strengthLabels[Math.max(0, strength - 1)]}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg border border-[var(--color-brand-error)]/30 bg-[var(--color-brand-error)]/10 text-[var(--color-brand-error)] text-sm animate-fade-in flex items-start gap-2">
                <div className="mt-0.5 font-bold">!</div>
                <div>{error}</div>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-2 pb-2">
              By creating an account, you agree to our <a href="#" className="text-[var(--color-brand-secondary)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--color-brand-secondary)] hover:underline">Privacy Policy</a>.
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 text-base"
              disabled={isSubmitting || (password.length > 0 && password.length < 8)}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-brand-secondary)] hover:text-white font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
