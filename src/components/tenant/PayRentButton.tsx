"use client";

import { useState, useTransition } from "react";
import { initiateRentPayment } from "@/app/tenant/payment-actions";

type PayRentButtonProps = {
  paymentId: string;
  amountNgn: number;
};

export function PayRentButton({ paymentId, amountNgn }: PayRentButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handlePay() {
    setError(null);
    startTransition(async () => {
      const result = await initiateRentPayment(paymentId);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={handlePay}
        className="rounded-full bg-adab-gold-500 px-4 py-2 text-xs font-semibold text-adab-navy-900 hover:bg-adab-gold-400 disabled:opacity-50"
      >
        {pending
          ? "Starting checkout…"
          : `Pay ₦${amountNgn.toLocaleString("en-NG")}`}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
