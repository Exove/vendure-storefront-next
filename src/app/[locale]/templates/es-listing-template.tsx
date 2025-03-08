"use client";

import { InstantSearch, SearchBox } from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";
import { useRefinementList, useHits } from "react-instantsearch";
import React from "react";

// Mukautettu komponentti RefinementList-suodattimelle käyttäen hookia
interface CustomRefinementListProps {
  title: string;
  attribute: string;
}

const CustomRefinementList = ({
  title,
  attribute,
}: CustomRefinementListProps) => {
  const { items, refine } = useRefinementList({
    attribute,
    limit: 20,
  });

  return (
    <div>
      <h3>{title}</h3>

      {/* Suodatinvaihtoehdot */}
      <div>
        <ul style={{ maxHeight: "200px", overflowY: "auto" }}>
          {items.map((item) => (
            <li key={item.label}>
              <label style={{ display: "flex", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={item.isRefined}
                  onChange={() => refine(item.value)}
                />
                <span>
                  {item.highlighted ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: item.highlighted }}
                    />
                  ) : (
                    item.label
                  )}
                </span>
                <span style={{ marginLeft: "auto" }}>({item.count})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Mukautettu Hits-komponentti käyttäen useHits-hookia
const CustomHits = () => {
  const { items } = useHits();

  return (
    <div>
      <h3>Tuotteet</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {items.map((hit) => (
          <div
            key={hit.objectID}
            style={{
              border: "1px solid #eee",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h4>{hit.productVariantName}</h4>
            {hit["product-facetValueData"] && (
              <div>
                {JSON.parse(hit["product-facetValueData"]).category && (
                  <p>
                    Kategoria:{" "}
                    {JSON.parse(hit["product-facetValueData"]).category.join(
                      ", ",
                    )}
                  </p>
                )}
                {JSON.parse(hit["product-facetValueData"]).brand && (
                  <p>
                    Brändi:{" "}
                    {JSON.parse(hit["product-facetValueData"]).brand.join(", ")}
                  </p>
                )}
              </div>
            )}
            <p>Slug: {hit.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const searchClient = createClient({
  url: "/api/search",
});

export default function Search() {
  return (
    <InstantSearch searchClient={searchClient} indexName="vendure-variants">
      <div>
        <div>
          <div>
            <h2>Suodata</h2>
            <CustomRefinementList
              title="Kategoriat"
              attribute="product-facetValueData.category"
            />
            <CustomRefinementList
              title="Brändit"
              attribute="product-facetValueData.brand"
            />
          </div>
        </div>
        <div>
          <div>
            <SearchBox placeholder="Etsi tuotteita..." />
          </div>
          <CustomHits />
        </div>
      </div>
    </InstantSearch>
  );
}
