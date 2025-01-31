"use client";

import { FacetValue, SearchResult } from "@/gql/graphql";
import { useState, useEffect } from "react";
import { getFilteredProductsAction } from "../actions";
import ProductCard from "@/components/product-card";

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

      // For product filtering, use all selected facets
      const productFacetFilters = Object.entries(selectedFacets)
        .filter(([, group]) => group.length > 0)
        .reduce<{ or: string[] }[]>((acc, [, group]) => {
          if (group.length > 0) {
            acc.push({ or: group });
          }
          return acc;
        }, []);

      // For facet visibility, use only first selected group
      const facetVisibilityFilters =
        firstSelectedGroup && selectedFacets[firstSelectedGroup]?.length > 0
          ? [{ or: selectedFacets[firstSelectedGroup] }]
          : [];

      // Fetch products with all filters
      const productResults = await getFilteredProductsAction(
        "",
        0,
        100,
        productFacetFilters,
        true,
      );

      // Fetch facets with only first group filters
      const facetResults = await getFilteredProductsAction(
        "",
        0,
        100,
        facetVisibilityFilters,
        true,
      );

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
      setProducts(productResults.items as SearchResult[]);
      setCurrentFacets(facetResults.facetValues as typeof facets);
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

    // For other groups, only show facets that would yield results based on first selected group
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

  return (
    <div className="mt-10 flex gap-10">
      <div className="w-[200px]">
        <h2 className="sr-only">Facets</h2>
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
