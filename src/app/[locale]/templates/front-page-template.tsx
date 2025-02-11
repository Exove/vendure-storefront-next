import Container from "@/components/container";
import Header from "@/components/header";
import { Link } from "@/i18n/routing";
import ProductCard from "@/components/product-card";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/heading";
import type { CollectionsQuery, GetFilteredProductsQuery } from "@/gql/graphql";
import { MenuItem } from "@/common/get-menu-items";
import { useTranslations } from "next-intl";

interface FrontPageTemplateProps {
  collections: CollectionsQuery["collections"];
  frontPageProducts: GetFilteredProductsQuery["search"];
  menuItems: MenuItem[];
}

export default function FrontPageTemplate({
  collections,
  frontPageProducts,
  menuItems,
}: FrontPageTemplateProps) {
  const t = useTranslations("home");

  // Filter to show only root-level collections
  const rootCollections = collections.items.filter(
    (collection) =>
      collection.parent?.name === "__root_collection__" &&
      collection.slug !== "front-page-products",
  );

  return (
    <Container>
      <Header menuItems={menuItems} frontPage />
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
