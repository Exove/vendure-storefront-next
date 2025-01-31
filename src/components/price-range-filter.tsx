import { useTranslations } from "next-intl";

interface PriceRangeFilterProps {
  priceRange: {
    min: number | null;
    max: number | null;
  };
  onPriceRangeChange: (range: {
    min: number | null;
    max: number | null;
  }) => void;
}

export default function PriceRangeFilter({
  priceRange,
  onPriceRangeChange,
}: PriceRangeFilterProps) {
  const t = useTranslations("Listing");

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onPriceRangeChange({ ...priceRange, min: value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    onPriceRangeChange({ ...priceRange, max: value });
  };

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
        {t("priceRange")}
      </h3>
      <div className="flex flex-col gap-2">
        <div>
          <label htmlFor="min-price" className="text-sm">
            {t("minPrice")}
          </label>
          <input
            type="number"
            id="min-price"
            value={priceRange.min ?? ""}
            onChange={handleMinPriceChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-black"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="max-price" className="text-sm">
            {t("maxPrice")}
          </label>
          <input
            type="number"
            id="max-price"
            value={priceRange.max ?? ""}
            onChange={handleMaxPriceChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-black"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
