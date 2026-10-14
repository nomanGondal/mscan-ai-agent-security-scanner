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

export default function PyreTestingPage() {
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
              Pyre Type Checking
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Comprehensive guide to Pyre static type analysis used in our
              scanning platform.
            </p>

            <section id="overview" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                What is Pyre?
              </h2>
              <p className="text-gray-600 mb-4">
                Pyre is a static type checker for Python developed by Meta. It
                performs fast type analysis to catch type-related errors before
                runtime.
              </p>
              <div
                className="bg-white rounded-lg p-4 space-y-3"
                style={{ border: `1px solid rgba(217,119,87,0.2)` }}
              >
                <div>
                  <h3 className="font-bold mb-3" style={{ color: BRAND }}>
                    Key Features:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                    <li>Fast incremental type checking</li>
                    <li>Precise type inference</li>
                    <li>Custom type configuration support</li>
                    <li>Integration with IDEs and editors</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="how-it-works" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                How Pyre Works in Our Scanner
              </h2>
              <p className="text-gray-600 mb-4">
                Our scanner uses Pyre to analyze your Python code and identify
                type-related vulnerabilities:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-3 mb-4">
                <li>Parses Python source files</li>
                <li>Builds type inference model</li>
                <li>Checks type consistency</li>
                <li>Reports undefined attributes and imports</li>
                <li>Identifies type mismatches</li>
              </ol>
            </section>

            <section id="issues" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Common Issues Detected
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
                    Undefined Imports
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Missing or incorrect module imports detected
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
                    Undefined Attributes
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Accessing attributes that don't exist on objects
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
                    Type Mismatches
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Assigning or using wrong types in operations
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
                    Incompatible Operations
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Using operations not supported by type
                  </p>
                </div>
              </div>
            </section>

            <section id="tips" className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Tips for Better Results
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-3 mb-4">
                <li>
                  <strong>Add Type Hints:</strong> Use Python type annotations
                  for better analysis
                </li>
                <li>
                  <strong>Configure Stubs:</strong> Provide type stub files for
                  third-party libraries
                </li>
                <li>
                  <strong>Check Python Version:</strong> Ensure your code
                  targets the correct Python version
                </li>
                <li>
                  <strong>Review Warnings:</strong> Address even low-severity
                  type warnings
                </li>
              </ul>
            </section>
          </article>
        </Box>
      </Box>
    </Box>
  );
}
