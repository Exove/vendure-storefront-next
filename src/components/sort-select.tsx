"use client";

import { SortOrder, SearchResultSortParameter } from "@/gql/graphql";
import { useTranslations } from "next-intl";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface SortSelectProps {
  sortOrder: SearchResultSortParameter;
  onSortChange: (sortOrder: SearchResultSortParameter) => void;
}

export default function SortSelect({
  sortOrder,
  onSortChange,
}: SortSelectProps) {
  const t = useTranslations("listing");

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="sort" className="text-sm text-blue-400">
        {t("sortBy")}:
      </label>
      <div className="relative">
        <select
          id="sort"
          className="relative appearance-none rounded-md border border-gray-300 bg-white px-2 py-1 pr-8 text-sm text-slate-900"
          onChange={(e) => {
            const [field, order] = e.target.value.split("-") as [
              "name" | "price",
              SortOrder,
            ];
            onSortChange({ [field]: order });
          }}
          value={
            sortOrder.name
              ? `name-${sortOrder.name}`
              : sortOrder.price
                ? `price-${sortOrder.price}`
                : ""
          }
        >
          <option value="">{t("relevance")}</option>
          <option value={`name-${SortOrder.Asc}`}>{t("nameAsc")}</option>
          <option value={`name-${SortOrder.Desc}`}>{t("nameDesc")}</option>
          <option value={`price-${SortOrder.Asc}`}>{t("priceAsc")}</option>
          <option value={`price-${SortOrder.Desc}`}>{t("priceDesc")}</option>
        </select>
        <ChevronUpDownIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
      </div>
    </div>
  );
}
