import { initialData } from "./seed.ts";
import { prisma } from "../lib/prisma.ts";
import { countries } from "./seed-countries.ts";

async function main() {
  // await Promise.all([
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // ]);

  const { categories, products, users } = initialData;

  await prisma.user.createMany({ data: users });

  await prisma.country.createMany({ data: countries });

  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>,
  );

  products.forEach(async (product) => {
    const { type, images, ...rest } = product;
    const categoryId = categoriesMap[type];
    if (!categoryId) throw new Error(`Categoria no encontrada: ${type}`);

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId,
      },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log("seed ejecutado");
}

(() => {
  main();
})();
