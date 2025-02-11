import {
  FRONT_PAGE_COLLECTION_SLUG,
  VENDURE_API_URL,
} from "@/common/constants";
import { collectionsQuery, filteredProductsQuery } from "@/common/queries";
import { request } from "graphql-request";
import type { CollectionsQuery, GetFilteredProductsQuery } from "@/gql/graphql";
import { getMenuItems } from "@/common/get-menu-items";
import FrontPageTemplate from "./templates/front-page-template";

type Params = Promise<{ locale: string }>;

export default async function Home(props: { params: Params }) {
  const params = await props.params;
  const languageCode = params.locale;
  const menuItems = await getMenuItems();

  const { collections } = await request<CollectionsQuery>(
    `${VENDURE_API_URL}?languageCode=${languageCode}`,
    collectionsQuery,
  );
  const filteredCollections = {
    ...collections,
    items: collections.items.filter(
      (collection) => collection.slug !== FRONT_PAGE_COLLECTION_SLUG,
    ),
  };
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

  return (
    <FrontPageTemplate
      collections={filteredCollections}
      frontPageProducts={frontPageProducts}
      menuItems={menuItems}
    />
  );
}
