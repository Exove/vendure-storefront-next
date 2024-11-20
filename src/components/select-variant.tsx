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
      <div className="flex flex-col gap-8">
        <div>
          <Heading level="h2" size="xs">
            Select Variant
          </Heading>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {variants.map((variant) => (
              <label
                key={variant.id}
                htmlFor={variant.id}
                className={clsx(
                  "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-blue-400",
                  selectedVariant.id === variant.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 hover:bg-slate-800",
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
                <span className="font-medium">{variant.name}</span>
                <span className="text-lg font-semibold text-blue-400">
                  {formatCurrency(variant.price)}
                </span>
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

      <div className="mt-4">
        <Button
          onClick={async () => {
            await addToCart();
            setCartQuantity(cartQuantity + 1);
          }}
          fullWidth
          size="medium"
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
