"use client";

import { startTransition, useState } from "react";

type BillingActionButtonProps = {
  endpoint: "/api/checkout" | "/api/customer-portal";
  label: string;
  pendingLabel: string;
  className?: string;
};

export function BillingActionButton({
  endpoint,
  label,
  pendingLabel,
  className,
}: BillingActionButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function handleClick() {
    setError("");
    setPending(true);

    startTransition(() => {
      void fetch(endpoint, { method: "POST" })
        .then(async (response) => {
          const payload = (await response.json()) as { error?: string; url?: string };

          if (!response.ok || !payload.url) {
            throw new Error(payload.error || "Unable to continue to billing");
          }

          window.location.href = payload.url;
        })
        .catch((cause: unknown) => {
          setError(cause instanceof Error ? cause.message : "Unable to continue to billing");
          setPending(false);
        });
    });
  }

  return (
    <div className="space-y-2">
      <button
        className={className}
        disabled={pending}
        onClick={handleClick}
        type="button"
      >
        {pending ? pendingLabel : label}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
