"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import Heading from "@/components/heading";
import ImageGallery from "@/components/image-gallery";
import { Product } from "@/gql/graphql";
import { createContext, useState } from "react";
import { formatCurrency } from "@/common/utils";
import AddToCartOptions from "@/components/add-to-cart-options";

export const CartContext = createContext<{
  cartQuantity: number;
  setCartQuantity: (quantity: number) => void;
}>({ cartQuantity: 0, setCartQuantity: () => {} });

interface ProductTemplateProps {
  product: Product;
}

export default function ProductTemplate({ product }: ProductTemplateProps) {
  const [cartQuantity, setCartQuantity] = useState(0);

  const allVariantsHaveSamePrice = product.variants.every(
    (variant) => variant.price === product.variants[0].price,
  );

  return (
    <CartContext.Provider value={{ cartQuantity, setCartQuantity }}>
      <Container>
        <Header />
        <div className="mt-20 grid grid-cols-1 gap-20 md:grid-cols-2">
          <ImageGallery images={product.assets} />
          <div className="flex flex-col gap-8">
            <div>
              <Heading level="h1" size="xl">
                {product.name}
              </Heading>
              <p className="text-lg">{product.description}</p>
              {(allVariantsHaveSamePrice || product.variants.length === 1) && (
                <p className="mt-4 text-2xl font-semibold text-blue-400">
                  {formatCurrency(product.variants[0].price)}
                </p>
              )}
            </div>
            <AddToCartOptions
              variants={product.variants}
              displayPrice={!allVariantsHaveSamePrice}
            />
          </div>
        </div>
      </Container>
    </CartContext.Provider>
  );
}
