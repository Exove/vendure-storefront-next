"use client";

import React, { useEffect, useState } from "react";

// Tyypit hakutuloksille ja suodattimille
interface ProductSearchHit {
  productVariantName: string;
  slug: string;
  id: string;
}

interface FilterOption {
  key: string;
  doc_count: number;
}

export default function Search() {
  // Tilamuuttujat
  const [searchResults, setSearchResults] = useState<ProductSearchHit[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [brands, setBrands] = useState<FilterOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Suorita haku valituilla suodattimilla
  const performSearch = async () => {
    setIsLoading(true);

    try {
      // Käytetään API-reittiä hakuun
      const response = await fetch("/api/elasticsearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedCategories,
          selectedBrands,
        }),
      });

      if (!response.ok) {
        throw new Error("Hakupyyntö epäonnistui");
      }

      const data = await response.json();

      setSearchResults(data.results);
      setCategories(data.categories);
      setBrands(data.brands);
    } catch (error) {
      console.error("Haku epäonnistui:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Kategorian valinta
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // Brändin valinta
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  // Suoritetaan haku kun sivu latautuu tai suodattimet muuttuvat
  useEffect(() => {
    performSearch();
  }, [selectedCategories, selectedBrands]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl">Tuotehaku</h1>

      <div className="flex gap-8">
        {/* Suodattimet */}
        <div className="w-1/4">
          {/* Kategoriat */}
          <div className="mb-6">
            <h3 className="mb-2 font-bold">Kategoriat</h3>
            {isLoading ? (
              <p>Ladataan...</p>
            ) : (
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
              </ul>
            )}
          </div>

          {/* Brändit */}
          <div>
            <h3 className="mb-2 font-bold">Brändit</h3>
            {isLoading ? (
              <p>Ladataan...</p>
            ) : (
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
              </ul>
            )}
          </div>
        </div>

        {/* Hakutulokset */}
        <div className="w-3/4">
          <h3 className="mb-4 font-bold">Tuotteet</h3>
          {isLoading ? (
            <p>Ladataan hakutuloksia...</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
