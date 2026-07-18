"use client";

import { SizeSelector, QuantitySelector } from "@/app/components";
import { CartProduct, Product, Size } from "@/app/interfaces";
import { useCartStore } from "@/app/store";
import { useState } from "react";

interface Props {
  product: Product;
}

export const AddtoCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };
    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una talla*
        </span>
      )}

      {/* selector de tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />

      {/* selector de cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      <button className="btn-primary my-5" onClick={addToCart}>
        Agregar al carrito
      </button>
    </>
  );
};
