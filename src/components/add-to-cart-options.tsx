"use client";

import { VENDURE_API_URL } from "@/common/constants";
import { GraphQLClient } from "graphql-request";
import { useContext, useState } from "react";
import clsx from "clsx";
import QuantitySelector from "./quantity-selector";
import { formatCurrency } from "@/common/utils";
import { CartContext } from "@/app/[locale]/templates/product-template";
import Button from "./button";
import Heading from "./heading";
import { useTranslations } from "next-intl";
import { addItemToOrderMutation } from "@/common/mutations";
import { getBearerToken, setBearerToken } from "@/app/[locale]/actions";
import { print } from "graphql";

interface AddToCartOptionsProps {
  variants: {
    id: string;
    name: string;
    priceWithTax: number;
    stockLevel: string;
  }[];
  quantity?: number;
  displayPrice?: boolean;
}

export default function AddToCartOptions({
  variants,
  quantity: initialQuantity = 1,
  displayPrice = true,
}: AddToCartOptionsProps) {
  const t = useTranslations();
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(initialQuantity);
  const { setCartQuantity, cartQuantity } = useContext(CartContext);

  const isOutOfStock = selectedVariant.stockLevel === "OUT_OF_STOCK";

  const addToCart = async () => {
    if (isOutOfStock) return;

    try {
      const bearerToken = await getBearerToken();
      const authHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (bearerToken?.value) {
        authHeaders.Authorization = `Bearer ${bearerToken.value}`;
      }

      const graphQLClient = new GraphQLClient(VENDURE_API_URL, {
        headers: authHeaders,
      });

      const response = await graphQLClient.rawRequest(
        print(addItemToOrderMutation),
        {
          productVariantId: selectedVariant.id,
          quantity,
        },
      );

      const authToken = response.headers.get("vendure-auth-token");
      if (authToken && !bearerToken) {
        await setBearerToken(authToken);
      }

      setCartQuantity(cartQuantity + quantity);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        {variants.length > 1 && (
          <div>
            <Heading level="h2" size="xs">
              {t("product.selectVariant")}
            </Heading>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {variants.map((variant) => (
                <label
                  key={variant.id}
                  htmlFor={variant.id}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all focus-within:ring-2 focus-within:ring-blue-500 hover:border-blue-400",
                    selectedVariant.id === variant.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 hover:bg-slate-800",
                    variant.stockLevel === "OUT_OF_STOCK" &&
                      "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="radio"
                    id={variant.id}
                    name="variant"
                    value={variant.id}
                    checked={selectedVariant.id === variant.id}
                    onChange={() => setSelectedVariant(variant)}
                    disabled={variant.stockLevel === "OUT_OF_STOCK"}
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{variant.name}</span>
                    {variant.stockLevel === "OUT_OF_STOCK" && (
                      <span className="text-sm text-red-500">
                        {t("product.outOfStock")}
                      </span>
                    )}
                  </div>
                  {displayPrice && (
                    <span className="text-lg font-semibold text-blue-400">
                      {formatCurrency(variant.priceWithTax)}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <Heading level="h2" size="xs">
            {t("product.quantity")}
          </Heading>
          <QuantitySelector
            initialQuantity={quantity}
            onChange={setQuantity}
            disabled={isOutOfStock}
          />
        </div>
      </div>

      <div>
        <Button
          onClick={async () => {
            await addToCart();
            setCartQuantity(cartQuantity + 1);
          }}
          fullWidth
          size="medium"
          id="add-to-cart"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? t("product.outOfStock") : t("product.addToCart")}
        </Button>
      </div>
    </div>
  );
}
