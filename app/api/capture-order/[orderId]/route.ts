import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";
import { getPaypalOauthToken, PAYPAL_API_URL } from "@/app/lib/paypal";

type Params = Promise<{ orderId: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "Debe de estar autenticado" },
      { status: 401 },
    );
  }

  const { orderId: paypalOrderId } = await params;

  const accessToken = await getPaypalOauthToken();

  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.log(error);
    return NextResponse.json(
      { message: "Error al capturar el pago" },
      { status: 400 },
    );
  }

  const data = await response.json();

  if (data.status !== "COMPLETED") {
    return NextResponse.json(
      { message: "El pago no se completó" },
      { status: 400 },
    );
  }

  const purchaseUnit = data.purchase_units[0];
  const orderId = purchaseUnit.payments.captures[0].custom_id;
  const transactionId = purchaseUnit.payments.captures[0].id;

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    return NextResponse.json({ message: "Orden no existe" }, { status: 404 });
  }

  if (session.user.role === "user" && session.user.id !== order.userId) {
    return NextResponse.json(
      { message: "Orden no es de este usuario" },
      { status: 401 },
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      transactionId,
    },
  });

  return NextResponse.json({ message: "Pago capturado" });
}
