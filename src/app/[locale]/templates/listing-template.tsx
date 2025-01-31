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
  const [firstSelectedGroup, setFirstSelectedGroup] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      // Convert selected facets into the API's filter format
      // Each group's selections are combined with OR, different groups with AND
      const facetFilters = Object.entries(selectedFacets)
        .filter(([, group]) => group.length > 0)
        .reduce<{ or: string[] }[]>((acc, [, group]) => {
          if (group.length > 0) {
            acc.push({ or: group });
          }
          return acc;
        }, []);

      // Fetch filtered products and update available facets
      const results = await getFilteredProductsAction(
        "",
        0,
        100,
        facetFilters,
        true,
      );
      setProducts(results.items as SearchResult[]);
      setCurrentFacets(results.facetValues as typeof facets);
    };

    fetchProducts();
  }, [selectedFacets]);

  // Handle facet checkbox changes
  const handleFacetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facetId = e.target.value;
    const groupName =
      facets.find((f) => f.facetValue.id === facetId)?.facetValue.facet.name ||
      "";

    setSelectedFacets((prev) => {
      const groupFacets = prev[groupName] || [];
      const newSelectedFacets = e.target.checked
        ? {
            ...prev,
            [groupName]: [...groupFacets, facetId],
          }
        : {
            ...prev,
            [groupName]: groupFacets.filter((id) => id !== facetId),
          };

      // If this is the first selection in any group, set it as the firstSelectedGroup
      if (
        Object.values(prev).every((group) => group.length === 0) &&
        e.target.checked
      ) {
        setFirstSelectedGroup(groupName);
      }
      // If removing the last selection from firstSelectedGroup, reset it
      else if (
        groupName === firstSelectedGroup &&
        newSelectedFacets[groupName].length === 0
      ) {
        setFirstSelectedGroup(null);
      }

      return newSelectedFacets;
    });
  };

  // Determine whether a facet should be displayed based on current filters
  const shouldShowFacet = (groupName: string, facetValue: FacetValue) => {
    // For the first group where user made a selection, show all options
    if (groupName === firstSelectedGroup) {
      return true;
    }

    // For other groups, only show facets that would yield results
    return currentFacets.some(
      (f) => f.facetValue.id === facetValue.id && f.count > 0,
    );
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
                          {currentFacets.find(
                            (f) => f.facetValue.id === facetValue.id,
                          )?.count || "0"}
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
