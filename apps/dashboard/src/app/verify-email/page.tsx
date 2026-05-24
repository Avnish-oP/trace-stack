"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";

interface VerifyResponse {
  success: boolean;
  error?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
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
          `${apiUrl}/api/v1/auth/verify-email?token=${encodeURIComponent(
            token,
          )}`,
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

  const Icon =
    status === "loading" ? Loader2 : status === "success" ? CheckCircle2 : XCircle;

  return (
    <main className="min-h-screen bg-bg-base px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link href="/" className="mb-10 text-xl font-semibold tracking-tight">
          TraceStack
        </Link>

        <div className="glass-panel p-6 text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Icon
              className={`size-6 ${
                status === "loading"
                  ? "animate-spin text-brand-secondary"
                  : status === "success"
                    ? "text-brand-secondary"
                    : "text-brand-error"
              }`}
            />
          </div>

          <h1 className="text-2xl font-semibold">
            {status === "success"
              ? "Email verified"
              : status === "error"
                ? "Verification failed"
                : "Checking link"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/65">{message}</p>

          {status !== "loading" ? (
            <Link
              href="/login"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2.5 text-sm font-semibold"
            >
              Go to sign in
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
