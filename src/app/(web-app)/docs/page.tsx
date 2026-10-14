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

export default function DocsPage() {
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
              MCP Taint Analyzer Documentation
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Comprehensive guide to using the MCP Taint Analyzer for secure AI
              agent development.
            </p>

            <section id="overview" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">Overview</h2>
              <p className="text-gray-600 mb-4">
                The MCP Taint Analyzer is a professional-grade security scanning
                tool designed specifically for MCP (Model Context Protocol)
                agents. It combines multiple static analysis techniques to
                identify vulnerabilities in your code:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>
                  <strong>MCP AST Analysis:</strong> Deep inspection of tool
                  definitions and implementations
                </li>
                <li>
                  <strong>Pyre Type Checking:</strong> Static type analysis for
                  type-safety vulnerabilities
                </li>
                <li>
                  <strong>Pysa Taint Analysis:</strong> Data flow analysis for
                  security risks
                </li>
              </ul>
            </section>

            <section id="installation" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Installation
              </h2>
              <p className="text-gray-600 mb-4">
                To get started, create an account and navigate to the Scanner
                page:
              </p>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 font-mono text-sm text-gray-900 overflow-x-auto mb-4">
                <code>
                  1. Sign up at our platform
                  <br />
                  2. Navigate to the Scanner page
                  <br />
                  3. Upload your MCP code (ZIP or Python files)
                  <br />
                  4. Review the analysis results
                </code>
              </div>
            </section>

            <section id="quick-start" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Quick Start
              </h2>
              <ol className="list-decimal list-inside text-gray-600 space-y-3 mb-4">
                <li>Create your account on our platform</li>
                <li>Go to the Scanner page from the header navigation</li>
                <li>Upload your MCP agent code (ZIP file recommended)</li>
                <li>
                  Click &quot;Start Scan&quot; and wait for analysis to complete
                </li>
                <li>Review the detailed report with issue breakdown</li>
                <li>Upgrade to Pro for unlimited scans and API access</li>
              </ol>
              <p
                className="text-gray-600 rounded p-4"
                style={{
                  backgroundColor: "rgba(217,119,87,0.03)",
                  border: `1px solid rgba(217,119,87,0.2)`,
                }}
              >
                <strong>Free Tier:</strong> 3 scans per month • Pro Tier:
                Unlimited scans + API access
              </p>
            </section>

            <section id="best-practices" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Best Practices
              </h2>
              <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-black mb-2">
                    Package Your Code
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create a ZIP file with your complete project structure for
                    best results
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">
                    Review All Results
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Check even low-severity issues as they may indicate
                    potential vulnerabilities
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Scan Regularly</h3>
                  <p className="text-gray-600 text-sm">
                    Run scans frequently during development to catch issues
                    early
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">
                    Review Documentation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Check the Analysis Tools section for detailed information on
                    each scanner
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-lg p-6 mt-12"
              style={{
                backgroundColor: "rgba(217,119,87,0.03)",
                border: `1px solid rgba(217,119,87,0.2)`,
              }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND }}>
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you encounter any issues or have questions about using the
                MCP Taint Analyzer, please reach out to our support team at
                support@example.com
              </p>
            </section>
          </article>
        </Box>
      </Box>
    </Box>
  );
}
