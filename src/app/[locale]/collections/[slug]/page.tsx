import Container from "@/components/container";
import Header from "@/components/header";
import ListingTemplate from "@/app/[locale]/templates/listing-template";
import { SearchResult } from "@/gql/graphql";
import { FacetValue } from "@/gql/graphql";
import { PRODUCTS_PER_PAGE, VENDURE_API_URL } from "@/common/constants";
import { filteredProductsQuery } from "@/common/queries";
import { request } from "graphql-request";
import { GetFilteredProductsQuery } from "@/gql/graphql";

type Params = Promise<{ locale: string; slug: string }>;

export default async function CollectionPage(props: {
  params: Params;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale: languageCode, slug: collectionSlug } = await props.params;
  const { page: pageParam } = await props.searchParams;
  const page = pageParam ? parseInt(pageParam) - 1 : 0;

  const { search } = await request<GetFilteredProductsQuery>(
    `${VENDURE_API_URL}?languageCode=${languageCode}`,
    filteredProductsQuery,
    {
      collectionSlug,
      term: "",
      skip: page * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
      groupByProduct: true,
    },
  );

  const rootCollectionName = search.collections?.find(
    (c) => c.collection.parent?.name === "__root_collection__",
  )?.collection.name;

  return (
    <Container>
      <Header />
      <ListingTemplate
        facets={
          search.facetValues as {
            count: number;
            facetValue: FacetValue;
          }[]
        }
        collectionSlug={collectionSlug || ""}
        products={search.items as SearchResult[]}
        title={rootCollectionName}
      />
    </Container>
  );
}
