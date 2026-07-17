import { getPaginatedProductsWithImages } from "@/app/actions";
import { Title, ProductGrid, Pagination } from "@/app/components";
import { Gender } from "@/app/generated/prisma/enums";
import { redirect } from "next/navigation";

type Params = Promise<{ gender: string }>;
type SearchParams = Promise<{ page?: string }>;

interface Props {
  params: Params;
  searchParams: SearchParams;
}

export default async function Home({ params, searchParams }: Props) {
  const { gender } = await params;

  const paramsSe = await searchParams;
  const page = paramsSe.page ? Number(paramsSe.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({
      page,
      gender: gender as Gender,
    });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
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
        title={`Artículos de ${labels[gender]}`}
        subTitle="Todos los productos"
        className="mb-2"
      ></Title>

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
