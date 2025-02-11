"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import Heading from "@/components/heading";
import ImageGallery from "@/components/image-gallery";
import { Product } from "@/gql/graphql";
import { createContext, useState } from "react";
import AddToCartOptions from "@/components/add-to-cart-options";
import { formatCurrency } from "@/common/utils";
import { useLocale } from "next-intl";
import { MenuItem } from "@/common/get-menu-items";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const CartContext = createContext<{
  cartQuantity: number;
  setCartQuantity: (quantity: number) => void;
}>({ cartQuantity: 0, setCartQuantity: () => {} });

interface ProductTemplateProps {
  product: Product;
  menuItems: MenuItem[];
  breadcrumbItems: { label: string; href: string }[];
}

export default function ProductTemplate({
  product,
  menuItems,
  breadcrumbItems,
}: ProductTemplateProps) {
  const [cartQuantity, setCartQuantity] = useState(0);
  const locale = useLocale();

  const allVariantsHaveSamePrice = product.variants.every(
    (variant) => variant.price === product.variants[0].price,
  );

  return (
    <CartContext.Provider value={{ cartQuantity, setCartQuantity }}>
      <Container>
        <Header menuItems={menuItems} />
        <div className="mx-auto mt-10 max-w-screen-xl">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-5 grid grid-cols-1 gap-20 md:grid-cols-2">
            <ImageGallery images={product.assets} />
            <div className="flex flex-col gap-8">
              <div>
                <Heading level="h1" size="xl" className="mb-4">
                  {product.name}
                </Heading>
                {allVariantsHaveSamePrice && (
                  <div className="mb-10 text-xl text-blue-400">
                    {formatCurrency(product.variants[0].priceWithTax, locale)}
                  </div>
                )}
                <div
                  className="prose prose-invert text-white"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
              <AddToCartOptions
                variants={product.variants}
                displayPrice={!allVariantsHaveSamePrice}
              />
            </div>
          </div>
        </div>
      </Container>
    </CartContext.Provider>
  );
}
