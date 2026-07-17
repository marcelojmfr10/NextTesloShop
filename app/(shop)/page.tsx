import { redirect } from "next/navigation";
import { getPaginatedProductsWithImages } from "../actions";
import { Pagination, ProductGrid, Title } from "../components";

type Params = Promise<{ page?: string }>;
interface Props {
  searchParams: Params;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({
      page,
    });

  if (products.length === 0) {
    redirect("/");
  }

  return (
    <>
      <Title
        title="Tienda"
        subTitle="Todos los productos"
        className="mb-2"
      ></Title>

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
