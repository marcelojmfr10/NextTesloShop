import { Title, ProductGrid } from "@/app/components";
import { Category } from "@/app/interfaces";
import { initialData } from "@/app/seed/seed";
import { notFound } from "next/navigation";

const seedProducts = initialData.products;

type Params = Promise<{ id: Category }>;

interface Props {
  params: Params;
}

export default async function Home({ params }: Props) {
  const { id } = await params;
  const products = seedProducts.filter((product) => product.gender === id);

  const labels: Record<Category, string> = {
    men: "para Hombres",
    women: "para Mujeres",
    kid: "para Niños",
    unisex: "para todos",
  };

  // if (id === "kids") {
  //   notFound();
  // }

  return (
    <>
      <Title
        title={`Artículos de ${labels[id]}`}
        subTitle="Todos los productos"
        className="mb-2"
      ></Title>

      <ProductGrid products={products} />
    </>
  );
}
