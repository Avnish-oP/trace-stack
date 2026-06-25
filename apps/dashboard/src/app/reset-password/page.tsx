"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState, useEffect } from "react";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token.");
    }
  }, [token]);

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
    if (!token) return;

    setError(null);
    setIsSubmitting(true);

    try {
      if (!apiUrl) {
        setError("API URL is not configured.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.errors?.[0]?.message || data.error || "Failed to reset password.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Could not reach the authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full p-8 text-center animate-slide-up">
          <div className="mx-auto w-16 h-16 bg-[var(--color-brand-success)]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-[var(--color-brand-success)] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Password Reset Successful</h1>
          <p className="text-gray-400 mb-8">
            Your password has been successfully updated.
          </p>
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Continue to Login
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Set new password</h1>
          <p className="text-gray-400">Choose a new, strong password for your account.</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          {(!token && error) ? (
            <div className="p-4 rounded-lg border border-[var(--color-brand-error)]/30 bg-[var(--color-brand-error)]/10 text-[var(--color-brand-error)] text-center">
              <p className="mb-4">{error}</p>
              <Link href="/forgot-password">
                <Button variant="outline" className="w-full">Request new link</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    label="New Password"
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

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 text-base mt-2"
                disabled={isSubmitting || (password.length > 0 && password.length < 8)}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Reset password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
