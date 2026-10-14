"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import {
  Shield,
  Zap,
  Globe,
  Lock,
  Code2,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { AUTH, REGISTRATION } from "@/constants";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const font = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

const BRAND = "#D97757";
const BRAND_DARK = "#c4623e";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="w-full flex justify-center px-4"
      style={{ paddingTop: 20, position: "relative", zIndex: 10 }}
    >
      {/* Wrapper */}
      <div className="w-full max-w-5xl">
        {/* Desktop Header */}
        <div
          className={cn(montserrat.className)}
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            height: 64,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            borderRadius: 999,
            boxShadow:
              "0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(217,119,87,0.08)",
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Logo */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#fff",
                margin: 0,
              }}
            >
              M<span style={{ color: BRAND }}>SCAN</span>.
            </p>
          </div>

          {/* Nav */}
          <div
            className="hidden md:flex"
            style={{
              flex: 1,
              justifyContent: "center",
              gap: 24,
              fontSize: 14,
            }}
          >
            {["Home", "About", "Contact"].map((n) => (
              <Link
                key={n}
                href={n === "Home" ? "/" : `/${n.toLowerCase()}`}
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {n}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                style={{
                  color: "rgba(255,255,255,0.7)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                More
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              >
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth */}
          <div
            className="hidden md:flex"
            style={{
              flex: 1,
              justifyContent: "flex-end",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Link
              href={AUTH}
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 999,
              }}
            >
              Login
            </Link>

            <Link
              href={REGISTRATION}
              style={{
                fontSize: 14,
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                padding: "9px 22px",
                borderRadius: 999,
                background: BRAND,
              }}
            >
              Sign up →
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="flex md:hidden" style={{ marginLeft: "auto" }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                padding: 8,
                borderRadius: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className={cn(montserrat.className)}
            style={{
              marginTop: 8,
              background: "rgba(10,10,10,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              color: "#fff",
            }}
          >
            {["Home", "About", "Contact", "Documentation", "GitHub"].map(
              (n) => (
                <Link
                  key={n}
                  href={
                    n === "Home"
                      ? "/"
                      : n === "Documentation" || n === "GitHub"
                        ? "#"
                        : `/${n.toLowerCase()}`
                  }
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  {n}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = Math.ceil(to / 60);
        const t = setInterval(() => {
          start += step;
          if (start >= to) {
            setCount(to);
            clearInterval(t);
          } else setCount(start);
        }, 16);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Noise SVG filter ──────────────────────────────────────────────────────────
const NoiseFilter = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
      <feBlend in="SourceGraphic" mode="multiply" />
    </filter>
  </svg>
);

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const stats = [
    { value: 50000, suffix: "+", label: "Vulnerabilities Detected" },
    { value: 12000, suffix: "+", label: "Files Scanned" },
    { value: 99, suffix: "%", label: "Detection Accuracy" },
    { value: 3, suffix: "s", label: "Avg. Scan Time" },
  ];

  const pillars = [
    {
      icon: <Shield size={22} />,
      title: "Static Analysis Engine",
      desc: "Deep AST-level parsing across 15+ languages with pattern matching against 800+ known CVE signatures and OWASP Top 10 vectors.",
    },
    {
      icon: <Zap size={22} />,
      title: "Real-Time Scanning",
      desc: "Sub-3-second scan pipeline powered by concurrent workers. Upload a ZIP and get a full security report before your coffee cools.",
    },
    {
      icon: <Lock size={22} />,
      title: "Zero Data Retention",
      desc: "Your source code is scanned in an ephemeral sandbox and purged immediately after. We never store, train on, or expose your code.",
    },
    {
      icon: <Globe size={22} />,
      title: "Language Agnostic",
      desc: "JavaScript, TypeScript, Python, Java, Go, PHP, Ruby, Rust and more. One scanner for your entire polyglot monorepo.",
    },
    {
      icon: <Code2 size={22} />,
      title: "Actionable Reports",
      desc: "Every issue includes file path, line number, rule ID, severity rating, and a plain-English remediation guide.",
    },
    {
      icon: <Users size={22} />,
      title: "Team Workflows",
      desc: "Share reports, assign owners, track remediation status, and integrate with GitHub, GitLab, and Jira webhooks.",
    },
  ];

  const team = [
    {
      name: "",
      role: "Founder & CEO",
      avatar: "AM",
      grad: `linear-gradient(135deg, ${BRAND} 0%, #c4623e 100%)`,
    },
  ];

  return (
    <div
      className={font.className}
      style={{
        background: "#050505",
        color: "#fff",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Header />

      <NoiseFilter />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "120px 24px 80px",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(217,119,87,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(217,119,87,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            mask: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BRAND}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{ position: "relative", textAlign: "center", maxWidth: 860 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(217,119,87,0.3)",
              borderRadius: 999,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 600,
              color: BRAND,
              backgroundColor: "rgba(217,119,87,0.08)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            <Star size={11} fill={BRAND} color={BRAND} />
            Security Intelligence Platform
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 88px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              marginBottom: 28,
            }}
          >
            Built to find what
            <br />
            <span
              style={{
                backgroundImage: `linear-gradient(135deg, ${BRAND} 0%, #f4a07a 50%, ${BRAND} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              attackers look for.
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto 48px",
            }}
          >
            MSCAN is an AI-augmented static analysis platform that scans your
            entire codebase in seconds and returns a prioritized, actionable
            security report no configuration required.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: `0 0 40px ${BRAND}40`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 8px 48px ${BRAND}60`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 0 40px ${BRAND}40`;
              }}
            >
              Book a Demo <ArrowRight size={16} />
            </a>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
                padding: "14px 32px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                backgroundColor: "rgba(255,255,255,0.04)",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  `${BRAND}60`;
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.7)";
              }}
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "60px 24px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 48,
            textAlign: "center",
          }}
        >
          {stats.map(({ value, suffix, label }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  backgroundImage: `linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                <Counter to={value} suffix={suffix} />
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────────────────────────────── */}
      <section
        style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: BRAND,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            The Platform
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Every layer of your
            <br />
            <span style={{ color: "rgba(255,255,255,0.3)" }}>
              security stack, covered.
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 1,
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {pillars.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              style={{
                padding: "40px 36px",
                background:
                  i % 2 === 0
                    ? "rgba(255,255,255,0.025)"
                    : "rgba(255,255,255,0.015)",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                transition: "background 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `rgba(217,119,87,0.06)`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i % 2 === 0
                    ? "rgba(255,255,255,0.025)"
                    : "rgba(255,255,255,0.015)")
              }
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `rgba(217,119,87,0.12)`,
                  border: `1px solid rgba(217,119,87,0.25)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: BRAND,
                  marginBottom: 20,
                }}
              >
                {icon}
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.7,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          background: "rgba(217,119,87,0.04)",
          borderTop: "1px solid rgba(217,119,87,0.12)",
          borderBottom: "1px solid rgba(217,119,87,0.12)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: BRAND,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Our Mission
          </p>
          <blockquote
            style={{
              fontSize: "clamp(22px, 4vw, 38px)",
              fontWeight: 700,
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.85)",
              fontStyle: "italic",
            }}
          >
            "Security should not be a post-launch fire drill. It should be the
            first line of code you write and the last check before you ship."
          </blockquote>
          <div
            style={{
              width: 48,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${BRAND}, transparent)`,
              margin: "32px auto",
            }}
          />
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.8,
            }}
          >
            We founded MSCAN after watching too many teams discover critical
            vulnerabilities in production. Our platform brings enterprise-grade
            static analysis to every developer, from solo founders to large
            engineering orgs, with no setup, no agents, and no friction.
          </p>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────────── */}
      <section
        style={{ padding: "100px 24px", maxWidth: 900, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: BRAND,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            The Team
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            People behind the scanner
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {team.map(({ name, role, avatar, grad }) => (
            <div
              key={name}
              style={{
                padding: "36px 28px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                textAlign: "center",
                background: "rgba(255,255,255,0.02)",
                transition: "border-color 0.3s, transform 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  `${BRAND}40`;
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: grad,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                  margin: "0 auto 20px",
                  letterSpacing: "-0.02em",
                }}
              >
                {avatar}
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                {name}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                {role}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <div
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.4)",
                      transition: "color 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = BRAND;
                      (e.currentTarget as HTMLElement).style.borderColor =
                        `${BRAND}50`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.4)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  >
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Calendly Book Demo ────────────────────────────────────────────────── */}
      {/* ── CTA Strip ────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              marginBottom: 20,
            }}
          >
            Start scanning today.
            <br />
            <span style={{ color: "rgba(255,255,255,0.2)" }}>
              Free, forever.
            </span>
          </h2>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "No credit card required", icon: CheckCircle2 },
              { label: "3 free ZIP scans", icon: CheckCircle2 },
              { label: "Zero data retention", icon: CheckCircle2 },
            ].map(({ label, icon: Icon }) => (
              <span
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                }}
              >
                <Icon size={13} color={BRAND} />
                {label}
              </span>
            ))}
          </div>
          <div
            style={{
              marginTop: 36,
              display: "flex",
              gap: 14,
              justifyContent: "center",
            }}
          >
            <Link
              href="/registration"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                color: "#fff",
                padding: "14px 36px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: `0 0 40px ${BRAND}40`,
              }}
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
