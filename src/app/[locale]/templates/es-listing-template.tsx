"use client";

import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";
import { useRefinementList } from "react-instantsearch";
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
              attribute="product-facetValueSlugs"
            />
            <CustomRefinementList
              title="Brändit"
              attribute="product-facetValueSlugs"
            />
          </div>
        </div>
        <div>
          <div>
            <SearchBox placeholder="Etsi tuotteita..." />
          </div>
          <Hits />
        </div>
      </div>
    </InstantSearch>
  );
}
