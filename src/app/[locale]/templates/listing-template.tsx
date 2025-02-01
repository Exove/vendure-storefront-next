"use client";

import {
  FacetValue,
  SearchResult,
  SearchResultSortParameter,
} from "@/gql/graphql";
import { useState, useEffect } from "react";
import { getFilteredProductsAction } from "../actions";
import ProductCard from "@/components/product-card";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import PriceRangeFilter from "@/components/price-range-filter";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/facet-accordion";
import SortSelect from "@/components/sort-select";
import { PRODUCTS_PER_LOAD } from "@/common/constants";
import { useSearchParams, usePathname } from "next/navigation";

interface ListingTemplateProps {
  products: SearchResult[];
  facets: {
    count: number;
    facetValue: FacetValue;
  }[];
  title?: string;
}

export default function ListingTemplate({
  products: initialProducts,
  facets,
  title,
}: ListingTemplateProps) {
  const t = useTranslations("listing");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >(() => {
    const facetsFromUrl: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("facet_")) {
        const groupName = key.replace("facet_", "");
        facetsFromUrl[groupName] = value.split(",");
      }
    }
    return facetsFromUrl;
  });

  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>(() => ({
    min: searchParams.get("min_price")
      ? Number(searchParams.get("min_price"))
      : null,
    max: searchParams.get("max_price")
      ? Number(searchParams.get("max_price"))
      : null,
  }));

  const [products, setProducts] = useState(initialProducts);
  const [currentFacets, setCurrentFacets] = useState(facets);
  const [originalFacets] = useState(facets);
  const [firstSelectedGroup, setFirstSelectedGroup] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SearchResultSortParameter>(() => {
    const sortParam = searchParams.get("sort");
    if (!sortParam) return {};
    const [field, order] = sortParam.split("_");
    return { [field]: order };
  });

  const [skip, setSkip] = useState(() => {
    return Number(searchParams.get("skip")) || 0;
  });
  const [take] = useState(PRODUCTS_PER_LOAD);
  const [hasMore, setHasMore] = useState(true);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Add facets to URL
    Object.entries(selectedFacets).forEach(([groupName, values]) => {
      if (values.length > 0) {
        params.set(`facet_${groupName}`, values.join(","));
      }
    });

    // Add price range to URL
    if (priceRange.min !== null)
      params.set("min_price", priceRange.min.toString());
    if (priceRange.max !== null)
      params.set("max_price", priceRange.max.toString());

    // Add sort to URL
    if (Object.keys(sortOrder).length > 0) {
      const [field, order] = Object.entries(sortOrder)[0];
      params.set("sort", `${field}_${order}`);
    }

    // Add pagination to URL
    if (skip > 0) params.set("skip", skip.toString());

    // Update URL without triggering navigation
    const newUrl = `${pathname}${params.toString() ? "?" + params.toString() : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [selectedFacets, priceRange, sortOrder, skip, take, pathname]);

  // Restore scroll position when navigating back
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      // Convert selectedFacets into API format where each facet group's values are combined with OR,
      // and different groups are implicitly combined with AND
      const facetFilters = Object.entries(selectedFacets)
        .filter(([, group]) => group.length > 0)
        .reduce<{ or: string[] }[]>((acc, [, group]) => {
          if (group.length > 0) {
            acc.push({ or: group });
          }
          return acc;
        }, []);

      // On initial load with skip > 0, fetch all products up to current skip
      const isInitialLoadWithSkip =
        skip > 0 && products.length === initialProducts.length;
      const results = await getFilteredProductsAction(
        "",
        isInitialLoadWithSkip ? 0 : skip,
        isInitialLoadWithSkip ? skip + take : take,
        facetFilters,
        true,
        // Convert euros to cents for the API
        priceRange.min !== null ? priceRange.min * 100 : null,
        priceRange.max !== null ? priceRange.max * 100 : null,
        sortOrder,
      );

      // If results are less than take, there's nothing more to load
      setHasMore(
        results.items.length === (isInitialLoadWithSkip ? skip + take : take),
      );

      // If skip is 0 or it's initial load with skip, replace products
      // otherwise append new products to the list
      if (skip === 0 || isInitialLoadWithSkip) {
        setProducts(results.items as SearchResult[]);
      } else {
        setProducts((prev) => [...prev, ...(results.items as SearchResult[])]);
      }

      // If results are empty and we have more than one facet group selected,
      // keep only the first selected group
      if (
        results.items.length === 0 &&
        Object.keys(selectedFacets).length > 1
      ) {
        const firstGroup = Object.entries(selectedFacets).find(
          ([, values]) => values.length > 0,
        );
        if (firstGroup) {
          const [groupName, groupValues] = firstGroup;
          setSelectedFacets({ [groupName]: groupValues });
          return; // Early return to trigger useEffect again with updated selectedFacets
        }
      }

      // Update firstSelectedGroup based on the current state of selectedFacets
      const selectedGroups = Object.entries(selectedFacets).filter(
        ([, values]) => values.length > 0,
      );

      const newFirstSelectedGroup =
        selectedGroups.length === 1
          ? selectedGroups[0][0]
          : selectedGroups.length === 0
            ? null
            : firstSelectedGroup;

      setFirstSelectedGroup(newFirstSelectedGroup);
      setCurrentFacets(results.facetValues as typeof facets);
      setIsLoading(false);
    };

    fetchProducts();
  }, [selectedFacets, firstSelectedGroup, priceRange, sortOrder, skip, take]);

  // Handle facet checkbox changes
  const handleFacetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facetId = e.target.value;
    const groupName =
      facets.find((f) => f.facetValue.id === facetId)?.facetValue.facet.name ||
      "";

    setSkip(0); // Reset skip when filters are changed
    setSelectedFacets((prev) => {
      const groupFacets = prev[groupName] || [];
      return {
        ...prev,
        [groupName]: e.target.checked
          ? [...groupFacets, facetId]
          : groupFacets.filter((id) => id !== facetId),
      };
    });
  };

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

  const handleClearFilters = () => {
    setSelectedFacets({});
    setFirstSelectedGroup(null);
    setProducts(initialProducts);
    setCurrentFacets(facets);
    setPriceRange({ min: null, max: null });
    setSkip(0);
    // Clear URL params
    window.history.replaceState({}, "", pathname);
  };

  const hasActiveFilters = Object.values(selectedFacets).some(
    (group) => group.length > 0,
  );

  return (
    <div>
      {title && (
        <div className="mb-16 mt-6 rounded-xl bg-slate-800 px-10 py-24 text-center">
          <h1 className="text-4xl font-black">{title}</h1>
        </div>
      )}
      <div className="mt-10 flex gap-16">
        <div className="w-[200px]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="sr-only">Facets</h2>
            <div className="h-[35px]">
              {(hasActiveFilters ||
                priceRange.min !== null ||
                priceRange.max !== null) && (
                <button
                  onClick={() => {
                    handleClearFilters();
                    setPriceRange({ min: null, max: null });
                  }}
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
          <form className="flex flex-col gap-8">
            <AccordionItem open>
              <AccordionTrigger>{t("priceRange")}</AccordionTrigger>
              <AccordionContent>
                <PriceRangeFilter
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Group facets by their facet type (e.g., Color, Size) */}
            {Object.entries(
              facets.reduce(
                (acc, { facetValue }) => {
                  const group = facetValue.facet.name;
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
                                <input
                                  type="checkbox"
                                  id={facetValue.id}
                                  value={facetValue.id}
                                  name={facetValue.name}
                                  onChange={handleFacetChange}
                                  checked={
                                    selectedFacets[groupName]?.includes(
                                      facetValue.id,
                                    ) || false
                                  }
                                />
                                <label htmlFor={facetValue.id}>
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
        </div>

        {/* Product listing */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-end">
            <h1 className="sr-only">Products</h1>
            <SortSelect sortOrder={sortOrder} onSortChange={setSortOrder} />
          </div>
          <ul className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <li key={index}>
                {product.slug && (
                  <ProductCard
                    slug={product.slug}
                    name={product.productName}
                    imageSource={product.productAsset?.preview ?? ""}
                    priceWithTax={
                      "min" in product.priceWithTax
                        ? product.priceWithTax.min
                        : product.priceWithTax.value
                    }
                  />
                )}
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setSkip((prev) => prev + take)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? t("loading") : t("showMore")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
