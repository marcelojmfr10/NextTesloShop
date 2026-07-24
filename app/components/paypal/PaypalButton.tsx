"use client";

import { useRouter } from "next/navigation";
import {
  INSTANCE_LOADING_STATE,
  OnApproveDataOneTimePayments,
  PayPalOneTimePaymentButton,
  usePayPal,
} from "@paypal/react-paypal-js/sdk-v6";

interface Props {
  orderId: string;
}

export const PaypalButton = ({ orderId }: Props) => {
  const { loadingStatus, error } = usePayPal();
  const router = useRouter();

  if (loadingStatus === INSTANCE_LOADING_STATE.PENDING) {
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 bg-gray-300 rounded"></div>
        <div className="h-11 bg-gray-300 rounded mt-2"></div>
      </div>
    );
  }

  //   if (loadingStatus === INSTANCE_LOADING_STATE.REJECTED) {
  //     return (
  //       <div className="error">Failed to load PayPal SDK: {error?.message}</div>
  //     );
  //   }

  return (
    <PayPalOneTimePaymentButton
      createOrder={async () => {
        const response = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const { orderId: paypalOrderId } = await response.json();
        return { orderId: paypalOrderId };
      }}
      onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
        await fetch(`/api/capture-order/${orderId}`, {
          method: "POST",
        });
        router.refresh();
      }}
    />
  );
};
