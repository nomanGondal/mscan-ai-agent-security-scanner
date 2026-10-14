"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box } from "@radix-ui/themes";

const BRAND = "#D97757";

const docs = [
  {
    title: "Getting Started",
    href: "/docs",
    items: [
      { title: "Overview", href: "/docs" },
      { title: "Installation", href: "/docs#installation" },
      { title: "Quick Start", href: "/docs#quick-start" },
    ],
  },
  {
    title: "Scanner",
    href: "/docs/scanner",
    items: [
      { title: "How It Works", href: "/docs/scanner#how-it-works" },
      { title: "Supported Formats", href: "/docs/scanner#formats" },
      { title: "Configuration", href: "/docs/scanner#configuration" },
    ],
  },
  {
    title: "Analysis Tools",
    href: "/docs/analysis",
    items: [
      { title: "Pyre Testing", href: "/docs/pyre-testing" },
      { title: "Pysa Testing", href: "/docs/pysa-testing" },
      { title: "AST Testing", href: "/docs/ast-testing" },
    ],
  },
  {
    title: "API Reference",
    href: "/docs/api",
    items: [
      { title: "Endpoints", href: "/docs/api#endpoints" },
      { title: "Authentication", href: "/docs/api#auth" },
      { title: "Rate Limiting", href: "/docs/api#limits" },
    ],
  },
];

export default function PysaTestingPage() {
  const pathname = usePathname();

  return (
    <Box>
      <Box className="flex">
        {/* Sidebar */}
        <Box className="w-64 bg-white border-r border-gray-300 px-6 py-8 min-h-[calc(100vh-80px)]">
          <nav className="space-y-8">
            {docs.map((section) => (
              <div key={section.href}>
                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`text-sm transition ${
                          pathname === item.href
                            ? "font-semibold border-l-2 pl-3"
                            : "text-gray-600 hover:text-black"
                        }`}
                        style={
                          pathname === item.href
                            ? { borderColor: BRAND, color: BRAND }
                            : {}
                        }
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </Box>

        {/* Main Content */}
        <Box className="flex-1 px-12 py-8 max-w-4xl">
          <article className="prose prose-sm max-w-none">
            <h1 className="text-4xl font-bold text-black mb-4">
              Pysa Taint Analysis
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Advanced data flow and security analysis using Pysa (Pyre Static
              Analyzer).
            </p>

            <section id="overview" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                What is Pysa?
              </h2>
              <p className="text-gray-600 mb-4">
                Pysa is a static analysis tool that identifies security
                vulnerabilities by tracking data flow through your application.
                It detects when untrusted data flows to sensitive operations.
              </p>
              <div
                className="bg-white rounded-lg p-4 space-y-3"
                style={{ border: `1px solid rgba(217,119,87,0.2)` }}
              >
                <div>
                  <h3 className="font-bold mb-3" style={{ color: BRAND }}>
                    Key Capabilities:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                    <li>Taint tracking from sources to sinks</li>
                    <li>Cross-function data flow analysis</li>
                    <li>Vulnerability pattern matching</li>
                    <li>Custom rule definition support</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="sources-sinks" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Sources and Sinks
              </h2>
              <p className="text-gray-600 mb-4">
                Pysa analyzes the flow of potentially unsafe data (sources) to
                dangerous operations (sinks):
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="rounded p-4"
                  style={{
                    backgroundColor: "rgba(217,119,87,0.03)",
                    border: `1px solid rgba(217,119,87,0.2)`,
                  }}
                >
                  <h3 className="font-bold mb-3" style={{ color: BRAND }}>
                    Sources (Unsafe Data)
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>User input</li>
                    <li>HTTP requests</li>
                    <li>File reads</li>
                    <li>Environment variables</li>
                    <li>Database queries</li>
                  </ul>
                </div>
                <div
                  className="rounded p-4"
                  style={{
                    backgroundColor: "rgba(217,119,87,0.03)",
                    border: `1px solid rgba(217,119,87,0.2)`,
                  }}
                >
                  <h3 className="font-bold mb-3" style={{ color: BRAND }}>
                    Sinks (Dangerous Ops)
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>SQL execution</li>
                    <li>Command execution</li>
                    <li>Code evaluation</li>
                    <li>File operations</li>
                    <li>Serialization</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="vulnerabilities" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Vulnerabilities Detected
              </h2>
              <div className="space-y-3">
                <div
                  className="rounded p-4"
                  style={{
                    backgroundColor: "rgba(217,119,87,0.03)",
                    border: `1px solid rgba(217,119,87,0.2)`,
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    SQL Injection
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Untrusted data in SQL queries
                  </p>
                </div>
                <div
                  className="rounded p-4"
                  style={{
                    backgroundColor: "rgba(217,119,87,0.03)",
                    border: `1px solid rgba(217,119,87,0.2)`,
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    Command Injection
                  </h3>
                  <p className="text-gray-600 text-sm">
                    User input passed to shell commands
                  </p>
                </div>
                <div
                  className="rounded p-4"
                  style={{
                    backgroundColor: "rgba(217,119,87,0.03)",
                    border: `1px solid rgba(217,119,87,0.2)`,
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    Deserialization Attacks
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Untrusted data in pickle or eval
                  </p>
                </div>
                <div
                  className="rounded p-4"
                  style={{
                    backgroundColor: "rgba(217,119,87,0.03)",
                    border: `1px solid rgba(217,119,87,0.2)`,
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    Path Traversal
                  </h3>
                  <p className="text-gray-600 text-sm">
                    User input in file path operations
                  </p>
                </div>
              </div>
            </section>

            <section id="custom-rules" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Custom Rules for MCP
              </h2>
              <p className="text-gray-600 mb-4">
                Our scanner includes custom Pysa rules specifically designed for
                MCP agent security:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Tool input validation checks</li>
                <li>Resource access controls</li>
                <li>API call safety verification</li>
                <li>Sensitive operation tracking</li>
              </ul>
            </section>
          </article>
        </Box>
      </Box>
    </Box>
  );
}
