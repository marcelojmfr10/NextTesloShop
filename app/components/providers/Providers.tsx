"use client";

import { SessionProvider } from "next-auth/react";
import {
  PayPalProvider,
  PayPalOneTimePaymentButton,
} from "@paypal/react-paypal-js/sdk-v6";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return (
    <PayPalProvider
      clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? ""}
      environment="sandbox"
      components={["paypal-payments", "paypal-guest-payments"]}
    >
      <SessionProvider>{children}</SessionProvider>;
    </PayPalProvider>
  );
};
