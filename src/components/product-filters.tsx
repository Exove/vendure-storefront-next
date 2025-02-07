import { FacetValue } from "@/gql/graphql";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import PriceRangeFilter from "@/components/price-range-filter";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/facet-accordion";
import { HIDDEN_FACET_GROUPS } from "@/common/constants";

interface ProductFiltersProps {
  facets: {
    count: number;
    facetValue: FacetValue;
  }[];
  selectedFacets: Record<string, string[]>;
  onFacetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  onPriceRangeChange: (range: {
    min: number | null;
    max: number | null;
  }) => void;
  onClearFilters: () => void;
  currentFacets: {
    count: number;
    facetValue: FacetValue;
  }[];
  originalFacets: {
    count: number;
    facetValue: FacetValue;
  }[];
  firstSelectedGroup: string | null;
  isLoading: boolean;
  isMobile?: boolean;
}

export default function ProductFilters({
  facets,
  selectedFacets,
  onFacetChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  currentFacets,
  originalFacets,
  firstSelectedGroup,
  isLoading,
  isMobile = false,
}: ProductFiltersProps) {
  const t = useTranslations("listing");

  // Determine whether a facet should be displayed based on current filters
  const shouldShowFacet = (groupName: string, facetValue: FacetValue) => {
    // Always show all facets in the first selected group
    if (groupName === firstSelectedGroup) {
      return true;
    }

    // During loading, keep showing what was visible before
    if (isLoading && selectedFacets[groupName]?.includes(facetValue.id)) {
      return true;
    }

    // For other groups, only show facets that would yield results
    return currentFacets.some(
      (f) => f.facetValue.id === facetValue.id && f.count > 0,
    );
  };

  const getFacetCount = (facetId: string, groupName: string) => {
    // For the first selected group, always show original counts
    if (groupName === firstSelectedGroup) {
      return (
        originalFacets.find((f) => f.facetValue.id === facetId)?.count || ""
      );
    }

    if (isLoading) {
      return (
        currentFacets.find((f) => f.facetValue.id === facetId)?.count || ""
      );
    }
    return currentFacets.find((f) => f.facetValue.id === facetId)?.count || "";
  };

  const hasActiveFilters = Object.values(selectedFacets).some(
    (group) => group.length > 0,
  );

  return (
    <>
      {!isMobile && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="sr-only">Facets</h2>
          <div className="h-[35px]">
            {(hasActiveFilters ||
              priceRange.min !== null ||
              priceRange.max !== null) && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 text-xs text-blue-300 hover:text-blue-100"
              >
                <div className="rounded-full border border-blue-300">
                  <XMarkIcon className="h-4 w-4" />
                </div>
                {t("clearFilters")}
              </button>
            )}
          </div>
        </div>
      )}
      <form className="flex flex-col gap-8">
        <AccordionItem open>
          <AccordionTrigger>{t("priceRange")}</AccordionTrigger>
          <AccordionContent>
            <PriceRangeFilter
              priceRange={priceRange}
              onPriceRangeChange={onPriceRangeChange}
            />
          </AccordionContent>
        </AccordionItem>

        {Object.entries(
          facets.reduce(
            (acc, { facetValue }) => {
              const group = facetValue.facet.name;
              if (HIDDEN_FACET_GROUPS.includes(group)) return acc;
              acc[group] = acc[group] || [];
              acc[group].push(facetValue);
              return acc;
            },
            {} as Record<string, FacetValue[]>,
          ),
        ).map(([groupName, groupFacets]) => {
          const hasVisibleFacets = groupFacets.some((facetValue) =>
            shouldShowFacet(groupName, facetValue),
          );

          return hasVisibleFacets ? (
            <AccordionItem key={groupName} open>
              <AccordionTrigger>{groupName}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {groupFacets.map(
                    (facetValue) =>
                      shouldShowFacet(groupName, facetValue) && (
                        <div
                          key={facetValue.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative flex h-5 w-5 items-center justify-center">
                              <input
                                type="checkbox"
                                id={`${isMobile ? "mobile-" : ""}${facetValue.id}`}
                                value={facetValue.id}
                                name={facetValue.name}
                                onChange={onFacetChange}
                                checked={
                                  selectedFacets[groupName]?.includes(
                                    facetValue.id,
                                  ) || false
                                }
                                className="absolute h-5 w-5 cursor-pointer appearance-none rounded-md bg-slate-700 transition-all checked:bg-blue-500 hover:bg-slate-500"
                              />
                              <CheckIcon className="pointer-events-none z-10 h-3 w-3 stroke-[3] text-white opacity-0 transition-opacity [input:checked~&]:opacity-100" />
                            </div>
                            <label
                              htmlFor={`${isMobile ? "mobile-" : ""}${
                                facetValue.id
                              }`}
                              className="cursor-pointer text-sm font-medium capitalize text-slate-200 hover:text-white"
                            >
                              {facetValue.name}
                            </label>
                          </div>
                          <span className="text-slate-400">
                            {getFacetCount(facetValue.id, groupName)}
                          </span>
                        </div>
                      ),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : null;
        })}
      </form>
    </>
  );
}
