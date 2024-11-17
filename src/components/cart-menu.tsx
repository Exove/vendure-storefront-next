"use client";

import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import SidePanel from "./side-panel";
import { CartContext } from "@/app/templates/product-template";
import useSWR, { mutate } from "swr";
import {
  activeOrderAction,
  adjustOrderLineAction,
  removeItemFromOrderAction,
} from "@/app/actions";
import Link from "next/link";
import { ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Heading from "./heading";
import QuantitySelector from "./quantity-selector";
import { formatCurrency } from "@/common/utils";
import Image from "next/image";

export default function CartMenu() {
  let { cartQuantity } = useContext(CartContext);

  const { data: order, error } = useSWR("order/add", activeOrderAction, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
  if (error) throw error;

  useEffect(() => {
    if (cartQuantity) {
      mutate("order/add");
    }
  }, [cartQuantity]);

  const handleRemoveItem = async (itemId: string) => {
    await removeItemFromOrderAction(itemId);
    mutate("order/add");
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    await adjustOrderLineAction(itemId, quantity);
    mutate("order/add");
  };

  return (
    <SidePanel
      openLabel={
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="h-6 w-6" />
          {order?.totalQuantity ? (
            <motion.div
              animate={{ scale: 1.2 }}
              className="flex h-6 w-6 items-center justify-center rounded-full border text-xs"
              key={order.totalQuantity}
            >
              {order.totalQuantity}
            </motion.div>
          ) : (
            <div className="h-6 w-6 border border-transparent" />
          )}
          <span className="sr-only">Cart</span>
        </div>
      }
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4">
          <Heading size="medium" level="h2">
            Shopping Cart
          </Heading>
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {order?.lines.map((item) => (
                <motion.div key={item.id} exit={{ opacity: 0 }}>
                  <div className="flex gap-4">
                    <Image
                      src={
                        item.featuredAsset?.preview ?? "/placeholder-image.jpg"
                      }
                      alt={item.productVariant.name}
                      width={96}
                      height={96}
                      className="h-24 w-24 flex-shrink-0 rounded-md object-cover"
                    />
                    <div className="flex w-full flex-col gap-6">
                      <div className="flex w-full justify-between">
                        <div>{item.productVariant.name}</div>
                        <div>{formatCurrency(item.linePriceWithTax)}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QuantitySelector
                            initialQuantity={item.quantity}
                            onChange={(quantity) =>
                              handleQuantityChange(item.id, quantity)
                            }
                          />

                          <button onClick={() => handleRemoveItem(item.id)}>
                            <TrashIcon className="h-8 w-8 rounded-full bg-red-100 p-2" />
                            <span className="sr-only">Remove from cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="mb-32 flex flex-col gap-4">
          <div className="flex w-full justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order?.subTotalWithTax ?? 0)}</span>
          </div>
          <Link
            href="/checkout"
            className="block rounded bg-black px-4 py-3 text-center text-white"
          >
            Checkout
          </Link>
        </div>
      </div>
    </SidePanel>
  );
}
