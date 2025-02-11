import Container from "@/components/container";
import Header from "@/components/header";
import { Link } from "@/i18n/routing";
import {
  FRONT_PAGE_COLLECTION_SLUG,
  VENDURE_API_URL,
} from "@/common/constants";
import { collectionsQuery, filteredProductsQuery } from "@/common/queries";
import { request } from "graphql-request";
import type { CollectionsQuery, GetFilteredProductsQuery } from "@/gql/graphql";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";
import ProductCard from "@/components/product-card";
import { getMenuItems } from "@/common/get-menu-items";
import Heading from "@/components/heading";

type Params = Promise<{ locale: string }>;

export default async function Home(props: { params: Params }) {
  const params = await props.params;
  const t = await getTranslations("home");
  const languageCode = params.locale;
  const menuItems = await getMenuItems();

  const { collections } = await request<CollectionsQuery>(
    `${VENDURE_API_URL}?languageCode=${languageCode}`,
    collectionsQuery,
  );
  const { search: frontPageProducts } = await request<GetFilteredProductsQuery>(
    `${VENDURE_API_URL}?languageCode=${languageCode}`,
    filteredProductsQuery,
    {
      collectionSlug: FRONT_PAGE_COLLECTION_SLUG,
      term: "",
      skip: 0,
      take: 100,
      groupByProduct: true,
      priceMin: 0,
      priceMax: 1000000000,
    },
  );

  // Filter to show only root-level collections
  const rootCollections = collections.items.filter(
    (collection) =>
      collection.parent?.name === "__root_collection__" &&
      collection.slug !== FRONT_PAGE_COLLECTION_SLUG,
  );

  return (
    <Container>
      <Header menuItems={menuItems} />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <Heading level="h2" size="lg">
              {t("categories")}
            </Heading>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rootCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group block"
              >
                <div className="h-full rounded-xl border border-slate-700 bg-slate-800 p-6 transition-all duration-200 hover:border-blue-500 hover:bg-slate-800/50">
                  <Heading
                    level="h3"
                    size="md"
                    className="transition-colors duration-200 group-hover:text-blue-400"
                  >
                    {collection.name}
                  </Heading>
                  <div className="mt-4 flex items-center gap-1 text-slate-400 group-hover:text-slate-300">
                    <span>{t("browseProducts")}</span>
                    <ChevronRightIcon className="h-4 w-4 stroke-2 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {frontPageProducts.items.length > 0 && (
            <div className="mt-24">
              <div className="flex justify-center">
                <Heading level="h2" size="lg">
                  {t("featuredProducts")}
                </Heading>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {frontPageProducts.items.map((product) => (
                  <ProductCard
                    key={product.slug}
                    slug={product.slug}
                    name={product.productName}
                    imageSource={product.productAsset?.preview || ""}
                    priceWithTax={
                      "min" in product.priceWithTax
                        ? product.priceWithTax?.min
                        : product.priceWithTax.value
                    }
                    hasVariantPrices={
                      "min" in product.priceWithTax &&
                      product.priceWithTax.min !== product.priceWithTax.max
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </Container>
  );
}
