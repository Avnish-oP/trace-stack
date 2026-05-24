"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            "Could not create your account.",
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

  if (registeredEmail) {
    return (
      <main className="min-h-screen bg-bg-base px-6 py-10 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
          <Link href="/" className="mb-10 text-xl font-semibold tracking-tight">
            TraceStack
          </Link>
          <div className="glass-panel p-6">
            <h1 className="text-2xl font-semibold">Verify your email</h1>
            <p className="mt-3 text-sm leading-6 text-white/65">
              We created your account and sent a verification link to{" "}
              <span className="text-white">{registeredEmail}</span>.
            </p>
            {!emailSent ? (
              <p className="mt-4 rounded-lg border border-brand-secondary/30 bg-brand-secondary/10 px-3 py-2 text-sm text-brand-secondary">
                Email delivery is not configured locally. Check the api-server
                console for the development verification link.
              </p>
            ) : null}
            <Link
              href="/login"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2.5 text-sm font-semibold"
            >
              Continue to sign in
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-base px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link href="/" className="mb-10 text-xl font-semibold tracking-tight">
          TraceStack
        </Link>

        <div className="glass-panel p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Create account</h1>
            <p className="mt-2 text-sm text-white/60">
              Start collecting and exploring logs with TraceStack.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-white/70">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary"
              />
            </label>

            <label className="block">
              <span className="text-sm text-white/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary"
              />
            </label>

            <label className="block">
              <span className="text-sm text-white/70">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary"
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-brand-error/30 bg-brand-error/10 px-3 py-2 text-sm text-brand-error">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-secondary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
