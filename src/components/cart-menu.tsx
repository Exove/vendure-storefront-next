"use client";

import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect } from "react";
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
import QuantitySelector from "./quantity-selector";
import { formatCurrency } from "@/common/utils";
import Image from "next/image";
import Button from "./button";

export default function CartMenu() {
  const { cartQuantity } = useContext(CartContext);

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
      title="Shopping Cart"
      openLabel={
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="h-6 w-6" />
          {order?.totalQuantity ? (
            <motion.div
              animate={{
                scale: cartQuantity !== 0 ? [0.6, 1] : 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                },
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border text-sm"
              key={cartQuantity}
            >
              {order.totalQuantity}
            </motion.div>
          ) : (
            <div className="h-7 w-7 border border-transparent" />
          )}
          <span className="sr-only">Cart</span>
        </div>
      }
      footer={
        <div className="mb-10 flex flex-col gap-4 border-t border-slate-700 pt-6">
          <div className="flex w-full justify-between text-lg font-medium">
            <span>Subtotal</span>
            <span>{formatCurrency(order?.subTotalWithTax ?? 0)}</span>
          </div>
          <div>
            <Button href="/checkout" fullWidth>
              Checkout
            </Button>
          </div>
        </div>
      }
    >
      <div>
        {!order?.lines?.length ? (
          <div className="mt-16 text-center text-slate-400">
            Your cart is empty
          </div>
        ) : (
          <div className="mb-6 mt-10 flex flex-col divide-y divide-slate-700">
            <AnimatePresence>
              {order?.lines.map((item) => (
                <motion.div
                  key={item.id}
                  exit={{ opacity: 0 }}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <div className="flex gap-6">
                    <Link
                      href={`/products/${item.productVariant.product.slug}`}
                      className="flex-shrink-0 overflow-hidden rounded-lg"
                    >
                      <Image
                        src={
                          item.featuredAsset?.preview ??
                          "/placeholder-image.jpg"
                        }
                        alt={item.productVariant.name}
                        width={96}
                        height={96}
                        className="h-24 w-24 object-cover transition-transform hover:scale-110"
                      />
                    </Link>
                    <div className="flex w-full flex-col justify-between">
                      <div className="flex w-full justify-between">
                        <div>
                          <Link
                            href={`/products/${item.productVariant.product.slug}`}
                            className="font-medium hover:text-slate-300"
                          >
                            {item.productVariant.name}
                          </Link>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.linePriceWithTax)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex w-full items-center justify-between">
                          <QuantitySelector
                            initialQuantity={item.quantity}
                            onChange={(quantity) =>
                              handleQuantityChange(item.id, quantity)
                            }
                          />

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="transition-colors hover:text-red-500"
                          >
                            <TrashIcon className="h-8 w-8 rounded-full bg-red-900/50 p-2 transition-colors hover:bg-red-800" />
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
        )}
      </div>
    </SidePanel>
  );
}
