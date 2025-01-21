"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface QuantitySelectorProps {
  initialQuantity?: number;
  onChange?: (quantity: number) => void;
  showRemoveButton?: boolean;
}

export default function QuantitySelector({
  initialQuantity = 1,
  onChange,
  showRemoveButton = false,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onChange?.(newQuantity);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-md bg-slate-700">
        <button
          onClick={decrement}
          className="flex h-8 w-8 items-center justify-center rounded-full"
          disabled={quantity <= 1}
        >
          <MinusIcon className="h-4 w-4 stroke-[3]" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
            setQuantity(newQuantity);
            onChange?.(newQuantity);
          }}
          className="w-8 bg-inherit text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          data-testid="quantity-input"
        />

        <button
          onClick={increment}
          className="flex h-8 w-8 items-center justify-center rounded-full"
        >
          <PlusIcon className="h-4 w-4 stroke-[3]" />
        </button>
      </div>
      {showRemoveButton && (
        <button>
          <TrashIcon className="h-8 w-8 rounded-full bg-red-100 p-2" />
          <span className="sr-only">Remove from cart</span>
        </button>
      )}
    </div>
  );
}
