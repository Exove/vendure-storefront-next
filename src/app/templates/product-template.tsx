"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import Heading from "@/components/heading";
import ImageGallery from "@/components/image-gallery";
import SelectVariant from "@/components/select-variant";
import { Product } from "@/gql/graphql";
import { createContext, useState } from "react";

export const CartContext = createContext<{
  cartQuantity: number;
  setCartQuantity: (quantity: number) => void;
}>({ cartQuantity: 0, setCartQuantity: () => {} });

interface ProductTemplateProps {
  product: Product;
}

export default function ProductTemplate({ product }: ProductTemplateProps) {
  const [cartQuantity, setCartQuantity] = useState(0);

  return (
    <CartContext.Provider value={{ cartQuantity, setCartQuantity }}>
      <Container>
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-20">
          <ImageGallery images={product.assets} />
          <div className="flex flex-col gap-10">
            <div>
              <Heading level="h1" size="xl">
                {product.name}
              </Heading>
              <p className="text-lg">{product.description}</p>
            </div>
            <SelectVariant variants={product.variants} />
          </div>
        </div>
      </Container>
    </CartContext.Provider>
  );
}
