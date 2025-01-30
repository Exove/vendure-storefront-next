"use client";

import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
} from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";
import ProductCard from "@/components/product-card";
import { VENDURE_ROOT_URL } from "@/common/constants";

const searchClient = createClient({
  url: "/api/search",
});

interface SearchHit {
  slug: string;
  productName: string;
  productPreview: string;
  priceWithTax: number;
  collectionSlugs: string[];
}

function ProductHit({ hit }: { hit: SearchHit }) {
  console.log("hit", hit);
  console.log("ROOT_URL", `${VENDURE_ROOT_URL}/assets/${hit.productPreview}`);

  return (
    <ProductCard
      slug={hit.slug}
      name={hit.productName}
      imageSource={`${VENDURE_ROOT_URL}/assets/${hit.productPreview}`}
      priceWithTax={hit.priceWithTax}
      collection={hit.collectionSlugs?.[0]}
    />
  );
}

export default function ListingTemplate() {
  return (
    <InstantSearch searchClient={searchClient} indexName="vendure-variants">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Kategoriat</h3>
              <RefinementList
                attribute="collectionSlugs"
                limit={10}
                operator="or"
                classNames={{
                  list: "space-y-2",
                  label: "flex items-center space-x-2 text-sm text-white",
                  checkbox: "h-4 w-4 rounded border-gray-300",
                  count: "ml-1 text-sm text-gray-400",
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <SearchBox
            placeholder="Etsi tuotteita..."
            classNames={{
              root: "mb-6",
              input:
                "w-full rounded-lg border-gray-700 bg-slate-800 px-4 py-2 text-white",
            }}
          />
          <Hits
            hitComponent={ProductHit}
            classNames={{
              list: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
            }}
          />
        </div>
      </div>
    </InstantSearch>
  );
}
