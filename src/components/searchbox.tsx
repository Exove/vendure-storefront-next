"use client";

import { InstantSearch, useSearchBox, useHits } from "react-instantsearch";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import createClient from "@searchkit/instantsearch-client";
import { VENDURE_ROOT_URL } from "@/common/constants";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Hit } from "instantsearch.js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/common/utils";

interface SearchHit {
  slug: string;
  productName: string;
  productPreview: string;
  priceWithTax: number;
  collectionSlugs: string[];
}

interface SearchRequest {
  params?: {
    query?: string;
  };
}

const searchClient = {
  ...createClient({
    url: "/api/search",
  }),
  search(requests: SearchRequest[]) {
    const shouldSearch = requests.some(
      (request) => request.params?.query && request.params.query.length > 0,
    );

    if (!shouldSearch) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return createClient({ url: "/api/search" }).search(requests);
  },
};

function SearchComponent() {
  const { refine } = useSearchBox();
  const { items } = useHits();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("common");

  const typedHits = items as unknown as Hit<SearchHit>[];

  // Group hits by slug
  const uniqueItems = new Map();
  typedHits.forEach((hit) => {
    if (!uniqueItems.has(hit.slug)) {
      uniqueItems.set(hit.slug, hit);
    }
  });
  const uniqueHits = Array.from(uniqueItems.values());

  // Close search results when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        refine("");
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [refine]);

  return (
    <div className="search-container relative mx-auto w-full max-w-lg">
      <Combobox
        onChange={(hit: SearchHit | null) => {
          if (hit) {
            router.push(`/en/products/${hit.slug}`);
          }
        }}
        onClose={() => {
          setIsOpen(false);
          setQuery("");
          refine("");
        }}
      >
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-slate-800 text-left focus:outline-none">
            <ComboboxInput
              className="w-full border-none bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:ring-0"
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                setQuery(value);
                refine(value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
          {isOpen && query.trim().length > 0 && (
            <ComboboxOptions
              static
              className="absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-md bg-slate-800 py-1 shadow-xl shadow-slate-900/50 ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {uniqueHits.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-400">
                  {t("noResults")}
                </div>
              ) : (
                uniqueHits.map((hit, index) => (
                  <ComboboxOption
                    key={`${hit.slug}-${index}`}
                    value={hit}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                        active ? "bg-slate-700 text-white" : "text-gray-200"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={`${VENDURE_ROOT_URL}/assets/${hit.productPreview}`}
                        alt={hit.productName}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {hit.productName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatCurrency(hit.priceWithTax)}
                        </div>
                      </div>
                    </div>
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>
    </div>
  );
}

export default function SearchBox() {
  return (
    <InstantSearch searchClient={searchClient} indexName="vendure-variants">
      <SearchComponent />
    </InstantSearch>
  );
}
