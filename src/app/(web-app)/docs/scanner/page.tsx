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

export default function ScannerDocsPage() {
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
              Scanner Documentation
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Detailed guide to using the MCP Code Scanner for comprehensive
              security analysis.
            </p>

            <section id="how-it-works" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                How It Works
              </h2>
              <p className="text-gray-600 mb-4">
                The scanner processes your code through three integrated
                analysis engines:
              </p>
              <div className="space-y-4 mb-4">
                <div
                  className="bg-white rounded-lg p-4"
                  style={{ border: `1px solid rgba(217,119,87,0.2)` }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    Step 1: MCP AST Analysis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Parses your code and inspects MCP tool definitions, checking
                    for unsafe patterns in tool implementations and arguments
                  </p>
                </div>
                <div
                  className="bg-white rounded-lg p-4"
                  style={{ border: `1px solid rgba(217,119,87,0.2)` }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    Step 2: Pyre Type Checking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Performs static type analysis to identify type-related
                    vulnerabilities and ensure type safety across your codebase
                  </p>
                </div>
                <div
                  className="bg-white rounded-lg p-4"
                  style={{ border: `1px solid rgba(217,119,87,0.2)` }}
                >
                  <h3 className="font-bold mb-2" style={{ color: BRAND }}>
                    Step 3: Pysa Taint Analysis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Tracks data flow through your code to detect taint
                    vulnerabilities and security-sensitive operations
                  </p>
                </div>
              </div>
            </section>

            <section id="formats" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Supported Formats
              </h2>
              <p className="text-gray-600 mb-4">
                The scanner supports multiple input formats:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>
                  <strong>ZIP Files:</strong> Complete project structure
                  (recommended)
                </li>
                <li>
                  <strong>Python Files:</strong> Individual .py files
                </li>
                <li>
                  <strong>Project Folders:</strong> Uploaded as ZIP archives
                </li>
              </ul>
              <p
                className="text-gray-600 rounded p-4"
                style={{
                  backgroundColor: "rgba(217,119,87,0.03)",
                  border: `1px solid rgba(217,119,87,0.2)`,
                }}
              >
                For best results, include all dependencies and configuration
                files in your ZIP upload.
              </p>
            </section>

            <section id="configuration" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Configuration
              </h2>
              <p className="text-gray-600 mb-4">
                The scanner uses default configurations optimized for MCP agent
                analysis. For custom configurations, contact our support team.
              </p>
              <div
                className="rounded-lg p-4 font-mono text-sm text-gray-900 overflow-x-auto"
                style={{
                  backgroundColor: "rgba(217,119,87,0.02)",
                  border: `1px solid rgba(217,119,87,0.1)`,
                }}
              >
                <code>{`# Default Analysis Engines
mcp_ast:
  enabled: true
  analyze_tools: true
  analyze_resources: true

pyre:
  enabled: true
  strict_mode: false

pysa:
  enabled: true
  track_sinks: true
  track_sources: true`}</code>
              </div>
            </section>

            <section id="limitations" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Limitations & Considerations
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Free tier: Limited to 3 scans per month</li>
                <li>Maximum file size: 100 MB per scan</li>
                <li>Average scan duration: 30-60 seconds</li>
                <li>
                  Some dynamic analysis patterns may require manual review
                </li>
              </ul>
            </section>

            <section
              className="rounded-lg p-6 mt-12"
              style={{
                backgroundColor: "rgba(217,119,87,0.03)",
                border: `1px solid rgba(217,119,87,0.2)`,
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND }}>
                Ready to Scan?
              </h3>
              <p className="text-gray-600 mb-4">
                Head over to the Scanner page to analyze your first MCP agent
                project.
              </p>
              <Link
                href="/scanner"
                className="inline-block px-6 py-2 text-white font-semibold rounded transition hover:opacity-90"
                style={{ backgroundColor: BRAND }}
              >
                Go to Scanner
              </Link>
            </section>
          </article>
        </Box>
      </Box>
    </Box>
  );
}
