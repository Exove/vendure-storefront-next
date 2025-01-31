"use client";

import { FacetValue, SearchResult } from "@/gql/graphql";
import { useState, useEffect } from "react";
import { getFilteredProductsAction } from "../actions";
import ProductCard from "@/components/product-card";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";

interface ListingTemplateProps {
  products: SearchResult[];
  facets: {
    count: number;
    facetValue: FacetValue;
  }[];
}

export default function ListingTemplate({
  products: initialProducts,
  facets,
}: ListingTemplateProps) {
  const t = useTranslations("Listing");
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >({});
  const [products, setProducts] = useState(initialProducts);
  const [currentFacets, setCurrentFacets] = useState(facets);
  const [originalFacets] = useState(facets);
  const [firstSelectedGroup, setFirstSelectedGroup] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

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

      const results = await getFilteredProductsAction(
        "",
        0,
        100,
        facetFilters,
        true,
      );

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
      setProducts(results.items as SearchResult[]);
      setCurrentFacets(results.facetValues as typeof facets);
      setIsLoading(false);
    };

    fetchProducts();
  }, [selectedFacets, firstSelectedGroup]);

  // Handle facet checkbox changes
  const handleFacetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facetId = e.target.value;
    const groupName =
      facets.find((f) => f.facetValue.id === facetId)?.facetValue.facet.name ||
      "";

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
  };

  const hasActiveFilters = Object.values(selectedFacets).some(
    (group) => group.length > 0,
  );

  return (
    <div className="mt-10 flex gap-10">
      <div className="w-[200px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="sr-only">Facets</h2>
          <div className="h-[20px]">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-100"
              >
                <div className="rounded-full border border-blue-300">
                  <XMarkIcon className="h-4 w-4" />
                </div>
                {t("clearFilters")}
              </button>
            )}
          </div>
        </div>
        <form>
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
          ).map(([groupName, groupFacets]) => (
            <div key={groupName} className="mb-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
                {groupName}
              </h3>
              {/* Render checkboxes for each facet value if it should be shown */}
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
            </div>
          ))}
        </form>
      </div>

      {/* Product listing */}
      <div className="flex-1">
        <h1 className="sr-only">Products</h1>
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
      </div>
    </div>
  );
}
