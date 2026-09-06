"use client";

import { useState } from "react";

export function CheckoutButton({
  workshopId,
  price,
  disabled = false,
}: {
  workshopId: string;
  price: number;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || disabled}
      className="w-full rounded-lg bg-primary-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-500 dark:hover:bg-primary-600"
    >
      {loading
        ? "Redirecting to payment..."
        : `Pay ₹${(price / 100).toLocaleString("en-IN")} — Secure Your Spot`}
    </button>
  );
}
