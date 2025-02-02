import Container from "@/components/container";
import Header from "@/components/header";
import { Link } from "@/i18n/routing";
import { VENDURE_API_URL } from "@/common/constants";
import { collectionsQuery } from "@/common/queries";
import { request } from "graphql-request";
import type { CollectionsQuery } from "@/gql/graphql";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";

export default async function Home(props: {
  params: Promise<{ locale: string }>;
  searchParams: { page?: string };
}) {
  const { locale: languageCode } = await props.params;
  const { collections } = await request<CollectionsQuery>(
    `${VENDURE_API_URL}?languageCode=${languageCode}`,
    collectionsQuery,
  );
  const t = await getTranslations("home");

  // Filter to show only root-level collections
  const rootCollections = collections.items.filter(
    (collection) => collection.parent?.name === "__root_collection__",
  );

  return (
    <Container>
      <Header />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-100">
            {t("categories")}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rootCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group block"
              >
                <div className="h-full rounded-xl border border-slate-700 bg-slate-800 p-6 transition-all duration-200 hover:border-blue-500 hover:bg-slate-800/50">
                  <h3 className="text-xl font-semibold text-slate-100 transition-colors duration-200 group-hover:text-blue-400">
                    {collection.name}
                  </h3>
                  <div className="mt-4 flex items-center gap-1 text-slate-400 group-hover:text-slate-300">
                    <span>{t("browseProducts")}</span>
                    <ChevronRightIcon className="h-4 w-4 stroke-2 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Container>
  );
}
