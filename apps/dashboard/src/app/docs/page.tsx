import React from "react";
import Link from "next/link";
import { ChevronLeft, Terminal, FileCode, CheckCircle2, Zap } from "lucide-react";

export const metadata = {
  title: "Documentation - TraceStack",
  description: "Official documentation for TraceStack",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-gray-300 font-sans selection:bg-[var(--color-brand-primary)]/30">
      <header className="sticky top-0 z-50 bg-[var(--color-bg-base)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)] py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white text-xs">
              TS
            </div>
            <span className="font-bold tracking-tight text-white">TraceStack Docs</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-16 text-center animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Documentation</h1>
          <p className="text-lg text-gray-400">Everything you need to integrate TraceStack into your applications.</p>
        </div>

        <div className="space-y-16">
          {/* Section 1: Quick Start */}
          <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-primary)]/10 flex items-center justify-center text-[var(--color-brand-primary)]">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">1. Quick Start</h2>
            </div>
            
            <div className="glass-card p-6">
              <p className="mb-4 leading-relaxed">
                TraceStack provides a zero-dependency Node.js SDK that makes logging extremely fast and entirely asynchronous.
                First, install the package using your preferred package manager:
              </p>
              
              <div className="bg-black/80 rounded-lg p-4 font-mono text-sm border border-white/5 mb-6 overflow-x-auto">
                <code className="text-gray-300">npm install @trace-stack/node</code>
              </div>

              <p className="mb-4 leading-relaxed">Next, initialize the logger at the entry point of your application:</p>

              <div className="bg-black/80 rounded-lg p-4 font-mono text-sm border border-white/5 overflow-x-auto">
                <pre>
                  <code className="text-gray-300">
<span className="text-[var(--color-brand-primary)]">import</span> {"{ logger }"} <span className="text-[var(--color-brand-primary)]">from</span> <span className="text-[var(--color-brand-success)]">&quot;@trace-stack/node&quot;</span>;{"\n\n"}
logger.<span className="text-[var(--color-brand-secondary)]">init</span>({"{\n"}
{"  "}apiKey: <span className="text-[var(--color-brand-success)]">&quot;your_project_api_key&quot;</span>,{"\n"}
{"  "}service: <span className="text-[var(--color-brand-success)]">&quot;api-server&quot;</span>,{"\n"}
{"  "}flushIntervalMs: <span className="text-purple-400">2000</span>, <span className="text-gray-500">{"// Optional: defaults to 3000ms"}</span>{"\n"}
{"}"});
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Section 2: Logging Events */}
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-secondary)]/10 flex items-center justify-center text-[var(--color-brand-secondary)]">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">2. Logging Events</h2>
            </div>
            
            <div className="glass-card p-6">
              <p className="mb-4 leading-relaxed">
                Once initialized, you can log events from anywhere in your codebase. The SDK supports five log levels: <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">debug</code>, <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">info</code>, <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">warn</code>, <code className="bg-white/10 px-1.5 py-0.5 rounded text-[var(--color-brand-error)] text-xs">error</code>, and <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">fatal</code>.
              </p>
              
              <div className="bg-black/80 rounded-lg p-4 font-mono text-sm border border-white/5 mb-6 overflow-x-auto">
                <pre>
                  <code className="text-gray-300">
logger.<span className="text-white font-semibold">info</span>(<span className="text-[var(--color-brand-success)]">&quot;User signed in&quot;</span>, {"{\n"}
{"  "}userId: <span className="text-[var(--color-brand-success)]">&quot;usr_123&quot;</span>,{"\n"}
{"  "}method: <span className="text-[var(--color-brand-success)]">&quot;oauth&quot;</span>,{"\n"}
{"  "}provider: <span className="text-[var(--color-brand-success)]">&quot;github&quot;</span>{"\n"}
{"}"});{"\n\n"}
<span className="text-[var(--color-brand-primary)]">try</span> {"{\n"}
{"  "}<span className="text-[var(--color-brand-primary)]">await</span> <span className="text-[var(--color-brand-secondary)]">chargeStripe</span>(userId, amount);{"\n"}
{"} "} <span className="text-[var(--color-brand-primary)]">catch</span> (err) {"{\n"}
{"  "}logger.<span className="text-[var(--color-brand-error)] font-semibold">error</span>(<span className="text-[var(--color-brand-success)]">&quot;Payment failed&quot;</span>, {"{\n"}
{"    "}userId,{"\n"}
{"    "}amount,{"\n"}
{"    "}error: err.message{"\n"}
{"  }"});{"\n"}
{"}"}
                  </code>
                </pre>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-brand-primary)] mt-0.5 shrink-0" />
                <p className="text-sm">
                  <strong className="text-white font-semibold">Zero Performance Penalty.</strong> The SDK batches all logs in memory and sends them asynchronously. Your application's response time is completely unaffected by logging.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: REST API */}
          <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <FileCode className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">3. REST API (Advanced)</h2>
            </div>
            
            <div className="glass-card p-6">
              <p className="mb-4 leading-relaxed">
                If you are using a language other than Node.js, you can send logs directly to the Ingestion API.
              </p>
              
              <div className="bg-black/80 rounded-lg p-4 font-mono text-sm border border-white/5 overflow-x-auto">
                <pre>
                  <code className="text-gray-300">
POST https://ingest.tracestack.dev/api/v1/logs/batch{"\n"}
Authorization: Bearer YOUR_API_KEY{"\n"}
Content-Type: application/json{"\n\n"}
{"{"}\n
{"  "}<span className="text-purple-400">&quot;logs&quot;</span>: [\n
{"    "}{"{"}\n
{"      "}<span className="text-purple-400">&quot;level&quot;</span>: <span className="text-[var(--color-brand-success)]">&quot;info&quot;</span>,\n
{"      "}<span className="text-purple-400">&quot;message&quot;</span>: <span className="text-[var(--color-brand-success)]">&quot;User signed up&quot;</span>,\n
{"      "}<span className="text-purple-400">&quot;service&quot;</span>: <span className="text-[var(--color-brand-success)]">&quot;api-server&quot;</span>,\n
{"      "}<span className="text-purple-400">&quot;timestamp&quot;</span>: <span className="text-[var(--color-brand-success)]">&quot;2026-06-20T12:00:00.000Z&quot;</span>,\n
{"      "}<span className="text-purple-400">&quot;metadata&quot;</span>: {"{ ... }"}\n
{"    "}{"}"}\n
{"  "}]\n
{"}"}
                  </code>
                </pre>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] bg-black mt-20 pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} TraceStack Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
