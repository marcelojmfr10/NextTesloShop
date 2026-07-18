"use server";

import { prisma } from "@/app/lib/prisma";
// import { sleep } from "@/app/utils";

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const stock = await prisma.product.findFirst({
      select: { inStock: true },
      where: {
        slug: slug,
      },
    });

    return stock?.inStock ?? 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
