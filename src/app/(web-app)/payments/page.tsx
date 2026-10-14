"use client";

import { Box } from "@radix-ui/themes";

export default function PaymentsPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      description: "Perfect for getting started",
      features: [
        "3 scans per month",
        "Basic analysis (AST, Pyre, Pysa)",
        "Community support",
        "Email reports",
        "7 days scan history",
      ],
      cta: "Current Plan",
      highlighted: false,
      active: true,
    },
    {
      name: "Pro",
      price: "$99",
      period: "per month",
      description: "For professional developers",
      features: [
        "Unlimited scans",
        "Advanced analysis features",
        "Priority email support",
        "API access",
        "Unlimited scan history",
        "Custom integration support",
        "Monthly report generation",
        "Slack notifications",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
      active: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom analysis rules",
        "SLA guarantees",
        "On-premise deployment",
        "Team collaboration features",
        "Advanced reporting",
        "Training & onboarding",
      ],
      cta: "Contact Sales",
      highlighted: false,
      active: false,
    },
  ];

  return (
    <Box>
      <Box className="w-full px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your security scanning needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-8 transition ${
                plan.highlighted
                  ? "border-black bg-black text-white shadow-lg transform scale-105"
                  : "border-gray-300 bg-white"
              }`}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {plan.active && (
                <div className="mb-4">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      plan.highlighted
                        ? "bg-white text-black"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    Current Plan
                  </span>
                </div>
              )}

              <h3
                className={`text-3xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-black"}`}
              >
                {plan.name}
              </h3>
              <div className="mb-6">
                <span
                  className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-black"}`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-2 ${plan.highlighted ? "text-gray-300" : "text-gray-600"}`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`mb-8 ${plan.highlighted ? "text-gray-300" : "text-gray-600"}`}
              >
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`font-bold text-lg ${plan.highlighted ? "text-white" : "text-black"}`}
                    >
                      ✓
                    </span>
                    <span
                      className={
                        plan.highlighted ? "text-gray-200" : "text-gray-700"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 font-semibold rounded-lg transition ${
                  plan.highlighted
                    ? "bg-white text-black hover:bg-gray-200"
                    : plan.active
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                }`}
                disabled={plan.active}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-black mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-black mb-2">
                What happens to my data if I downgrade?
              </h3>
              <p className="text-gray-600">
                Your scan history and data remain intact. On the Free plan,
                you'll only keep the last 7 days of scans.
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-black mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for Pro and Enterprise
                plans. No questions asked.
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-black mb-2">
                Is there a contract required?
              </h3>
              <p className="text-gray-600">
                No, Pro plans are month-to-month. Enterprise customers can
                discuss flexible terms with our sales team.
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-black mb-2">
                Do you offer discounts for annual billing?
              </h3>
              <p className="text-gray-600">
                Yes! Save 20% when you pay annually. Contact our sales team for
                more information.
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-black mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American
                Express) via Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border-2 border-black rounded-lg p-12 text-center mt-16">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Upgrade your account and get unlimited scans, API access, and
            premium support.
          </p>
          <button className="px-12 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition text-lg">
            Upgrade Now
          </button>
          <p className="text-gray-600 text-sm mt-4">
            Or contact our sales team at sales@example.com
          </p>
        </div>
      </Box>
    </Box>
  );
}
