"use client";

import { placeOrder } from "../app/actions";

export default function CreateOrder() {
  return (
    <div>
      <button
        onClick={() => placeOrder()}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Place Order
      </button>
    </div>
  );
}
