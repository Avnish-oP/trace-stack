import Link from "next/link";
import { 
  Activity, 
  Search, 
  Users, 
  CreditCard, 
  ChevronRight,
  Terminal,
  Github,
  Twitter
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-primary/30">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none bg-bg-base/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-primary" />
            <span className="font-bold text-xl tracking-tight">TraceStack</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          {/* Background glowing effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 translate-x-[10%] w-[600px] h-[300px] bg-brand-secondary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-brand-primary/30 mb-6">
                <span className="flex w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                <span className="text-xs font-medium text-brand-secondary">TraceStack v1.0 is now live</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                Monitor Your Applications in <span className="text-gradient">Real Time</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
                TraceStack is a production-grade observability platform. Collect, search, and analyze logs from all your services in one centralized place with millisecond latency.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(108,92,231,0.3)]">
                  Get Started Free
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/docs" className="w-full sm:w-auto flex items-center justify-center gap-2 glass-panel hover:bg-white/10 px-6 py-3 rounded-xl font-medium transition-all text-gray-300">
                  <Terminal className="w-4 h-4" />
                  View Documentation
                </Link>
              </div>
            </div>

            {/* Code Snippet Illustration */}
            <div className="glass-panel p-6 rounded-2xl relative shadow-2xl shadow-black/50">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-brand-error" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-brand-secondary" />
                <span className="ml-2 text-xs text-gray-500 font-mono">server.ts</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                <code className="text-gray-300">
                  <span className="text-brand-secondary">import</span> {"{ logger }"} <span className="text-brand-secondary">from</span> <span className="text-green-400">&quot;@trace-stack/node&quot;</span>;{"\n\n"}
                  <span className="text-gray-500">{"// Initialize client"}</span>{"\n"}
                  logger.<span className="text-brand-primary">init</span>({"{\n"}
                  {"  "}apiKey: process.env.TRACE_KEY,{"\n"}
                  {"  "}service: <span className="text-green-400">&quot;payment-api&quot;</span>{"\n"}
                  {"}"});{"\n\n"}
                  <span className="text-gray-500">{"// Send logs in real-time"}</span>{"\n"}
                  app.<span className="text-brand-primary">post</span>(<span className="text-green-400">&quot;/checkout&quot;</span>, (req, res) {`=>`} {"{\n"}
                  {"  "}logger.<span className="text-brand-secondary">info</span>(<span className="text-green-400">&quot;Checkout initiated&quot;</span>, {"{"}{"\n"}
                  {"    "}userId: req.user.id,{"\n"}
                  {"    "}amount: req.body.amount{"\n"}
                  {"  }"});{"\n"}
                  {"}"});
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-black/40 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Built from the ground up for performance, security, and developer experience.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Activity className="w-6 h-6 text-brand-secondary" />,
                  title: "Real-Time Log Streaming",
                  desc: "Live tail your logs as they happen with WebSocket-powered updates. Never refresh your browser again."
                },
                {
                  icon: <Search className="w-6 h-6 text-brand-primary" />,
                  title: "Powerful Search & Filters",
                  desc: "Full-text search with extremely fast faceted filtering by log level, service name, environment, and time range."
                },
                {
                  icon: <Users className="w-6 h-6 text-brand-error" />,
                  title: "Multi-Tenant Architecture",
                  desc: "Built-in support for Organizations, Projects, and granular API keys with role-based access controls."
                },
                {
                  icon: <CreditCard className="w-6 h-6 text-green-400" />,
                  title: "Usage-Based Billing",
                  desc: "Pay only for what you ingest and retain. Start free with 10,000 logs per month to test the waters."
                }
              ].map((feature, i) => (
                <div key={i} className="glass-panel p-8 hover:bg-bg-surface-hover transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Integrate in minutes</h2>
              <p className="text-gray-400">Our lightweight SDKs make it trivial to start streaming data.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 z-0">1</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-4">Install the SDK</h3>
                  <div className="glass-panel p-4 font-mono text-sm text-gray-300">
                    <span className="text-brand-primary">$</span> npm install @trace-stack/node
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 z-0">2</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-4">Send your logs</h3>
                  <div className="glass-panel p-4 font-mono text-sm text-gray-300">
                    logger.<span className="text-brand-error">error</span>(<span className="text-green-400">&quot;DB Auth Failed&quot;</span>, {"{ err }"});
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 z-0">3</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-4">Monitor instantly</h3>
                  <div className="glass-panel p-4 flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 h-[52px]">
                    <span className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Live Dashboard
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-black/40 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-gray-400">No hidden fees. No surprise bills.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="glass-panel p-8 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Hobby</h3>
                <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1 text-gray-400 text-sm">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> 10,000 logs / month</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> 3 Projects</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> 7-day retention</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> Community support</li>
                </ul>
                <Link href="/register" className="block text-center glass-panel hover:bg-white/10 py-3 rounded-lg font-medium transition-colors">Start Free</Link>
              </div>

              {/* Pro Plan */}
              <div className="glass-panel p-8 flex flex-col relative border-brand-primary/50 shadow-[0_0_30px_rgba(108,92,231,0.15)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1 text-gray-300 text-sm">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-secondary" /> 1,000,000 logs / month</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-secondary" /> 20 Projects</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-secondary" /> 30-day retention</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-secondary" /> Email support</li>
                </ul>
                <Link href="/register?plan=pro" className="block text-center bg-brand-primary hover:bg-brand-primary-dark text-white py-3 rounded-lg font-medium transition-colors">Upgrade to Pro</Link>
              </div>

              {/* Enterprise Plan */}
              <div className="glass-panel p-8 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-6 text-gray-300">Custom</div>
                <ul className="space-y-4 mb-8 flex-1 text-gray-400 text-sm">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> Unlimited logs</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> Unlimited Projects</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> 1-year retention</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-primary" /> 24/7 Phone support</li>
                </ul>
                <Link href="/contact" className="block text-center glass-panel hover:bg-white/10 py-3 rounded-lg font-medium transition-colors">Contact Sales</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-bg-base pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-brand-primary" />
                <span className="font-bold tracking-tight">TraceStack</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm mb-6">
                Next-generation observability and log monitoring for modern development teams.
              </p>
              <div className="flex items-center gap-4 text-gray-500">
                <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center sm:text-left text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} TraceStack Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
