"use client";

import { placeOrderAction } from "../app/actions";

export default function OrderButton() {
  return (
    <button
      onClick={() => placeOrderAction()}
      className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Place Order
    </button>
  );
}
