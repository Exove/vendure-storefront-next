"use client";

import {
  FacetValue,
  SearchResult,
  SearchResultSortParameter,
  SortOrder,
} from "@/gql/graphql";
import { useState, useEffect } from "react";
import { getFilteredProductsAction } from "../actions";
import ProductCard from "@/components/product-card";
import { useTranslations } from "next-intl";
import { PRODUCTS_PER_PAGE } from "@/common/constants";
import { useSearchParams } from "next/navigation";
import SidePanel from "@/components/side-panel";
import { ChevronLeftIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ProductFilters from "@/components/product-filters";
import SortSelect from "@/components/sort-select";
import { Link } from "@/i18n/routing";
import Heading from "@/components/heading";

interface ListingTemplateProps {
  products: SearchResult[];
  facets: {
    count: number;
    facetValue: FacetValue;
  }[];
  title?: string;
  collectionSlug: string;
  parentCollection?: string;
  parentCollectionSlug?: string;
}

export default function ListingTemplate({
  products: initialProducts,
  facets,
  title,
  collectionSlug,
  parentCollection,
  parentCollectionSlug,
}: ListingTemplateProps) {
  const t = useTranslations("listing");
  const searchParams = useSearchParams();

  // Parse URL parameters
  const getInitialFacets = () => {
    const facetsFromUrl: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("facet_")) {
        const groupName = key.replace("facet_", "");
        facetsFromUrl[groupName] = value.split(",");
      }
    });
    return facetsFromUrl;
  };

  const getInitialPriceRange = () => {
    return {
      min: searchParams.get("min_price")
        ? Number(searchParams.get("min_price"))
        : null,
      max: searchParams.get("max_price")
        ? Number(searchParams.get("max_price"))
        : null,
    };
  };

  const getInitialSortOrder = () => {
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    if (
      sort &&
      order &&
      (order === SortOrder.Asc || order === SortOrder.Desc)
    ) {
      return { [sort]: order };
    }
    return {};
  };

  const getInitialFirstSelectedGroup = () => {
    return searchParams.get("first_group");
  };

  const getInitialPage = () => {
    const page = searchParams.get("page");
    return page ? parseInt(page) : 1;
  };

  const [selectedFacets, setSelectedFacets] =
    useState<Record<string, string[]>>(getInitialFacets());
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>(getInitialPriceRange());
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [products, setProducts] = useState(initialProducts);
  const [currentFacets, setCurrentFacets] = useState(facets);
  const [originalFacets] = useState(facets);
  const [firstSelectedGroup, setFirstSelectedGroup] = useState<string | null>(
    getInitialFirstSelectedGroup(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SearchResultSortParameter>(
    getInitialSortOrder(),
  );
  const [userAction, setUserAction] = useState(false);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    // Add facets to URL
    Object.entries(selectedFacets).forEach(([groupName, values]) => {
      if (values.length > 0) {
        params.set(`facet_${groupName}`, values.join(","));
      }
    });

    // Add price range to URL
    if (priceRange.min !== null)
      params.set("min_price", priceRange.min.toString());
    if (priceRange.max !== null)
      params.set("max_price", priceRange.max.toString());

    // Add sort order to URL
    if (Object.keys(sortOrder).length > 0) {
      const [sort, order] = Object.entries(sortOrder)[0];
      if (order) {
        params.set("sort", sort);
        params.set("order", order.toString());
      }
    }

    // Add first selected group to URL
    if (firstSelectedGroup) {
      params.set("first_group", firstSelectedGroup);
    }

    // Add page to URL
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    // Update URL without triggering a page reload
    const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [selectedFacets, priceRange, sortOrder, firstSelectedGroup, currentPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      // Convert selectedFacets into API format where each facet group's values are combined with OR,
      // and different groups are implicitly combined with AND
      const facetFilters = Object.entries(selectedFacets)
        .filter(([, group]) => group.length > 0)
        .reduce<{ or: string[] }[]>((acc, [, group]) => {
          if (group.length > 0) {
            acc.push({ or: group });
          }
          return acc;
        }, []);

      const results = await getFilteredProductsAction(
        collectionSlug,
        "",
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        PRODUCTS_PER_PAGE,
        facetFilters,
        true,
        priceRange.min !== null ? priceRange.min * 100 : null,
        priceRange.max !== null ? priceRange.max * 100 : null,
        sortOrder,
      );

      setProducts(results.items as SearchResult[]);

      // If the user has made an action (page change), scroll to the right place
      if (userAction) {
        const element = document.getElementById("listing-view");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        setUserAction(false);
      }

      // If results are empty and we have more than one facet group selected,
      // keep only the first selected group
      if (
        results.items.length === 0 &&
        Object.keys(selectedFacets).length > 1
      ) {
        const firstGroup = Object.entries(selectedFacets).find(
          ([, values]) => values.length > 0,
        );
        if (firstGroup) {
          const [groupName, groupValues] = firstGroup;
          setSelectedFacets({ [groupName]: groupValues });
          return; // Early return to trigger useEffect again with updated selectedFacets
        }
      }

      // Update firstSelectedGroup based on the current state of selectedFacets
      const selectedGroups = Object.entries(selectedFacets).filter(
        ([, values]) => values.length > 0,
      );

      const newFirstSelectedGroup =
        selectedGroups.length === 1
          ? selectedGroups[0][0]
          : selectedGroups.length === 0
            ? null
            : firstSelectedGroup;

      setFirstSelectedGroup(newFirstSelectedGroup);
      setCurrentFacets(results.facetValues as typeof facets);
      setIsLoading(false);
    };

    fetchProducts();
  }, [
    selectedFacets,
    firstSelectedGroup,
    priceRange,
    sortOrder,
    currentPage,
    userAction,
    collectionSlug,
  ]);

  const handleFacetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facetId = e.target.value;
    const groupName =
      facets.find((f) => f.facetValue.id === facetId)?.facetValue.facet.name ||
      "";

    const newSelectedFacets = {
      ...selectedFacets,
      [groupName]: e.target.checked
        ? [...(selectedFacets[groupName] || []), facetId]
        : (selectedFacets[groupName] || []).filter((id) => id !== facetId),
    };

    // If all filters are removed, return the original products without a new fetch
    const hasAnyFilters = Object.values(newSelectedFacets).some(
      (group) => group.length > 0,
    );
    if (!hasAnyFilters && !priceRange.min && !priceRange.max) {
      setIsLoading(false);
      setProducts(initialProducts);
      setCurrentFacets(originalFacets);
      setSelectedFacets({});
      setFirstSelectedGroup(null);
      return;
    }

    setSelectedFacets(newSelectedFacets);

    // Update firstSelectedGroup immediately
    const selectedGroups = Object.entries(newSelectedFacets).filter(
      ([, values]) => values.length > 0,
    );
    const newFirstSelectedGroup =
      selectedGroups.length === 1
        ? selectedGroups[0][0]
        : selectedGroups.length === 0
          ? null
          : firstSelectedGroup;
    setFirstSelectedGroup(newFirstSelectedGroup);
  };

  const handleClearFilters = () => {
    setSelectedFacets({});
    setFirstSelectedGroup(null);
    setProducts(initialProducts);
    setCurrentFacets(facets);
    setPriceRange({ min: null, max: null });
    setCurrentPage(1);
  };

  return (
    <div>
      {title && (
        <div className="relative mb-16 mt-6 rounded-xl bg-slate-800 px-10 py-24 text-center">
          {parentCollection &&
            parentCollectionSlug &&
            parentCollectionSlug !== "__root_collection__" && (
              <Link
                href={`/collections/${parentCollectionSlug}`}
                className="absolute left-10 top-8 flex items-center gap-2 text-sm text-slate-300 hover:text-white"
              >
                <ChevronLeftIcon className="h-4 w-4 stroke-2" />
                {parentCollection}
              </Link>
            )}
          <Heading level="h1" size="xl" className="font-black">
            {title}
          </Heading>
        </div>
      )}
      <div className="mt-10 gap-16 lg:flex" id="listing-view">
        {/* Desktop filters */}
        <div className="hidden w-[200px] lg:block">
          <ProductFilters
            facets={facets}
            selectedFacets={selectedFacets}
            onFacetChange={handleFacetChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            onClearFilters={handleClearFilters}
            currentFacets={currentFacets}
            originalFacets={originalFacets}
            firstSelectedGroup={firstSelectedGroup}
            isLoading={isLoading}
          />
        </div>

        {/* Product listing */}
        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="mb-6 flex items-center justify-between lg:justify-end">
            <div className="lg:hidden">
              <SidePanel
                openLabel={
                  <button className="flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800">
                    <FunnelIcon className="h-5 w-5" />
                    {t("filters")}
                  </button>
                }
                title={t("filters")}
                position="left"
              >
                <div className="max-w-[300px]">
                  <ProductFilters
                    facets={facets}
                    selectedFacets={selectedFacets}
                    onFacetChange={handleFacetChange}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    onClearFilters={handleClearFilters}
                    currentFacets={currentFacets}
                    originalFacets={originalFacets}
                    firstSelectedGroup={firstSelectedGroup}
                    isLoading={isLoading}
                    isMobile
                  />
                </div>
              </SidePanel>
            </div>
            <SortSelect sortOrder={sortOrder} onSortChange={setSortOrder} />
          </div>

          <ul className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <li key={index}>
                {product.slug && (
                  <ProductCard
                    slug={product.slug}
                    name={product.productName}
                    imageSource={product.productAsset?.preview ?? ""}
                    priceWithTax={
                      "min" in product.priceWithTax
                        ? product.priceWithTax.min
                        : product.priceWithTax.value
                    }
                    hasVariantPrices={
                      "min" in product.priceWithTax &&
                      product.priceWithTax.min !== product.priceWithTax.max
                    }
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Pagination controls */}
          {(currentPage > 1 || products.length === PRODUCTS_PER_PAGE) && (
            <div className="mt-8 flex justify-center gap-2">
              {currentPage > 1 && (
                <button
                  onClick={() => {
                    setUserAction(true);
                    setCurrentPage(currentPage - 1);
                  }}
                  className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
                >
                  {t("previousPage")}
                </button>
              )}
              <span className="flex items-center px-4 text-sm">
                {t("page")} {currentPage}
              </span>
              {products.length === PRODUCTS_PER_PAGE && (
                <button
                  onClick={() => {
                    setUserAction(true);
                    setCurrentPage(currentPage + 1);
                  }}
                  className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
                >
                  {t("nextPage")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
