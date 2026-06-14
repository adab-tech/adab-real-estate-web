"use client";

import { useState, useTransition } from "react";
import {
  initiateRentPayment,
  type RentPaymentProvider,
} from "@/app/tenant/payment-actions";

type PayRentButtonProps = {
  paymentId: string;
  amountNgn: number;
  providers: RentPaymentProvider[];
};

const PROVIDER_LABELS: Record<RentPaymentProvider, string> = {
  paystack: "Paystack",
  opay: "OPay",
};

export function PayRentButton({
  paymentId,
  amountNgn,
  providers,
}: PayRentButtonProps) {
  const [pending, startTransition] = useTransition();
  const [activeProvider, setActiveProvider] = useState<RentPaymentProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  function handlePay(provider: RentPaymentProvider) {
    setError(null);
    setActiveProvider(provider);
    startTransition(async () => {
      const result = await initiateRentPayment(paymentId, provider);
      if (result.error) {
        setError(result.error);
        setActiveProvider(null);
        return;
      }
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    });
  }

  const amountLabel = `₦${amountNgn.toLocaleString("en-NG")}`;

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-2">
        {providers.map((provider) => (
          <button
            key={provider}
            type="button"
            disabled={pending}
            onClick={() => handlePay(provider)}
            className="rounded-full bg-adab-gold-500 px-4 py-2 text-xs font-semibold text-adab-navy-900 hover:bg-adab-gold-400 disabled:opacity-50"
          >
            {pending && activeProvider === provider
              ? "Starting checkout…"
              : providers.length === 1
                ? `Pay ${amountLabel}`
                : `${PROVIDER_LABELS[provider]} · ${amountLabel}`}
          </button>
        ))}
      </div>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
