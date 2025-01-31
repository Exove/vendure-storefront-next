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
    <div className="flex gap-4">
      <div className="flex-1">
        <label htmlFor="min-price" className="text-xs">
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
      <div className="flex-1">
        <label htmlFor="max-price" className="text-xs">
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
  );
}
