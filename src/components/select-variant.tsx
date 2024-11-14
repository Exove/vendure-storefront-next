"use client";

import { API_URL } from "@/common/constants";
import { addItemToOrderMutation } from "@/common/queries";
import { GraphQLClient } from "graphql-request";
import { useState } from "react";
import clsx from "clsx";
import QuantitySelector from "./quantity-selector";
import { formatCurrency } from "@/common/utils";

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
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 items-start">
        {variants.map((variant) => (
          <label
            key={variant.id}
            htmlFor={variant.id}
            className={clsx(
              "inline-block py-2 px-4 ring-1 rounded cursor-pointer",
              selectedVariant.id === variant.id
                ? "ring-blue-500"
                : "ring-gray-600"
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

      <QuantitySelector initialQuantity={quantity} onChange={setQuantity} />

      <div>
        <button
          onClick={addToCart}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
