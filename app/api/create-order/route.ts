import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";
import { getPaypalOauthToken, PAYPAL_API_URL } from "@/app/lib/paypal";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "Debe de estar autenticado" },
      { status: 401 },
    );
  }

  const { orderId } = await request.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json({ message: "Orden no existe" }, { status: 404 });
  }

  if (session.user.role === "user" && session.user.id !== order.userId) {
    return NextResponse.json(
      { message: "Orden no es de este usuario" },
      { status: 401 },
    );
  }

  if (order.isPaid) {
    return NextResponse.json(
      { message: "Orden ya fue pagada" },
      { status: 400 },
    );
  }

  const accessToken = await getPaypalOauthToken();

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: order.id,
          amount: {
            currency_code: "USD",
            value: order.total.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(error);
    return NextResponse.json(
      { message: "Error al crear la orden en PayPal" },
      { status: 400 },
    );
  }

  const data = await response.json();

  return NextResponse.json({ orderId: data.id });
}
