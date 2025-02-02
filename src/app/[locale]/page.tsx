import Container from "@/components/container";
import Header from "@/components/header";
import { Link } from "@/i18n/routing";
import { VENDURE_API_URL } from "@/common/constants";
import { collectionsQuery } from "@/common/queries";
import { request } from "graphql-request";
import type { CollectionsQuery } from "@/gql/graphql";

export default async function Home(props: {
  params: Promise<{ locale: string }>;
  searchParams: { page?: string };
}) {
  const { locale: languageCode } = await props.params;
  const { collections } = await request<CollectionsQuery>(
    `${VENDURE_API_URL}?languageCode=${languageCode}`,
    collectionsQuery,
  );

  // Filter to show only root-level collections
  const rootCollections = collections.items.filter(
    (collection) => collection.parent?.name === "__root_collection__",
  );

  return (
    <Container>
      <Header />
      <div className="py-8">
        <h2 className="mb-6 text-2xl font-bold">Kokoelmat</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rootCollections.map((collection) => (
            <div
              key={collection.id}
              className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              <Link href={`/collections/${collection.slug}`} className="block">
                <h3 className="mb-2 text-xl font-semibold">
                  {collection.name}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
