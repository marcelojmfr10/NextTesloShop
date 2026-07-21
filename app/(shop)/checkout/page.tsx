import Link from "next/link";
import { Title } from "@/app/components";
import { ProductsInCart } from "./(checkout)/ui/ProductsInCart";
import { PlaceOrder } from "./(checkout)/ui/PlaceOrder";

export default function Home() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-250">
        <Title title="Verificar orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            <ProductsInCart />
          </div>

          {/* checkout */}
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
}
