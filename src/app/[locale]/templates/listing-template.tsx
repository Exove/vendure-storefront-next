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
          {facets.map((facet, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={facet.facetValue.id}
                value={facet.facetValue.id}
                name={facet.facetValue.name}
                onChange={handleFacetChange}
                checked={selectedFacets.includes(facet.facetValue.id)}
              />
              <label htmlFor={facet.facetValue.id}>
                {facet.facetValue.name} ({facet.count})
              </label>
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
