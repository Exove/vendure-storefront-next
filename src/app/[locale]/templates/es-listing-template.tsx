"use client";

import React, { useCallback } from "react";
import useSWR from "swr";
import {
  searchElasticsearchAction,
  ElasticsearchSearchParams,
} from "../es-actions";
import { useState } from "react";

export default function Search() {
  // Tilamuuttujat
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // SWR hook hakutulosten hakemiseen
  const { data, isLoading } = useSWR(
    ["elasticsearch-search", selectedCategories, selectedBrands],
    () =>
      searchElasticsearchAction({
        selectedCategories,
        selectedBrands,
      } as ElasticsearchSearchParams),
    {
      keepPreviousData: true, // Tämä pitää edelliset tulokset näkyvillä uuden haun aikana
      revalidateOnFocus: false,
    },
  );

  // Haetaan tulokset ja suodattimet datasta
  const searchResults = data?.results || [];
  const categories = data?.categories || [];
  const brands = data?.brands || [];

  // Kategorian valinta (optimistiset päivitykset)
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      return newCategories;
    });
  }, []);

  // Brändin valinta (optimistiset päivitykset)
  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) => {
      const newBrands = prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand];

      return newBrands;
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl">Tuotehaku</h1>

      <div className="flex gap-8">
        {/* Suodattimet */}
        <div className="w-1/4">
          {/* Kategoriat */}
          <div className="mb-6">
            <h3 className="mb-2 font-bold">Kategoriat</h3>
            <ul>
              {categories.map((category) => (
                <li key={category.key} className="mb-1">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.key)}
                      onChange={() => toggleCategory(category.key)}
                      className="mr-2"
                    />
                    <span>{category.key}</span>
                    <span className="ml-auto text-gray-500">
                      ({category.doc_count})
                    </span>
                  </label>
                </li>
              ))}
              {categories.length === 0 && !isLoading && (
                <li>Ei kategorioita saatavilla</li>
              )}
            </ul>
          </div>

          {/* Brändit */}
          <div>
            <h3 className="mb-2 font-bold">Brändit</h3>
            <ul>
              {brands.map((brand) => (
                <li key={brand.key} className="mb-1">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.key)}
                      onChange={() => toggleBrand(brand.key)}
                      className="mr-2"
                    />
                    <span>{brand.key}</span>
                    <span className="ml-auto text-gray-500">
                      ({brand.doc_count})
                    </span>
                  </label>
                </li>
              ))}
              {brands.length === 0 && !isLoading && (
                <li>Ei brändejä saatavilla</li>
              )}
            </ul>
          </div>
        </div>

        {/* Hakutulokset */}
        <div className="w-3/4">
          <h3 className="mb-4 font-bold">Tuotteet</h3>
          {isLoading && !data && <p>Ladataan hakutuloksia...</p>}
          <div className="grid grid-cols-3 gap-4">
            {searchResults.length === 0 ? (
              <p>Ei hakutuloksia</p>
            ) : (
              searchResults.map((result) => (
                <div key={result.id} className="rounded border p-4">
                  <h4 className="mb-2 font-medium">
                    {result.productVariantName}
                  </h4>
                  <p className="text-sm text-gray-600">Slug: {result.slug}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
