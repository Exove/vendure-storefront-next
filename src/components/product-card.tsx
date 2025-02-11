"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { formatCurrency } from "@/common/utils";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import Heading from "./heading";

interface ProductCardProps {
  slug: string;
  name: string;
  imageSource: string;
  priceWithTax: number;
  hasVariantPrices?: boolean;
}

export default function ProductCard({
  slug,
  name,
  imageSource,
  priceWithTax,
  hasVariantPrices = false,
}: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations();

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
        <Heading level="h2" size="sm" className="mb-0">
          {name}
        </Heading>
        <p className="mt-auto text-blue-400">
          <span className="text-sm">
            {hasVariantPrices && t("product.fromPrice")}{" "}
          </span>
          <span className="text-lg font-semibold">
            {formatCurrency(priceWithTax, locale)}
          </span>
        </p>
      </div>
    </Link>
  );
}
