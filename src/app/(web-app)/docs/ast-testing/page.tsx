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

export default function AstTestingPage() {
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
              MCP AST Analysis
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Abstract Syntax Tree analysis specific to MCP (Model Context
              Protocol) agent security.
            </p>

            <section id="overview" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                What is AST Analysis?
              </h2>
              <p className="text-gray-600 mb-4">
                AST (Abstract Syntax Tree) analysis parses your code into a tree
                structure and inspects it for vulnerability patterns. Our
                MCP-specific analysis focuses on tool definitions and agent
                implementations.
              </p>
              <div
                className="bg-white rounded-lg p-4 space-y-3"
                style={{ border: `1px solid rgba(217,119,87,0.2)` }}
              >
                <div>
                  <h3 className="font-bold mb-3" style={{ color: BRAND }}>
                    What We Check:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                    <li>Tool definition structure and arguments</li>
                    <li>Resource declaration safety</li>
                    <li>Input validation patterns</li>
                    <li>Dangerous function calls</li>
                    <li>Hardcoded secrets and credentials</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="mcp-patterns" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                MCP-Specific Patterns
              </h2>
              <p className="text-gray-600 mb-4">
                We analyze the following MCP patterns for security risks:
              </p>
              <div className="space-y-3">
                <div
                  className="rounded p-4"
                  style={{
                    backgroundColor: "rgba(217,119,87,0.03)",
                    border: `1px solid rgba(217,119,87,0.2)`,
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    Tool Implementation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Checks for unsafe operations in tool handler functions
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
                    Argument Handling
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Validates argument parsing and sanitization
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
                    Resource Access
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Verifies proper resource permission checking
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
                    Error Handling
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ensures information leakage is prevented
                  </p>
                </div>
              </div>
            </section>

            <section id="common-issues" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Common Issues Found
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-3 mb-4">
                <li>
                  <strong>Command Injection:</strong> Subprocess calls without
                  input validation
                </li>
                <li>
                  <strong>Unsafe Deserialization:</strong> Using pickle on
                  untrusted data
                </li>
                <li>
                  <strong>Hardcoded Secrets:</strong> API keys and passwords in
                  code
                </li>
                <li>
                  <strong>File Operations:</strong> Path traversal
                  vulnerabilities
                </li>
                <li>
                  <strong>Network Requests:</strong> Unsafe HTTP operations
                </li>
              </ul>
            </section>

            <section id="best-practices" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                MCP Security Best Practices
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h3 className="font-bold text-blue-900 mb-2">✓ Do:</h3>
                  <ul className="list-disc list-inside text-blue-900 space-y-1 text-sm">
                    <li>Validate all tool inputs thoroughly</li>
                    <li>Use environment variables for secrets</li>
                    <li>Implement proper error handling</li>
                    <li>Log security-relevant events</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h3 className="font-bold text-red-900 mb-2">✗ Don&apos;t:</h3>
                  <ul className="list-disc list-inside text-red-900 space-y-1 text-sm">
                    <li>Trust user input without validation</li>
                    <li>Use subprocess with user-controlled input</li>
                    <li>Store credentials in code</li>
                    <li>Expose internal error messages</li>
                  </ul>
                </div>
              </div>
            </section>
          </article>
        </Box>
      </Box>
    </Box>
  );
}
