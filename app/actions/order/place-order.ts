"use server";

import { auth } from "@/app/auth";
import type { Address, Size } from "@/app/interfaces";
import { prisma } from "@/app/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return {
        ok: false,
        message: "No hay sesión de usuario",
      };
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map((p) => p.productId),
        },
      },
    });

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    const { subTotal, tax, total } = productIds.reduce(
      (totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find((p) => p.id === item.productId);

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 },
    );

    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          //   data: { inStock: product.inStock - productQuantity }, no hacer
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // verificar valores negativos en las existencias = no hay stock
      updatedProducts.forEach((p) => {
        if (p.inStock < 0) {
          throw new Error(`${p.title} no tiene inventario suficiente`);
        }
      });

      // 2. crear la orden - encabezado - detalles
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((product) => ({
                quantity: product.quantity,
                size: product.size,
                productId: product.productId,
                price:
                  products.find((p) => p.id === product.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. crear la dirección de la orden
      const { country, ...rest } = address;
      const orderAddress = await tx.orderAddress.create({
        data: { ...rest, countryId: country, orderId: order.id },
      });

      return { order, updatedProducts, orderAddress };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error: any) {
    console.log(error);
    return { ok: false, message: error?.message };
  }
};
