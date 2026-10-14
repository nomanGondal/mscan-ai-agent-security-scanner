"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  Zap,
  Shield,
  CheckCircle2,
  Twitter,
  Github,
  Linkedin,
  Send,
  Clock,
  Globe,
  Bot,
  User,
  Loader2,
  CalendarDays,
  X,
  Menu,
} from "lucide-react";

import { Box } from "@radix-ui/themes";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { AUTH, REGISTRATION } from "@/constants";
import { cn } from "@/utiils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

// ── ⚙️  CONFIG ─────────────────────────────────────────────────
// 1. Go to calendly.com → create a free account
// 2. Click "+ New Event Type" → One-on-One → set name & duration
// 3. Copy your event link (e.g. https://calendly.com/yourname/30min)
// 4. Paste it below — that's all you need, no API key required!
const CALENDLY_URL = "https://calendly.com/YOUR-USERNAME/book-a-call";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE;
// ──────────────────────────────────────────────────────────────

const BRAND = "#D97757";
const BRAND_DARK = "#c4623e";

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });

// ── Header (dark-themed version of your component) ────────────
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
// ── Calendly Inline Embed ─────────────────────────────────────
// How Calendly embed works:
//   1. We load their JS widget script once (widget.js)
//   2. Any div with class "calendly-inline-widget" + data-url gets
//      automatically converted into an iframe calendar picker.
//   3. The dark theme is applied via URL query params:
//      background_color, text_color, primary_color
// No API key needed for the inline embed — it's free!
function CalendlyEmbed() {
  useEffect(() => {
    if (document.getElementById("calendly-script")) return;
    const script = document.createElement("script");
    script.id = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const embedUrl =
    `${CALENDLY_URL}` +
    `?hide_event_type_details=1` +
    `&hide_gdpr_banner=1` +
    `&background_color=0a0a0a` +
    `&text_color=ffffff` +
    `&primary_color=D97757`;

  return (
    <div
      className="calendly-inline-widget"
      data-url={embedUrl}
      style={{
        minWidth: 320,
        height: 700,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />
  );
}

// ── Chatbot ───────────────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey there! 👋 I'm the MSCAN assistant. Ask me anything about our product, pricing, or support!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    // Stub — plug in your AI endpoint here
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Thanks for reaching out! Our team will get back to you soon. You can also book a call using the calendar on this page.",
        },
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 32px ${BRAND}50`,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? <X size={24} color="#fff" /> : <Bot size={24} color="#fff" />}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 28,
            zIndex: 999,
            width: 360,
            height: 500,
            borderRadius: 24,
            background: "#0e0e0e",
            border: `1px solid rgba(217,119,87,0.2)`,
            boxShadow: `0 24px 80px rgba(0,0,0,0.7)`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "rgba(217,119,87,0.08)",
              borderBottom: "1px solid rgba(217,119,87,0.15)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                MSCAN Assistant
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  Online
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      msg.role === "bot"
                        ? `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`
                        : "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {msg.role === "bot" ? (
                    <Bot size={14} color="#fff" />
                  ) : (
                    <User size={14} color="rgba(255,255,255,0.7)" />
                  )}
                </div>
                <div
                  style={{
                    maxWidth: "78%",
                    background:
                      msg.role === "bot"
                        ? "rgba(255,255,255,0.05)"
                        : `linear-gradient(135deg, ${BRAND}CC, ${BRAND_DARK}CC)`,
                    border:
                      msg.role === "bot"
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    borderRadius:
                      msg.role === "bot"
                        ? "18px 18px 18px 4px"
                        : "18px 18px 4px 18px",
                    padding: "10px 14px",
                    fontSize: 13.5,
                    color: "#fff",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={14} color="#fff" />
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "12px 16px",
                    display: "flex",
                    gap: 4,
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: BRAND,
                        animation: `bounce 1s ${d * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Type a message..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 13.5,
                color: "#fff",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                background:
                  loading || !input.trim()
                    ? "rgba(217,119,87,0.3)"
                    : `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {loading ? (
                <Loader2
                  size={16}
                  color="#fff"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
              ) : (
                <Send size={16} color="#fff" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Reusable form fields ──────────────────────────────────────
function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: focused ? BRAND : "rgba(255,255,255,0.4)",
          transition: "color 0.2s",
        }}
      >
        {label}
        {required && <span style={{ color: BRAND, marginLeft: 4 }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? BRAND + "60" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 12,
          padding: "14px 18px",
          fontSize: 15,
          color: "#fff",
          outline: "none",
          width: "100%",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  required,
  value,
  onChange,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: focused ? BRAND : "rgba(255,255,255,0.4)",
          transition: "color 0.2s",
        }}
      >
        {label}
        {required && <span style={{ color: BRAND, marginLeft: 4 }}>*</span>}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={6}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? BRAND + "60" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 12,
          padding: "14px 18px",
          fontSize: 15,
          color: "#fff",
          outline: "none",
          width: "100%",
          resize: "vertical",
          transition: "border-color 0.2s",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Main Contact Page ─────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [state, setState] = useState("idle");
  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("form"); // "form" | "book"

  const topics = [
    { label: "Sales", icon: <Zap size={14} /> },
    { label: "Support", icon: <MessageSquare size={14} /> },
    { label: "Security", icon: <Shield size={14} /> },
    { label: "Other", icon: <Globe size={14} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...form, topic }),
      });
      if (res.ok) {
        setState("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setTopic(null);
      } else setState("error");
    } catch {
      setState("error");
    }
  };

  const channels = [
    {
      icon: <Mail size={20} />,
      title: "Email Us",
      desc: "For general inquiries and sales.",
      value: "hello@mscan.dev",
      href: "mailto:hello@mscan.dev",
    },
    {
      icon: <CalendarDays size={20} />,
      title: "Book a Call",
      desc: "Schedule a 30-min call with our team.",
      value: "Pick a time →",
      href: null,
      action: () => setActiveTab("book"),
    },
    {
      icon: <Clock size={20} />,
      title: "Response Time",
      desc: "We reply within one business day.",
      value: "< 24 hours",
      href: null,
    },
  ];

  return (
    <div
      style={{
        background: "#050505",
        color: "#fff",
        minHeight: "100vh",
        overflowX: "hidden",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(217,119,87,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217,119,87,0.04) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Your Header ── */}
        <Header />

        {/* Hero */}
        <section style={{ padding: "100px 24px 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(217,119,87,0.25)",
                borderRadius: 999,
                padding: "6px 18px",
                fontSize: 12,
                fontWeight: 600,
                color: BRAND,
                backgroundColor: "rgba(217,119,87,0.06)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 32,
              }}
            >
              <Mail size={11} /> Get in Touch
            </div>
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              We would love to{" "}
              <span
                style={{
                  backgroundImage: `linear-gradient(135deg, ${BRAND} 0%, #f4a07a 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                hear from you.
              </span>
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.7,
              }}
            >
              Whether you are evaluating MSCAN, need support, or just have a
              question - our team is here.
            </p>
          </div>
        </section>

        {/* Channel Cards */}
        <section style={{ padding: "0 24px 80px" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {channels.map(({ icon, title, desc, value, href, action }) => (
              <div
                key={title}
                onClick={action}
                style={{
                  padding: 28,
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.02)",
                  transition: "border-color 0.3s, background 0.3s",
                  cursor: href || action ? "pointer" : "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${BRAND}30`;
                  e.currentTarget.style.background = "rgba(217,119,87,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(217,119,87,0.1)",
                    border: "1px solid rgba(217,119,87,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: BRAND,
                    marginBottom: 16,
                  }}
                >
                  {icon}
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                  {title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  {desc}
                </p>
                {href ? (
                  <a
                    href={href}
                    style={{
                      fontSize: 13,
                      color: BRAND,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {value}
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: 13,
                      color: action ? BRAND : "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                      cursor: action ? "pointer" : "default",
                    }}
                  >
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tab switcher + content */}
        <section style={{ padding: "0 24px 120px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 32,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 16,
                padding: 4,
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                {
                  id: "form",
                  label: "Send a Message",
                  icon: <Send size={15} />,
                },
                {
                  id: "book",
                  label: "Book a Call",
                  icon: <CalendarDays size={15} />,
                },
              ].map(({ id, label, icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "12px 20px",
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 14,
                      fontWeight: 700,
                      transition: "all 0.2s",
                      background: active
                        ? `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`
                        : "transparent",
                      color: active ? "#fff" : "rgba(255,255,255,0.4)",
                      boxShadow: active ? `0 4px 16px ${BRAND}40` : "none",
                    }}
                  >
                    {icon} {label}
                  </button>
                );
              })}
            </div>

            {/* ── Contact Form ── */}
            {activeTab === "form" && (
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 28,
                  padding: "52px 48px",
                  background: "rgba(255,255,255,0.02)",
                  boxShadow: "0 0 80px rgba(0,0,0,0.4)",
                }}
              >
                <div style={{ marginBottom: 36 }}>
                  <h2
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      marginBottom: 8,
                    }}
                  >
                    Send us a message
                  </h2>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>
                    We will get back to you within 24 hours.
                  </p>
                </div>

                {/* Topic pills */}
                <div style={{ marginBottom: 28 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 12,
                    }}
                  >
                    Topic
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {topics.map(({ label, icon }) => {
                      const active = topic === label;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setTopic(label)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 10,
                            border: `1px solid ${active ? BRAND + "60" : "rgba(255,255,255,0.1)"}`,
                            background: active
                              ? "rgba(217,119,87,0.12)"
                              : "transparent",
                            color: active ? BRAND : "rgba(255,255,255,0.4)",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            fontFamily: "inherit",
                          }}
                        >
                          {icon} {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {state === "success" ? (
                  <div
                    style={{
                      padding: "48px 32px",
                      textAlign: "center",
                      border: "1px solid rgba(34,197,94,0.2)",
                      borderRadius: 20,
                      background: "rgba(34,197,94,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "rgba(34,197,94,0.1)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        color: "#22c55e",
                      }}
                    >
                      <CheckCircle2 size={28} />
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        marginBottom: 10,
                      }}
                    >
                      Message sent!
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.7,
                      }}
                    >
                      Thanks for reaching out. We will reply within one business
                      day.
                    </p>
                    <button
                      onClick={() => setState("idle")}
                      style={{
                        marginTop: 28,
                        padding: "10px 24px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "transparent",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 24,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 20,
                      }}
                    >
                      <InputField
                        label="Full Name"
                        name="name"
                        placeholder="Alex Johnson"
                        required
                        value={form.name}
                        onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                      />
                      <InputField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="alex@company.com"
                        required
                        value={form.email}
                        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                      />
                    </div>
                    <InputField
                      label="Subject"
                      name="subject"
                      placeholder="How can we help?"
                      required
                      value={form.subject}
                      onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
                    />
                    <TextareaField
                      label="Message"
                      name="message"
                      placeholder="Tell us what you need..."
                      required
                      value={form.message}
                      onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                    />

                    {state === "error" && (
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: 10,
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          fontSize: 13,
                          color: "#ef4444",
                        }}
                      >
                        Something went wrong. Please try again or email us
                        directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: "16px 32px",
                        borderRadius: 14,
                        background:
                          state === "loading"
                            ? "rgba(217,119,87,0.4)"
                            : `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                        border: "none",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: state === "loading" ? "wait" : "pointer",
                        boxShadow: `0 0 40px ${BRAND}30`,
                        fontFamily: "inherit",
                      }}
                    >
                      {state === "loading" ? (
                        <>
                          <Loader2
                            size={16}
                            style={{ animation: "spin 0.8s linear infinite" }}
                          />{" "}
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}

                <p
                  style={{
                    marginTop: 24,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.2)",
                    textAlign: "center",
                    lineHeight: 1.7,
                  }}
                >
                  By submitting you agree to our{" "}
                  <a
                    href="/privacy"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      textDecoration: "underline",
                    }}
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            )}

            {/* ── Book a Call (Calendly) ── */}
            {activeTab === "book" && (
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 28,
                  padding: "40px 32px",
                  background: "rgba(255,255,255,0.02)",
                  boxShadow: "0 0 80px rgba(0,0,0,0.4)",
                }}
              >
                <div style={{ marginBottom: 28, textAlign: "center" }}>
                  <h2
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      marginBottom: 8,
                    }}
                  >
                    Book a Call
                  </h2>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>
                    Pick a time that works for you - 30 minutes, no commitment.
                  </p>
                </div>
                {/* Calendly widget renders here automatically */}
                <CalendlyEmbed />
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "40px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.2)",
              fontWeight: 700,
            }}
          >
            M<span style={{ color: BRAND }}>SCAN</span>.
          </p>
          <div
            style={{
              width: 1,
              height: 14,
              background: "rgba(255,255,255,0.1)",
            }}
          />
          {[
            { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
            { label: "GitHub", href: "https://github.com", Icon: Github },
            { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
          ].map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "rgba(255,255,255,0.25)",
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = BRAND)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
              }
            >
              <Icon size={13} /> {label}
            </a>
          ))}
        </section>
      </div>

      {/* Floating Chatbot */}
      <Chatbot />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap');
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(217,119,87,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
