"use client";

import Link from "next/link";
import { Check, Zap, Shield, Building2 } from "lucide-react";

const BRAND = "#D97757";
const DARK = "#1F1F1E";

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
    Icon: Shield,
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
    href: "/checkout",
    Icon: Zap,
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
    Icon: Building2,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ borderColor: BRAND, color: BRAND }}
          >
            Pricing
          </div>
          <h1 className="text-4xl font-bold text-black">
            Simple, transparent pricing
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-lg">
            Choose a plan that fits your scan volume and support needs. No
            hidden fees.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl bg-white flex flex-col"
              style={{
                border: plan.highlight
                  ? `2px solid ${BRAND}`
                  : "1px solid #e5e7eb",
              }}
            >
              {/* Recommended badge */}
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: BRAND }}
                  >
                    Recommended
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Plan icon + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: plan.highlight
                        ? BRAND
                        : "rgba(217,119,87,0.08)",
                    }}
                  >
                    <plan.Icon
                      className="h-4 w-4"
                      style={{ color: plan.highlight ? "white" : BRAND }}
                    />
                  </div>
                  <h2 className="text-lg font-bold text-black">{plan.name}</h2>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-bold text-black">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-xs text-gray-400 font-medium">
                    {plan.period}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-6">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-gray-700"
                    >
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0"
                        style={{ backgroundColor: "rgba(217,119,87,0.1)" }}
                      >
                        <Check
                          className="h-2.5 w-2.5"
                          style={{ color: BRAND }}
                        />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.href ? (
                  <Link
                    href={plan.href}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
                    style={
                      plan.highlight
                        ? { backgroundColor: BRAND, color: "white" }
                        : {
                            border: `1px solid ${BRAND}`,
                            color: BRAND,
                            backgroundColor: "transparent",
                          }
                    }
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div
          className="rounded-2xl border p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            borderColor: "rgba(217,119,87,0.2)",
            backgroundColor: "rgba(217,119,87,0.03)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4" style={{ color: BRAND }} />
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: BRAND }}
              >
                Enterprise
              </p>
            </div>
            <h2 className="text-xl font-bold text-black mb-1">
              Need a custom setup?
            </h2>
            <p className="text-sm text-gray-500 max-w-md">
              Enterprise plans tailored to your workflow, compliance needs, and
              team size.
            </p>
          </div>
          <Link
            href="/checkout"
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: DARK }}
          >
            Continue to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
