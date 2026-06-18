"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VerifyResponse {
  success: boolean;
  error?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email.");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        if (!apiUrl) {
          setStatus("error");
          setMessage("Dashboard API URL is not configured.");
          return;
        }

        const response = await fetch(
          `${apiUrl}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`
        );
        const result = (await response.json()) as VerifyResponse;

        if (!response.ok || !result.success) {
          setStatus("error");
          setMessage(result.error ?? "Verification link is invalid or expired.");
          return;
        }

        setStatus("success");
        setMessage("Your email is verified. You can now sign in.");
      } catch {
        setStatus("error");
        setMessage("Could not reach the authentication server.");
      }
    }

    verify();
  }, [token]);

  const Icon = status === "loading" ? Loader2 : status === "success" ? CheckCircle2 : XCircle;

  return (
    <main className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--color-brand-primary)]/10 to-[var(--color-brand-secondary)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full max-w-md relative z-10 animate-slide-up">
        <Link href="/" className="flex justify-center items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[var(--color-brand-primary)]/30">
            TS
          </div>
          <span className="text-2xl font-semibold tracking-tight text-white">
            TraceStack
          </span>
        </Link>

        <div className="glass-card p-8 text-center">
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border shadow-inner ${
            status === "loading" 
              ? "border-[var(--color-brand-secondary)]/30 bg-[var(--color-brand-secondary)]/10" 
              : status === "success"
                ? "border-[var(--color-brand-success)]/30 bg-[var(--color-brand-success)]/10"
                : "border-[var(--color-brand-error)]/30 bg-[var(--color-brand-error)]/10"
          }`}>
            <Icon
              className={`h-8 w-8 ${
                status === "loading"
                  ? "animate-spin text-[var(--color-brand-secondary)]"
                  : status === "success"
                    ? "text-[var(--color-brand-success)]"
                    : "text-[var(--color-brand-error)]"
              }`}
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            {status === "success"
              ? "Email verified successfully"
              : status === "error"
                ? "Verification failed"
                : "Verifying your link..."}
          </h1>
          <p className="text-sm leading-relaxed text-gray-400 mb-8 max-w-[280px] mx-auto">
            {message}
          </p>

          {status !== "loading" && (
            <Link href="/login" className="block">
              <Button variant="primary" className="w-full text-base h-11">
                Continue to sign in
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-primary)]" />
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
