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
  const [selectedFacets, setSelectedFacets] = useState<string[]>([]);
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      const facetFilters = selectedFacets.map((id) => ({ and: id }));
      const results = await getFilteredProductsAction(
        "",
        0,
        100,
        facetFilters,
        true,
      );
      setProducts(results.items as SearchResult[]);
    };

    fetchProducts();
  }, [selectedFacets]);

  console.log("facets", facets);
  console.log("products", products);

  const handleFacetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facetId = e.target.value;

    setSelectedFacets((prev) => {
      if (e.target.checked) {
        return [...prev, facetId];
      } else {
        return prev.filter((id) => id !== facetId);
      }
    });
  };

  return (
    <div className="flex gap-4">
      <div>
        <h1>Facets</h1>
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
              {groupFacets.map((facetValue) => (
                <div key={facetValue.id}>
                  <input
                    type="checkbox"
                    id={facetValue.id}
                    value={facetValue.id}
                    name={facetValue.name}
                    onChange={handleFacetChange}
                    checked={selectedFacets.includes(facetValue.id)}
                  />
                  <label htmlFor={facetValue.id}>
                    {facetValue.name} (
                    {facets.find((f) => f.facetValue.id === facetValue.id)
                      ?.count || 0}
                    )
                  </label>
                </div>
              ))}
            </div>
          ))}
        </form>
      </div>
      <div>
        <h1>Products</h1>
        <ul>
          {products.map((product, index) => (
            <li key={index}>{product.productName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
