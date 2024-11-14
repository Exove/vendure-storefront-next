"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  initialQuantity?: number;
  onChange?: (quantity: number) => void;
}

export default function QuantitySelector({
  initialQuantity = 1,
  onChange,
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
      <button
        onClick={decrement}
        className="w-8 h-8 flex items-center justify-center rounded"
        disabled={quantity <= 1}
      >
        {/* TODO: Add icons */}
        --
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
          setQuantity(newQuantity);
          onChange?.(newQuantity);
        }}
        className="w-8 bg-inherit text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={increment}
        className="w-8 h-8 flex items-center justify-center rounded"
      >
        +
      </button>
    </div>
  );
}
