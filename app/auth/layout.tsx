import { redirect } from "next/navigation";
import { auth } from "../auth";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-87.5 px-10">{children}</div>
    </main>
  );
}
