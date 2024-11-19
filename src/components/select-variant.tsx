"use client";

import { API_URL } from "@/common/constants";
import { addItemToOrderMutation } from "@/common/queries";
import { GraphQLClient } from "graphql-request";
import { useContext, useState } from "react";
import clsx from "clsx";
import QuantitySelector from "./quantity-selector";
import { formatCurrency } from "@/common/utils";
import { CartContext } from "@/app/templates/product-template";
import Button from "./button";
import Heading from "./heading";

interface SelectVariantProps {
  variants: {
    id: string;
    name: string;
    price: number;
  }[];
  quantity?: number;
}

export default function SelectVariant({
  variants,
  quantity: initialQuantity = 1,
}: SelectVariantProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(initialQuantity);
  const { setCartQuantity, cartQuantity } = useContext(CartContext);

  const addToCart = async () => {
    try {
      const graphQLClient = new GraphQLClient(API_URL, {
        credentials: "include",
      });
      await graphQLClient.request(addItemToOrderMutation, {
        productVariantId: selectedVariant.id,
        quantity,
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div>
          <Heading level="h2" size="xs">
            Select Variant
          </Heading>
          <div className="flex flex-col items-start gap-2">
            {variants.map((variant) => (
              <label
                key={variant.id}
                htmlFor={variant.id}
                className={clsx(
                  "inline-block cursor-pointer rounded px-4 py-2 ring-1",
                  selectedVariant.id === variant.id
                    ? "ring-blue-500"
                    : "ring-gray-600",
                )}
              >
                <input
                  type="radio"
                  id={variant.id}
                  name="variant"
                  value={variant.id}
                  checked={selectedVariant.id === variant.id}
                  onChange={() => setSelectedVariant(variant)}
                  className="hidden"
                />
                {variant.name}: {formatCurrency(variant.price)}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Heading level="h2" size="xs">
            Quantity
          </Heading>
          <QuantitySelector initialQuantity={quantity} onChange={setQuantity} />
        </div>
      </div>

      <div>
        <Button
          onClick={async () => {
            await addToCart();
            setCartQuantity(cartQuantity + 1);
          }}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
