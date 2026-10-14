"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@radix-ui/themes";
import { cn } from "@/utiils";
import { Header } from "@/components";
import { SectionOne } from "./components";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import {
  TreePine,
  Flame,
  FlaskConical,
  TrendingUp,
  Target,
  AlertTriangle,
  Activity,
  FolderOpen,
  Zap,
  Github,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Shield,
  FileSearch,
  BarChart3,
  History,
} from "lucide-react";
import ButtonSection from "./components/buttons-section";

interface LandingProps {
  height?: string;
  width?: string;
}

const montText = Montserrat({ subsets: ["latin"] });

// ─── Color constants ─────────────────────────────────────────────────────────
const BRAND = "#D97757";
const DARK = "#1F1F1E";

// ─── Pricing Data ────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For small projects and quick checks.",
    features: ["3 scans per month", "Core analysis tools", "Scan history"],
    cta: "Current Plan",
    highlight: false,
    href: null,
  },
  {
    name: "Pro",
    price: "$99",
    period: "per month",
    description: "For teams that scan regularly.",
    features: [
      "Unlimited scans",
      "Detailed reports",
      "Usage analytics",
      "Priority support",
    ],
    cta: "Go to Checkout",
    highlight: true,
    href: "#",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    description: "For organizations that need custom controls.",
    features: [
      "Dedicated support",
      "Custom rules",
      "Team workflows",
      "SLA options",
    ],
    cta: "Contact Sales",
    highlight: false,
    href: "mailto:sales@example.com",
  },
];

// ─── Analytics Features ───────────────────────────────────────────────────────
const ANALYTICS_FEATURES = [
  {
    title: "Scan Trend Analysis",
    desc: "Monitor scan volume and issue counts over time.",
    Icon: TrendingUp,
  },
  {
    title: "Risk Score Gauge",
    desc: "Weighted risk score - Critical ×10, High ×5, Medium ×2.",
    Icon: Target,
  },
  {
    title: "Severity Breakdown",
    desc: "Visual distribution of critical, high, medium and low issues.",
    Icon: AlertTriangle,
  },
  {
    title: "Pipeline Health",
    desc: "24-hour uptime heatmap - active, idle, error.",
    Icon: Activity,
  },
  {
    title: "Vulnerable Files",
    desc: "Ranked list of your most problematic files.",
    Icon: FolderOpen,
  },
  {
    title: "Activity Feed",
    desc: "Real-time timeline of every scan event with status.",
    Icon: Zap,
  },
];

// ─── Pipeline Steps ───────────────────────────────────────────────────────────
const PIPELINES = [
  {
    id: "01",
    name: "AST Analysis",
    desc: "Abstract Syntax Tree parsing to detect structural vulnerabilities and code flow issues in your MCP agents.",
    Icon: TreePine,
    delay: "0ms",
  },
  {
    id: "02",
    name: "Pyre Type Check",
    desc: "Facebook's Pyre static type checker runs inference across your Python codebase to catch type-related bugs.",
    Icon: Flame,
    delay: "120ms",
  },
  {
    id: "03",
    name: "Pysa Taint Track",
    desc: "Python Static Analyzer traces data flows from sources to sinks, identifying injection and taint vulnerabilities.",
    Icon: FlaskConical,
    delay: "240ms",
  },
];

// ─── Mock History Data ────────────────────────────────────────────────────────
const MOCK_HISTORY = [
  {
    id: "1",
    file: "agent_tools.py",
    issues: 12,
    critical: 3,
    high: 4,
    date: "Apr 28, 2026",
    status: "completed",
    duration: "4.2s",
  },
  {
    id: "2",
    file: "mcp_handler.py",
    issues: 7,
    critical: 1,
    high: 2,
    date: "Apr 27, 2026",
    status: "completed",
    duration: "3.1s",
  },
  {
    id: "3",
    file: "pipeline.py",
    issues: 0,
    critical: 0,
    high: 0,
    date: "Apr 26, 2026",
    status: "completed",
    duration: "2.8s",
  },
  {
    id: "4",
    file: "config.py",
    issues: 5,
    critical: 2,
    high: 1,
    date: "Apr 25, 2026",
    status: "failed",
    duration: "—",
  },
];

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── SECTION 1: Hero ─────────────────────────────────────────────────────────
// NOTE: SectionOne and ButtonSection are your existing components, untouched.
// Only the gradient blobs are swapped from fuchsia→brand orange.

// ─── SECTION 2: Scanner Overview ─────────────────────────────────────────────
const ScannerSection = () => {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref}
      className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-8 py-20"
      style={{ backgroundColor: DARK }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${BRAND} 1px,transparent 1px),linear-gradient(90deg,${BRAND} 1px,transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(217,119,87,0.12) 0%, transparent 70%)`,
        }}
      />

      <div
        className={cn(
          "mb-6 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
        style={{ borderColor: BRAND, color: BRAND }}
      >
        How It Works
      </div>

      <h2
        className={cn(
          "text-5xl font-bold text-white text-center mb-4 max-w-2xl leading-tight transition-all duration-700 delay-100",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Three Pipelines.
        <br />
        <span style={{ color: BRAND }}>One Shield.</span>
      </h2>

      <p
        className={cn(
          "text-gray-400 text-center mb-16 max-w-lg text-base transition-all duration-700 delay-200",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
      >
        MVSCAN runs your agents through three independent analysis pipelines -
        catching what single-tool approaches miss.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative">
        <div
          className="hidden md:block absolute top-1/2 left-[16.66%] right-[16.66%] h-px -translate-y-1/2"
          style={{
            background: `linear-gradient(90deg, transparent, ${BRAND}, transparent)`,
          }}
        />

        {PIPELINES.map((p) => (
          <div
            key={p.id}
            className={cn(
              "relative rounded-2xl border p-8 flex flex-col gap-4 transition-all duration-700 group",
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10",
            )}
            style={{
              borderColor: "rgba(217,119,87,0.25)",
              backgroundColor: "rgba(255,255,255,0.03)",
              transitionDelay: p.delay,
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: BRAND, color: DARK }}
            >
              {p.id}
            </div>
            <p.Icon className="w-7 h-7" style={{ color: BRAND }} />
            <div>
              <h3 className="text-white font-bold text-xl mb-2">{p.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(217,119,87,0.06) 0%, transparent 70%)",
              }}
            />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-16 flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-700 delay-500",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{
          borderColor: "rgba(217,119,87,0.2)",
          backgroundColor: "rgba(217,119,87,0.05)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: BRAND }}
        />
        <span className="text-sm text-gray-400">
          All three pipelines run in parallel on every scan
        </span>
      </div>
    </section>
  );
};

// ─── SECTION 3: Analytics ─────────────────────────────────────────────────────
const AnalyticsSection = () => {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref}
      className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-8 py-20 bg-white"
    >
      {/* Flower-open stacked frames */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none hidden lg:block">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-3xl border transition-all duration-1000"
            style={{
              transform: visible
                ? `rotate(${i * 12}deg) scale(${1 - i * 0.06})`
                : "rotate(0deg) scale(0.6)",
              borderColor:
                i === 0 ? BRAND : `rgba(217,119,87,${0.3 - i * 0.05})`,
              backgroundColor:
                i === 0 ? "rgba(217,119,87,0.04)" : "transparent",
              transitionDelay: `${i * 80}ms`,
              opacity: visible ? 1 : 0,
            }}
          />
        ))}
        <div
          className={cn(
            "absolute inset-8 rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col p-6 gap-3 transition-all duration-1000 delay-500",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">
            Risk Score
          </div>
          <div className="text-5xl font-black" style={{ color: BRAND }}>
            72
          </div>
          <div className="text-xs text-gray-500">High Risk · 14 critical</div>
          <div className="flex gap-1 mt-auto items-end">
            {[40, 65, 50, 80, 72, 90, 72].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-700"
                style={{
                  height: `${v * 0.7}px`,
                  backgroundColor: i === 6 ? BRAND : "#e5e7eb",
                  transitionDelay: `${600 + i * 60}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div
          className={cn(
            "mb-6 inline-flex px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-700",
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6",
          )}
          style={{ borderColor: BRAND, color: BRAND }}
        >
          Analytics
        </div>
        <h2
          className={cn(
            "text-5xl font-bold text-black mb-4 max-w-xl leading-tight transition-all duration-700 delay-100",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Full-spectrum <span style={{ color: BRAND }}>security</span>{" "}
          intelligence
        </h2>
        <p
          className={cn(
            "text-gray-500 mb-12 max-w-md text-base transition-all duration-700 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          Every scan feeds into a rich analytics dashboard - giving you the
          visibility to act fast and prioritize what matters most.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-2xl">
          {ANALYTICS_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                "rounded-xl border border-gray-100 p-5 bg-white shadow-sm hover:shadow-md transition-all duration-500 group",
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: `${200 + i * 60}ms` }}
            >
              <f.Icon className="w-5 h-5 mb-3" style={{ color: BRAND }} />
              <h3 className="font-bold text-black text-sm mb-1">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              <div
                className="mt-3 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ backgroundColor: BRAND }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 4: Pricing ───────────────────────────────────────────────────────
const PricingSection = () => {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref}
      className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-8 py-20"
      style={{ backgroundColor: DARK }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(${BRAND} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className={cn(
          "mb-6 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
        style={{ borderColor: BRAND, color: BRAND }}
      >
        Pricing
      </div>

      <h2
        className={cn(
          "text-5xl font-bold text-white text-center mb-3 transition-all duration-700 delay-100",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Simple, transparent pricing
      </h2>
      <p
        className={cn(
          "text-gray-400 text-center mb-14 max-w-lg transition-all duration-700 delay-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        Choose a plan that fits your scan volume and support needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className={cn(
              "relative rounded-2xl p-8 flex flex-col transition-all duration-700",
              plan.highlight ? "border-2 shadow-2xl" : "border",
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10",
            )}
            style={{
              borderColor: plan.highlight ? BRAND : "rgba(255,255,255,0.1)",
              backgroundColor: plan.highlight
                ? "rgba(217,119,87,0.08)"
                : "rgba(255,255,255,0.03)",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span
                  className="px-4 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: BRAND, color: DARK }}
                >
                  Recommended
                </span>
              </div>
            )}
            <h3 className="text-white font-bold text-2xl mb-1">{plan.name}</h3>
            <div className="mb-1">
              <span className="text-4xl font-black text-white">
                {plan.price}
              </span>
              <span className="text-gray-400 text-sm ml-2">{plan.period}</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
            <ul className="flex flex-col gap-2 mb-8 flex-1">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <CheckCircle
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: BRAND }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            {plan.href ? (
              <Link
                href={plan.href}
                className="block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                style={
                  plan.highlight
                    ? { backgroundColor: BRAND, color: DARK }
                    : {
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "white",
                      }
                }
              >
                {plan.cta}
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl font-semibold text-sm cursor-not-allowed"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "#6b7280",
                }}
              >
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-14 max-w-xl w-full text-center rounded-2xl border p-8 transition-all duration-700 delay-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
        style={{
          borderColor: "rgba(217,119,87,0.2)",
          backgroundColor: "rgba(217,119,87,0.04)",
        }}
      >
        <h3 className="text-white font-bold text-xl mb-2">
          Need a custom setup?
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Enterprise plans tailored to your workflow, compliance needs, and team
          size.
        </p>
        <Link
          href=""
          className="inline-block px-8 py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: BRAND, color: DARK }}
        >
          Continue to Checkout
        </Link>
      </div>
    </section>
  );
};

// ─── SECTION 5: Scan History Preview ─────────────────────────────────────────
const HistorySection = () => {
  const { ref, visible } = useInView();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sevColor: Record<string, string> = {
    completed: "#22c55e",
    failed: "#ef4444",
    analyzing: "#eab308",
  };

  return (
    <section
      ref={ref}
      className="w-full min-h-screen flex flex-col justify-center items-center px-8 py-20 bg-white relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-72 h-72 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, rgba(217,119,87,0.06) 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-4xl w-full">
        <div
          className={cn(
            "mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ borderColor: BRAND, color: BRAND }}
        >
          <History className="w-3.5 h-3.5" />
          Scan History
        </div>

        <h2
          className={cn(
            "text-5xl font-bold text-black mb-3 leading-tight transition-all duration-700 delay-100",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Every scan.
          <br />
          <span style={{ color: BRAND }}>Fully recorded.</span>
        </h2>
        <p
          className={cn(
            "text-gray-500 mb-10 max-w-md transition-all duration-700 delay-200",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          Get a complete log of every scan you've run - with issue breakdowns,
          pipeline stages, severity summaries, and duration data at a glance.
        </p>

        {/* History table */}
        <div
          className={cn(
            "rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-700 delay-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200 px-5 py-3">
            {["File", "Issues", "Critical", "Date", "Duration", "Status"].map(
              (h) => (
                <div
                  key={h}
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </div>
              ),
            )}
          </div>

          {MOCK_HISTORY.map((scan, i) => (
            <div key={scan.id}>
              <div
                className="grid grid-cols-6 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 items-center"
                onClick={() =>
                  setExpanded(expanded === scan.id ? null : scan.id)
                }
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  {expanded === scan.id ? (
                    <ChevronDown
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: BRAND }}
                    />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  )}
                  <span className="truncate">{scan.file}</span>
                </div>
                <div className="text-sm text-gray-600">{scan.issues}</div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: scan.critical > 0 ? "#ef4444" : "#6b7280" }}
                >
                  {scan.critical}
                </div>
                <div className="text-sm text-gray-500">{scan.date}</div>
                <div className="text-sm text-gray-500 font-mono">
                  {scan.duration}
                </div>
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: sevColor[scan.status] + "18",
                      color: sevColor[scan.status],
                    }}
                  >
                    {scan.status === "completed" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Expanded row */}
              {expanded === scan.id && (
                <div className="px-5 py-5 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {[
                      { label: "Total Issues", val: scan.issues, color: DARK },
                      {
                        label: "Critical",
                        val: scan.critical,
                        color: "#ef4444",
                      },
                      { label: "High", val: scan.high, color: "#f97316" },
                      {
                        label: "Duration",
                        val: scan.duration,
                        color: "#6b7280",
                      },
                    ].map(({ label, val, color }) => (
                      <div
                        key={label}
                        className="bg-white rounded-xl border border-gray-200 p-4"
                      >
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="text-2xl font-bold" style={{ color }}>
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {["AST Analysis", "Pyre Typing", "Pysa Taint"].map(
                      (stage) => (
                        <div
                          key={stage}
                          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-semibold text-gray-700"
                        >
                          <Shield
                            className="w-3.5 h-3.5"
                            style={{ color: BRAND }}
                          />
                          {stage}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "mt-8 flex justify-center transition-all duration-700 delay-500",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          <Link
            href="/dashboard/history"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 border"
            style={{ borderColor: BRAND, color: BRAND }}
          >
            <History className="w-4 h-4" />
            View Full History
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 6: Demo / GitHub ─────────────────────────────────────────────────
const DemoSection = () => {
  const { ref, visible } = useInView();
  const [githubUrl, setGithubUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const handleDemo = () => {
    if (!githubUrl.trim()) return;
    setScanning(true);
    setDone(false);
    setTimeout(() => {
      setScanning(false);
      setDone(true);
    }, 2500);
  };

  return (
    <section
      ref={ref}
      className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-8 py-20"
      style={{ backgroundColor: DARK }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${BRAND} 1px,transparent 1px),linear-gradient(90deg,${BRAND} 1px,transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom, rgba(217,119,87,0.1) 0%, transparent 70%)`,
        }}
      />

      <div
        className={cn(
          "mb-6 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
        style={{ borderColor: BRAND, color: BRAND }}
      >
        Try It Free
      </div>

      <h2
        className={cn(
          "text-5xl font-bold text-white text-center mb-4 max-w-2xl leading-tight transition-all duration-700 delay-100",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Scan your repo.
        <br />
        <span style={{ color: BRAND }}>Right now.</span>
      </h2>

      <p
        className={cn(
          "text-gray-400 text-center mb-12 max-w-lg transition-all duration-700 delay-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        Paste any public GitHub repository URL and get an instant vulnerability
        report - no signup required for your first demo scan.
      </p>

      {/* GitHub URL input */}
      <div
        className={cn(
          "w-full max-w-2xl transition-all duration-700 delay-300",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
      >
        <div className="flex gap-3 mb-4">
          <div
            className="flex-1 flex items-center gap-3 rounded-2xl border px-5 py-4"
            style={{
              borderColor: "rgba(217,119,87,0.3)",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          >
            <Github
              className="w-5 h-5 flex-shrink-0"
              style={{ color: BRAND }}
            />
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => {
                setGithubUrl(e.target.value);
                setDone(false);
              }}
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
            />
          </div>
          <button
            onClick={handleDemo}
            disabled={scanning || !githubUrl.trim()}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 disabled:opacity-50"
            style={{ backgroundColor: BRAND, color: DARK }}
          >
            {scanning ? (
              <>
                <FileSearch className="w-4 h-4 animate-pulse" />
                Scanning…
              </>
            ) : done ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Done
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Demo
              </>
            )}
          </button>
        </div>

        {/* Demo result preview */}
        {done && (
          <div
            className="rounded-2xl border p-6 animate-fade-in"
            style={{
              borderColor: "rgba(217,119,87,0.25)",
              backgroundColor: "rgba(217,119,87,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5" style={{ color: BRAND }} />
              <span className="text-white font-bold text-sm">
                Demo scan complete
              </span>
              <span className="ml-auto text-xs text-gray-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                3.2s
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Issues Found", val: "9", color: "white" },
                { label: "Critical", val: "2", color: "#ef4444" },
                { label: "High", val: "4", color: "#f97316" },
                { label: "Low", val: "3", color: "#22c55e" },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 text-center"
                >
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="text-2xl font-black" style={{ color }}>
                    {val}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Sign up to view the full report and run unlimited scans.
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        className={cn(
          "flex items-center gap-4 my-10 max-w-2xl w-full transition-all duration-700 delay-400",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        />
        <span className="text-xs text-gray-600 uppercase tracking-widest">
          or get started with
        </span>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* GitHub CTA */}
      <div
        className={cn(
          "flex gap-4 transition-all duration-700 delay-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        )}
      >
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full border font-semibold text-sm transition-all duration-300 hover:bg-white/5"
          style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}
        >
          <Github className="w-4 h-4" />
          View on GitHub
        </a>
        <Link
          href="/register"
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300"
          style={{ backgroundColor: BRAND, color: DARK }}
        >
          <Shield className="w-4 h-4" />
          Start Scanning Free
        </Link>
      </div>
    </section>
  );
};

// ─── SECTION 7: Analytics Filter Teaser ──────────────────────────────────────
const FilterSection = () => {
  const { ref, visible } = useInView();
  const [active, setActive] = useState("All");
  const filters = ["All", "Critical", "High", "Medium", "Low", "Resolved"];
  const mockItems = [
    {
      label: "SQL Injection via tool input",
      sev: "Critical",
      file: "agent_tools.py",
    },
    { label: "Unvalidated taint source", sev: "High", file: "mcp_handler.py" },
    { label: "Type mismatch in pipeline", sev: "Medium", file: "pipeline.py" },
    { label: "Unused import shadow", sev: "Low", file: "utils.py" },
    { label: "Path traversal risk", sev: "Critical", file: "file_ops.py" },
    { label: "Hardcoded credential", sev: "High", file: "config.py" },
  ];
  const sevColor: Record<string, string> = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#22c55e",
    Resolved: "#6b7280",
  };
  const shown =
    active === "All" ? mockItems : mockItems.filter((m) => m.sev === active);

  return (
    <section
      ref={ref}
      className="w-full min-h-screen flex flex-col justify-center items-center px-8 py-20 bg-white relative overflow-hidden"
    >
      <div
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background: `radial-gradient(circle at bottom right, rgba(217,119,87,0.08) 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-4xl w-full">
        <div
          className={cn(
            "mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ borderColor: BRAND, color: BRAND }}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics Explorer
        </div>

        <h2
          className={cn(
            "text-5xl font-bold text-black mb-3 leading-tight transition-all duration-700 delay-100",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Filter. Focus. <span style={{ color: BRAND }}>Fix.</span>
        </h2>
        <p
          className={cn(
            "text-gray-500 mb-10 max-w-md transition-all duration-700 delay-200",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          Slice findings by severity so your team tackles the most critical
          issues first.
        </p>

        <div
          className={cn(
            "flex flex-wrap gap-3 mb-8 transition-all duration-700 delay-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border"
              style={
                active === f
                  ? {
                      backgroundColor: BRAND,
                      color: "#fff",
                      borderColor: BRAND,
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "#374151",
                      borderColor: "#e5e7eb",
                    }
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {shown.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-500",
                visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6",
              )}
              style={{ transitionDelay: `${400 + i * 60}ms` }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: sevColor[item.sev] }}
              />
              <span className="flex-1 text-sm font-medium text-gray-800">
                {item.label}
              </span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: sevColor[item.sev] + "18",
                  color: sevColor[item.sev],
                }}
              >
                {item.sev}
              </span>
              <span className="text-xs text-gray-400 font-mono hidden sm:block">
                {item.file}
              </span>
            </div>
          ))}
          {shown.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              No issues in this category
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-10 flex justify-center transition-all duration-700 delay-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm shadow-md transition-all duration-300"
            style={{ backgroundColor: DARK, color: "white" }}
          >
            Open Full Dashboard
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Main Landing Component ───────────────────────────────────────────────────
const Landing = ({ height = "h-screen", width = "w-full" }: LandingProps) => {
  return (
    <div className="w-full">
      {/* ── Section 1: Hero — brand orange replacing blue/fuchsia ── */}
      <Box
        className={cn(height, width, "relative overflow-hidden bg-white pt-2")}
      >
        {/* Background grid */}
        <div className="absolute inset-0 z-0 pointer-events-none mt-18">
          <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          {/* Brand orange glow replacing fuchsia */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 h-[310px] w-[310px] rounded-full opacity-20 blur-[100px]"
            style={{ backgroundColor: BRAND }}
          />
        </div>
        <Header />
        <SectionOne font={montText.className} />
        <ButtonSection />
      </Box>

      {/* ── Section 2: Scanner Overview (dark) ── */}
      <ScannerSection />

      {/* ── Section 3: Analytics (white) ── */}
      <AnalyticsSection />

      {/* ── Section 4: Pricing (dark) ── */}
      <PricingSection />

      {/* ── Section 5: Scan History (white) ── */}
      <HistorySection />

      {/* ── Section 6: Demo / GitHub (dark) ── */}
      <DemoSection />

      {/* ── Section 7: Filter Teaser (white) ── */}
      <FilterSection />
    </div>
  );
};

export { Landing };
