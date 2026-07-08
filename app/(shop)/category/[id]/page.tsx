import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

interface Props {
  params: Params;
}

export default async function Home({ params }: Props) {
  const { id } = await params;

  if (id === "kids") {
    notFound();
  }

  return (
    <div>
      <h1>category page Page</h1>
    </div>
  );
}
