"use client";

import { InstantSearch } from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";
import { useRefinementList, useHits } from "react-instantsearch";
import React from "react";
import type { Hit } from "instantsearch.js";
import { SearchHit } from "@/components/searchbox";

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
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <label className="flex cursor-pointer">
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
              <span className="ml-auto">({item.count})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CustomHits = () => {
  const { items } = useHits();

  const typedHits = items as unknown as Hit<SearchHit>[];

  // Group hits by slug
  const uniqueItems = new Map();
  typedHits.forEach((hit) => {
    if (!uniqueItems.has(hit.slug)) {
      uniqueItems.set(hit.slug, hit);
    }
  });
  const uniqueHits = Array.from(uniqueItems.values());

  return (
    <div>
      <h3>Tuotteet</h3>
      <div className="grid grid-cols-3 gap-5">
        {uniqueHits.map((hit) => (
          <div
            key={hit.objectID}
            className="rounded border border-gray-900 p-4"
          >
            <h4>{hit.productVariantName}</h4>

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
      <div className="flex gap-32">
        <div className="flex flex-col gap-5">
          <CustomRefinementList
            title="Kategoriat"
            attribute="product-category"
          />
          <CustomRefinementList title="Brändit" attribute="product-brand" />
        </div>
        <div>
          <CustomHits />
        </div>
      </div>
    </InstantSearch>
  );
}
