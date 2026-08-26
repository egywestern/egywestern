"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutCompleteContent() {
  const params = useSearchParams();
  const success = params.get("success") === "true";
  return (
    <div className="page narrow" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div className="page-title">
        <small>CHECKOUT</small>
        <h1>{success ? "PAYMENT RECEIVED" : "PAYMENT FAILED"}</h1>
      </div>
      <p>
        {success
          ? "We're confirming your payment now — you'll receive a confirmation shortly."
          : "Your payment could not be completed. Please try again or choose cash on delivery."}
      </p>
      <a className="add" href="/" style={{ display: "inline-block", marginTop: 24 }}>
        BACK TO WESTERN
      </a>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCompleteContent />
    </Suspense>
  );
}
