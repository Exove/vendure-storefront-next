"use client";

import { FacetValue, SearchResult } from "@/gql/graphql";
import { useState, useEffect } from "react";
import { getFilteredProductsAction } from "../actions";

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

  useEffect(() => {
    const fetchProducts = async () => {
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
      setProducts(results.items as SearchResult[]);
      setCurrentFacets(results.facetValues as typeof facets);
    };

    fetchProducts();
  }, [selectedFacets]);

  const handleFacetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facetId = e.target.value;
    const groupName =
      facets.find((f) => f.facetValue.id === facetId)?.facetValue.facet.name ||
      "";

    setSelectedFacets((prev) => {
      const groupFacets = prev[groupName] || [];
      if (e.target.checked) {
        return {
          ...prev,
          [groupName]: [...groupFacets, facetId],
        };
      } else {
        return {
          ...prev,
          [groupName]: groupFacets.filter((id) => id !== facetId),
        };
      }
    });
  };

  const shouldShowFacet = (groupName: string, facetValue: FacetValue) => {
    // Jos ryhmässä on valittu facet, näytä kaikki ryhmän facetit
    if (selectedFacets[groupName]?.length > 0) {
      return true;
    }

    // Muuten näytä vain ne facetit joilla on tuloksia
    return currentFacets.some(
      (f) => f.facetValue.id === facetValue.id && f.count > 0,
    );
  };

  return (
    <div className="flex gap-4">
      <div>
        <h1 className="sr-only">Facets</h1>
        <form>
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
              <h3 className="mb-2 font-semibold">{groupName}</h3>
              {groupFacets.map(
                (facetValue) =>
                  shouldShowFacet(groupName, facetValue) && (
                    <div key={facetValue.id}>
                      <input
                        type="checkbox"
                        id={facetValue.id}
                        value={facetValue.id}
                        name={facetValue.name}
                        onChange={handleFacetChange}
                        checked={
                          selectedFacets[groupName]?.includes(facetValue.id) ||
                          false
                        }
                      />
                      <label htmlFor={facetValue.id}>
                        {facetValue.name} (
                        {currentFacets.find(
                          (f) => f.facetValue.id === facetValue.id,
                        )?.count || 0}
                        )
                      </label>
                    </div>
                  ),
              )}
            </div>
          ))}
        </form>
      </div>
      <div>
        <h1 className="sr-only">Products</h1>
        <ul>
          {products.map((product, index) => (
            <li key={index}>{product.productName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
