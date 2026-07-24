"use client";

import {
  INSTANCE_LOADING_STATE,
  OnApproveDataOneTimePayments,
  PayPalOneTimePaymentButton,
  usePayPal,
} from "@paypal/react-paypal-js/sdk-v6";

export const PaypalButton = () => {
  const { loadingStatus, error } = usePayPal();

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

  const createOrder = async () => {
    const response = await fetch("/api/create-order", {
      method: "POST",
    });
    const { orderId } = await response.json();
    return { orderId };
  };

  return (
    <PayPalOneTimePaymentButton
      createOrder={createOrder}
      onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
        await fetch(`/api/capture-order/${orderId}`, {
          method: "POST",
        });
        console.log("Payment captured!");
      }}
    />
  );
};
