"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!apiUrl) {
        setError("API URL is not configured.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to process request.");
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
          <div className="mx-auto w-16 h-16 bg-[var(--color-brand-primary)]/10 rounded-full flex items-center justify-center mb-6">
            <MailCheck className="text-[var(--color-brand-primary)] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-gray-400 mb-8">
            If an account exists for <span className="text-white font-medium">{email}</span>, we have sent a password reset link.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Return to login
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
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Reset password</h1>
          <p className="text-gray-400">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
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
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Send reset link"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
