"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Search, 
  Users, 
  CreditCard, 
  ChevronRight,
  Terminal,
  Github,
  Twitter,
  Cpu,
  Zap,
  Globe,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Typing effect component for the hero code block
const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, 30);
    return () => clearInterval(intervalId);
  }, [text, startTyping]);

  return <span>{displayText}</span>;
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[var(--color-brand-primary)]/30 bg-[var(--color-bg-base)]">
      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[var(--color-bg-base)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)] py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white shadow-lg shadow-[var(--color-brand-primary)]/20">
              TS
            </div>
            <span className="font-bold text-xl tracking-tight text-white">TraceStack</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 px-6 overflow-hidden">
          {/* Background glowing effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[var(--color-brand-primary)]/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 translate-x-[20%] -translate-y-[20%] w-[600px] h-[400px] bg-[var(--color-brand-secondary)]/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="max-w-2xl animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-[var(--color-brand-primary)]/30 mb-8 hover:bg-[var(--color-brand-primary)]/5 transition-colors cursor-pointer group">
                <span className="flex w-2 h-2 rounded-full bg-[var(--color-brand-secondary)] animate-pulse" />
                <span className="text-xs font-medium text-[var(--color-brand-secondary)] group-hover:text-white transition-colors">TraceStack v1.0 is now live</span>
                <ChevronRight className="w-3 h-3 text-[var(--color-brand-secondary)] group-hover:translate-x-1 transition-transform" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
                Observability that <span className="text-gradient">actually works</span>.
              </h1>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl">
                Collect, search, and analyze logs from all your services in one centralized place. Built for developers who care about speed, scale, and simplicity.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full text-base h-12 shadow-[0_0_30px_rgba(108,92,231,0.4)]">
                    Get Started Free <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/docs" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-base h-12 text-gray-300">
                    <Terminal className="w-4 h-4 mr-2" /> Read Docs
                  </Button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="mt-14 grid grid-cols-3 gap-6 pt-8 border-t border-[var(--color-border-subtle)]">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">50ms</div>
                  <div className="text-sm text-gray-500">Avg. search latency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">99.99%</div>
                  <div className="text-sm text-gray-500">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">Unlimited</div>
                  <div className="text-sm text-gray-500">Log retention</div>
                </div>
              </div>
            </div>

            {/* Animated Code Snippet Illustration */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="glow-border">
                <div className="glass-card p-6 relative overflow-hidden bg-black/60">
                  {/* Decorative window controls */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-brand-error)]/80" />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-brand-warning)]/80" />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-brand-success)]/80" />
                    <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-400 font-mono">
                      server.ts
                    </div>
                  </div>
                  
                  {/* Code block */}
                  <pre className="font-mono text-sm leading-loose overflow-x-auto">
                    <code className="text-gray-300">
                      <span className="text-[var(--color-brand-primary)]">import</span> {"{ logger }"} <span className="text-[var(--color-brand-primary)]">from</span> <span className="text-[var(--color-brand-success)]">&quot;@trace-stack/node&quot;</span>;{"\n\n"}
                      <span className="text-gray-500">{"// Initialize client"}</span>{"\n"}
                      logger.<span className="text-[var(--color-brand-secondary)]">init</span>({"{\n"}
                      {"  "}apiKey: process.env.TRACE_KEY,{"\n"}
                      {"  "}service: <span className="text-[var(--color-brand-success)]">&quot;payment-api&quot;</span>{"\n"}
                      {"}"});{"\n\n"}
                      <span className="text-gray-500">{"// Stream logs with zero latency"}</span>{"\n"}
                      app.<span className="text-[var(--color-brand-secondary)]">post</span>(<span className="text-[var(--color-brand-success)]">&quot;/checkout&quot;</span>, (req, res) {`=>`} {"{\n"}
                      {"  "}logger.<span className="text-white font-semibold">info</span>(<span className="text-[var(--color-brand-success)]">&quot;Checkout initiated&quot;</span>, {"{\n"}
                      {"    "}userId: <TypewriterText text="req.user.id," delay={1000} />{"\n"}
                      {"    "}amount: <TypewriterText text="req.body.amount" delay={2000} />{"\n"}
                      {"  }"});{"\n"}
                      {"}"});
                    </code>
                  </pre>
                  
                  {/* Overlay animated terminal log */}
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur border border-[var(--color-border-subtle)] p-3 rounded-lg flex flex-col gap-2 shadow-2xl animate-slide-up" style={{ animationDelay: '3s' }}>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[var(--color-brand-secondary)]">INFO</span>
                      <span className="text-gray-400">Checkout initiated</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono opacity-80">
                      <span className="text-[var(--color-brand-primary)]">12ms ago</span>
                      <span className="text-gray-500">payment-api</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-brand-primary)]/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Everything you need to scale</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">Built from the ground up for performance, security, and exceptional developer experience.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Activity className="w-6 h-6 text-[var(--color-brand-secondary)]" />,
                  title: "Real-Time Streaming",
                  desc: "Live tail your logs as they happen. Never manually refresh your browser again."
                },
                {
                  icon: <Search className="w-6 h-6 text-[var(--color-brand-primary)]" />,
                  title: "Extremely Fast Search",
                  desc: "Full-text search with faceted filtering by log level, service, environment, and time."
                },
                {
                  icon: <Users className="w-6 h-6 text-[var(--color-brand-warning)]" />,
                  title: "Multi-Tenant Ready",
                  desc: "Built-in support for Organizations, Projects, and granular API keys out of the box."
                },
                {
                  icon: <Cpu className="w-6 h-6 text-purple-400" />,
                  title: "Edge Optimized",
                  desc: "Ingestion APIs deployed to the edge for minimal latency from any region globally."
                },
                {
                  icon: <Zap className="w-6 h-6 text-yellow-400" />,
                  title: "Smart Alerts (Soon)",
                  desc: "Get notified instantly via Slack, PagerDuty, or Webhook when anomalies occur."
                },
                {
                  icon: <Globe className="w-6 h-6 text-blue-400" />,
                  title: "Open API",
                  desc: "Integrate seamlessly with your existing tools using our RESTful API endpoints."
                }
              ].map((feature, i) => (
                <div key={i} className="glass-card p-8 group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/10 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 relative border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">How it works</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">Three simple steps to integrate observability into your workflow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-brand-primary)] to-transparent opacity-20" />
              
              <div className="relative z-10 text-center animate-slide-up">
                <div className="w-24 h-24 mx-auto rounded-full bg-black border-2 border-[var(--color-brand-primary)] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(108,92,231,0.2)]">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Install SDK</h3>
                <p className="text-gray-400">Install our zero-dependency Node.js SDK via npm or yarn and initialize it with your API key.</p>
              </div>

              <div className="relative z-10 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-24 h-24 mx-auto rounded-full bg-black border-2 border-[var(--color-brand-secondary)] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,206,201,0.2)]">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Stream Logs</h3>
                <p className="text-gray-400">Log events organically in your application. They are batched and shipped efficiently in the background.</p>
              </div>

              <div className="relative z-10 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-24 h-24 mx-auto rounded-full bg-black border-2 border-purple-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Monitor Live</h3>
                <p className="text-gray-400">Open the dashboard to view your logs streaming in real-time. Search, filter, and analyze instantly.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Pricing */}
        <section id="pricing" className="py-32 relative border-t border-[var(--color-border-subtle)] bg-black/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Simple, transparent pricing</h2>
              <p className="text-lg text-gray-400">Start for free, upgrade when you need more power.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              {/* Hobby */}
              <div className="glass-panel p-8 rounded-2xl flex flex-col hover:border-gray-500 transition-colors">
                <h3 className="text-xl font-semibold mb-2 text-white">Hobby</h3>
                <div className="text-4xl font-bold mb-6 text-white">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1 text-gray-400 text-sm">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-400" /> 10,000 logs / month</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-400" /> 3 Projects</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-400" /> 7-day retention</li>
                  <li className="flex items-center gap-3 text-gray-600"><Check className="w-4 h-4" /> Community support</li>
                </ul>
                <Button variant="outline" className="w-full border-[var(--color-border-subtle)] text-white">Start Free</Button>
              </div>

              {/* Pro */}
              <div className="glow-border rounded-2xl scale-105 z-10">
                <div className="glass-card bg-gray-900/80 p-8 rounded-2xl flex flex-col relative border-[var(--color-brand-primary)]/50">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Pro</h3>
                  <div className="text-4xl font-bold mb-6 text-white">$29<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                  <ul className="space-y-4 mb-8 flex-1 text-gray-300 text-sm">
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--color-brand-secondary)]" /> 1,000,000 logs / month</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--color-brand-secondary)]" /> 20 Projects</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--color-brand-secondary)]" /> 30-day retention</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--color-brand-secondary)]" /> Priority email support</li>
                  </ul>
                  <Button variant="primary" className="w-full">Upgrade to Pro</Button>
                </div>
              </div>

              {/* Enterprise */}
              <div className="glass-panel p-8 rounded-2xl flex flex-col hover:border-gray-500 transition-colors">
                <h3 className="text-xl font-semibold mb-2 text-white">Enterprise</h3>
                <div className="text-4xl font-bold mb-6 text-gray-300">Custom</div>
                <ul className="space-y-4 mb-8 flex-1 text-gray-400 text-sm">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-gray-400" /> Unlimited logs</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-gray-400" /> Unlimited Projects</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-gray-400" /> Custom retention</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-gray-400" /> 24/7 Phone support</li>
                </ul>
                <Button variant="outline" className="w-full border-[var(--color-border-subtle)] text-white">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-black pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white text-[10px]">
                  TS
                </div>
                <span className="font-bold tracking-tight text-white">TraceStack</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
                Next-generation observability and log monitoring for modern development teams.
              </p>
              <div className="flex items-center gap-4 text-gray-500">
                <a href="#" className="w-10 h-10 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-sm text-white">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="#features" className="hover:text-[var(--color-brand-secondary)] transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-[var(--color-brand-secondary)] transition-colors">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-[var(--color-brand-secondary)] transition-colors">Changelog</Link></li>
                <li><Link href="/docs" className="hover:text-[var(--color-brand-secondary)] transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-sm text-white">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} TraceStack Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-400 font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
