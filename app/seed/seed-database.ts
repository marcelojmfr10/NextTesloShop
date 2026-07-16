import { initialData } from "./seed.ts";
import { prisma } from "../lib/prisma.ts";

async function main() {
  // await Promise.all([
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // ]);

  const { categories, products } = initialData;
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
