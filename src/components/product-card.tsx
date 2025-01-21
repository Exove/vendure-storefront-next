"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { formatCurrency } from "@/common/utils";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";

interface ProductCardProps {
  slug: string;
  name: string;
  imageSource: string;
  collection?: string;
  priceWithTax: number;
}

export default function ProductCard({
  slug,
  name,
  imageSource,
  collection,
  priceWithTax,
}: ProductCardProps) {
  const locale = useLocale();

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-700 transition-all hover:border-blue-500"
    >
      <div className="relative aspect-square overflow-hidden">
        {imageSource ? (
          <Image
            src={imageSource}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800">
            <PhotoIcon className="h-12 w-12 text-slate-600" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        {collection && <p className="text-sm text-slate-400">{collection}</p>}
        <p className="mt-auto text-lg font-semibold text-blue-400">
          {formatCurrency(priceWithTax, locale)}
        </p>
      </div>
    </Link>
  );
}
