"use client";

import { useEffect } from "react";
import SidePanel from "./side-panel";

export default function CartMenu() {
  useEffect(() => {
    console.log("moi");
  }, []);

  return (
    <SidePanel openLabel="Cart">
      <div className="p-4 text-black">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        <p>Cart items will be shown here</p>
      </div>
    </SidePanel>
  );
}
