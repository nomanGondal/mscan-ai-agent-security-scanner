"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  Loader2,
  Zap,
  Building2,
  Tag,
} from "lucide-react";

const BRAND = "#D97757";

const plans = {
  pro: {
    name: "Pro Plan",
    monthlyPrice: 99,
    yearlyPrice: 990,
    Icon: Zap,
    features: [
      "Unlimited scans",
      "Advanced analysis",
      "API access",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise Plan",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    Icon: Building2,
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom rules",
      "On-premise option",
    ],
  },
};

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [cardInfo, setCardInfo] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const price =
    billingCycle === "monthly"
      ? currentPlan.monthlyPrice
      : currentPlan.yearlyPrice;
  const discount = billingCycle === "yearly" ? Math.round(price * 0.1) : 0;
  const total = price - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const response = await fetch("/api/account/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, billingCycle }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          payload?.error || "Payment processed but account upgrade failed",
        );
      }
      setOrderComplete(true);
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Unable to complete payment",
      );
    } finally {
      setProcessing(false);
    }
  };

  // ── Success State ──
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-6"
              style={{ backgroundColor: "rgba(217,119,87,0.1)" }}
            >
              <CheckCircle2 className="h-8 w-8" style={{ color: BRAND }} />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Payment Successful
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Your subscription to{" "}
              <span className="font-semibold text-black">
                {currentPlan.name}
              </span>{" "}
              has been activated.
            </p>

            {/* Order summary */}
            <div
              className="rounded-xl border p-5 mb-8 text-left"
              style={{
                borderColor: "rgba(217,119,87,0.2)",
                backgroundColor: "rgba(217,119,87,0.03)",
              }}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Order Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Plan</span>
                  <span className="font-semibold text-black">
                    {currentPlan.name}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Billing</span>
                  <span className="font-semibold text-black">
                    {billingCycle === "monthly" ? "Monthly" : "Yearly"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 font-bold text-black">
                  <span>Total</span>
                  <span style={{ color: BRAND }}>${total}</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 text-left">
              You now have access to
            </p>
            <ul className="space-y-2 mb-8">
              {currentPlan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-gray-700"
                >
                  <div
                    className="flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0"
                    style={{ backgroundColor: "rgba(217,119,87,0.1)" }}
                  >
                    <Check className="h-2.5 w-2.5" style={{ color: BRAND }} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/user/user-dashboard"
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white text-center transition hover:opacity-90"
                style={{ backgroundColor: BRAND }}
              >
                Go to Dashboard
              </a>
              <Link
                href="/pricing"
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-black text-center border border-gray-200 hover:bg-gray-50 transition"
              >
                Back to Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form ──
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ borderColor: BRAND, color: BRAND }}
          >
            <CreditCard className="h-3 w-3" />
            Checkout
          </div>
          <h1 className="text-3xl font-bold text-black">
            Upgrade Your Account
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Complete your payment to unlock unlimited scans and premium
            features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
          {/* ── Left: Order Summary ── */}
          <div className="space-y-4">
            {/* Plan selector */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Select Plan
              </p>
              <div className="space-y-2.5">
                {Object.entries(plans).map(([key, plan]) => {
                  const isSelected = selectedPlan === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className="w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all"
                      style={{
                        borderColor: isSelected ? BRAND : "#e5e7eb",
                        backgroundColor: isSelected
                          ? "rgba(217,119,87,0.04)"
                          : "white",
                      }}
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: isSelected
                            ? BRAND
                            : "rgba(217,119,87,0.08)",
                        }}
                      >
                        <plan.Icon
                          className="h-4 w-4"
                          style={{ color: isSelected ? "white" : BRAND }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black">
                          {plan.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ${plan.monthlyPrice}/mo
                        </p>
                      </div>
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: isSelected ? BRAND : "#d1d5db" }}
                      >
                        {isSelected && (
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: BRAND }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Billing cycle */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Billing Cycle
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    value: "monthly",
                    label: "Monthly",
                    sub: `$${currentPlan.monthlyPrice}/month`,
                  },
                  {
                    value: "yearly",
                    label: "Yearly",
                    sub: `$${currentPlan.yearlyPrice}/year · Save 10%`,
                  },
                ].map(({ value, label, sub }) => {
                  const isSelected = billingCycle === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setBillingCycle(value)}
                      className="w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all"
                      style={{
                        borderColor: isSelected ? BRAND : "#e5e7eb",
                        backgroundColor: isSelected
                          ? "rgba(217,119,87,0.04)"
                          : "white",
                      }}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">
                          {label}
                        </p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                      {value === "yearly" && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: "rgba(217,119,87,0.1)",
                            color: BRAND,
                          }}
                        >
                          <Tag className="h-2.5 w-2.5 inline mr-1" />
                          10% off
                        </span>
                      )}
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: isSelected ? BRAND : "#d1d5db" }}
                      >
                        {isSelected && (
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: BRAND }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Price Breakdown
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">${price}</span>
                </div>
                {discount > 0 && (
                  <div
                    className="flex justify-between"
                    style={{ color: "#15803d" }}
                  >
                    <span>Yearly discount</span>
                    <span className="font-medium">−${discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-100 font-bold text-black">
                  <span>Total</span>
                  <span className="text-lg" style={{ color: BRAND }}>
                    ${total}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-center pt-1">
                  Billed {billingCycle === "monthly" ? "monthly" : "annually"}
                </p>
              </div>
            </div>

            {/* Features */}
            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: "rgba(217,119,87,0.2)",
                backgroundColor: "rgba(217,119,87,0.03)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: BRAND }}
              >
                Included in {currentPlan.name}
              </p>
              <ul className="space-y-2">
                {currentPlan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-700"
                  >
                    <div
                      className="flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0"
                      style={{ backgroundColor: "rgba(217,119,87,0.15)" }}
                    >
                      <Check className="h-2.5 w-2.5" style={{ color: BRAND }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: Payment Form ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 h-fit">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Info */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Billing Information
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardInfo.name}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#D97757] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={cardInfo.email}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#D97757] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Payment Info */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Payment Information
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardInfo.cardNumber}
                        onChange={(e) =>
                          setCardInfo({
                            ...cardInfo,
                            cardNumber: e.target.value
                              .replaceAll(" ", "")
                              .slice(0, 16),
                          })
                        }
                        maxLength={19}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-700 outline-none transition focus:border-[#D97757] focus:bg-white font-mono"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Test: 4242 4242 4242 4242
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={(e) =>
                          setCardInfo({
                            ...cardInfo,
                            expiryDate: e.target.value.slice(0, 5),
                          })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#D97757] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-1.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={(e) =>
                          setCardInfo({
                            ...cardInfo,
                            cvv: e.target.value.slice(0, 4),
                          })
                        }
                        maxLength={4}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#D97757] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 accent-[#D97757]"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-semibold text-black hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-semibold text-black hover:underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: BRAND }}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay ${total}{" "}
                    {billingCycle === "yearly" ? "/ year" : "/ month"}
                  </>
                )}
              </button>

              {paymentError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-xs text-red-600 text-center">
                    {paymentError}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2">
                <Lock className="h-3 w-3 text-gray-400" />
                <p className="text-xs text-gray-400">
                  Secured and processed by Stripe
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
