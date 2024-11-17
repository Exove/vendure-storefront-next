"use client";

import { useContext, useEffect, useState } from "react";
import SidePanel from "./side-panel";
import { CartContext } from "@/app/templates/product-template";
import useSWR, { mutate } from "swr";
import { activeOrderAction } from "@/app/actions";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function CartMenu() {
  let { cartQuantity } = useContext(CartContext);
  const [animationClasses, setAnimationClasses] = useState("");

  const { data, error } = useSWR("order", activeOrderAction, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

  if (error) throw error;

  useEffect(() => {
    if (cartQuantity) {
      mutate("order");
    }

    setAnimationClasses("");
    setTimeout(() => {
      setAnimationClasses("motion-duration-700 motion-preset-pop");
    }, 20);
  }, [cartQuantity]);

  return (
    <SidePanel
      openLabel={
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="w-6 h-6" />
          {data?.totalQuantity ? (
            <div
              className={clsx(
                "border w-6 h-6 flex items-center justify-center text-xs rounded-full",
                cartQuantity && animationClasses,
              )}
            >
              {data.totalQuantity}
            </div>
          ) : (
            <div className="border w-6 h-6 border-transparent" />
          )}
          <span className="sr-only">Cart</span>
        </div>
      }
    >
      <div className="p-4 text-black">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        <div className="flex flex-col gap-20">
          <div>
            {data?.lines.map((item) => (
              <div key={item.id}>
                {item.productVariant.name} x {item.quantity}
                {/* {formatCurrency(item.productVariant. * item.quantity)} */}
              </div>
            ))}
          </div>

          <Link
            href="/checkout"
            className="bg-black text-white py-3 px-4 rounded block text-center"
          >
            Checkout
          </Link>
        </div>
      </div>
    </SidePanel>
  );
}
