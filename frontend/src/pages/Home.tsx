import { Link } from "react-router-dom";
import { ArrowRight, Check, Bot } from "lucide-react";

const TRUSTS = ["YC-backed startups", "Fortune 500 teams", "50k+ developers"];

const FEATURES = [
  {
    title: "Knowledge Ingestion",
    description: "Upload PDFs, URLs, or raw text. Our pipeline chunks, embeds, and indexes your data in seconds — not hours.",
  },
  {
    title: "Embeddable Widget",
    description: "A single script tag gives your website a fully branded, production-ready chat interface with zero dependencies.",
  },
  {
    title: "Bring Your Own Key",
    description: "Use your own Gemini API key. No markup, no middleman — you control your costs and your data.",
  },
  {
    title: "Session Analytics",
    description: "Every conversation is logged with full transcripts, message counts, and timestamps for compliance and insight.",
  },
  {
    title: "White-label Branding",
    description: "Customize the bot name, accent color, and greeting message to seamlessly blend with your product identity.",
  },
  {
    title: "Developer First",
    description: "Clean REST APIs, webhook support, and a thoughtfully designed dashboard built for technical teams.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For individuals exploring conversational AI.",
    features: ["1 project", "100 messages / mo", "5 documents", "Community support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For growing teams that need serious infrastructure.",
    features: ["Unlimited projects", "10,000 messages / mo", "Unlimited documents", "BYOK support", "Priority support", "Custom branding"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced security and scale needs.",
    features: ["Everything in Pro", "SSO & SAML", "Dedicated instance", "99.99% SLA", "Custom integrations", "Onboarding manager"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.02em]">BotForge</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-neutral-500">
            <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Docs</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-[13px] font-semibold text-white bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[12px] font-medium text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-full px-3.5 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Trusted by {TRUSTS.join(" · ")}
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-balance mb-6">
            Ship an AI chatbot{" "}
            <span className="text-neutral-400">for your product, today.</span>
          </h1>

          <p className="text-[17px] leading-relaxed text-neutral-500 max-w-xl mx-auto mb-10">
            Upload your docs. Customize the widget. Embed one script tag. BotForge handles the infrastructure so you can focus on your product.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-neutral-900 text-white px-7 py-3 rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-all"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 text-neutral-600 border border-neutral-200 px-7 py-3 rounded-lg text-[14px] font-medium hover:bg-neutral-50 transition-colors"
            >
              Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <div className="border-y border-neutral-100 bg-neutral-50/50">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {[
            { metric: "12,400+", label: "Chatbots deployed" },
            { metric: "98.7%", label: "Uptime SLA" },
            { metric: "4.2M", label: "Messages processed" },
            { metric: "<80ms", label: "Avg response time" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold tracking-tight text-neutral-900">{s.metric}</div>
              <div className="text-[12px] font-medium text-neutral-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-3">Platform</p>
            <h2 className="text-3xl md:text-[2.5rem] font-bold tracking-[-0.03em] text-balance">
              Everything you need, nothing you don't.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="group">
                <h3 className="text-[15px] font-semibold mb-2 text-neutral-900">{f.title}</h3>
                <p className="text-[14px] leading-relaxed text-neutral-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-6 bg-neutral-50/60 border-y border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-neutral-400 mb-3">Pricing</p>
            <h2 className="text-3xl md:text-[2.5rem] font-bold tracking-[-0.03em]">
              Simple, transparent pricing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 flex flex-col ${
                  plan.highlight
                    ? "bg-neutral-900 text-white ring-1 ring-neutral-900 shadow-xl"
                    : "bg-white border border-neutral-200"
                }`}
              >
                <div className="mb-6">
                  <p className={`text-[13px] font-semibold mb-3 ${plan.highlight ? "text-neutral-400" : "text-neutral-500"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[2.25rem] font-bold tracking-tight">{plan.price}</span>
                    {plan.period && (
                      <span className={`text-[14px] font-medium ${plan.highlight ? "text-neutral-400" : "text-neutral-400"}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-[13px] mt-2 ${plan.highlight ? "text-neutral-400" : "text-neutral-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px]">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-emerald-400" : "text-emerald-600"}`} />
                      <span className={plan.highlight ? "text-neutral-300" : "text-neutral-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`text-center text-[13px] font-semibold py-2.5 rounded-lg transition-colors ${
                    plan.highlight
                      ? "bg-white text-neutral-900 hover:bg-neutral-100"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-[2.5rem] font-bold tracking-[-0.03em] mb-4">
            Ready to get started?
          </h2>
          <p className="text-[15px] text-neutral-500 mb-8">
            Create your account in 30 seconds. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 rounded-lg text-[14px] font-semibold hover:bg-neutral-800 transition-colors"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-neutral-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-900 rounded-md flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <span className="text-[14px] font-semibold">BotForge</span>
          </div>
          <div className="flex gap-6 text-[12px] font-medium text-neutral-400">
            <a href="#" className="hover:text-neutral-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-600 transition-colors">Status</a>
          </div>
          <p className="text-[12px] text-neutral-400">
            © {new Date().getFullYear()} BotForge Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
