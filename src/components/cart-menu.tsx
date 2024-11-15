"use client";

import { useContext, useEffect, useState } from "react";
import SidePanel from "./side-panel";
import { CartContext } from "@/app/templates/product-template";
import useSWR, { mutate } from "swr";
import { activeOrderAction } from "@/app/actions";

export default function CartMenu() {
  let { open } = useContext(CartContext);

  const { data, error } = useSWR("order", activeOrderAction, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

  if (error) throw error;

  useEffect(() => {
    if (open) {
      mutate("order");
    }
  }, [open]);

  return (
    <SidePanel openLabel={`Cart ${data?.totalQuantity}`} open={open}>
      <div className="p-4 text-black">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        {data?.lines.map((item) => (
          <div key={item.id}>
            {item.productVariant.name} x {item.quantity}
            {/* {formatCurrency(item.productVariant. * item.quantity)} */}
          </div>
        ))}
      </div>
    </SidePanel>
  );
}
