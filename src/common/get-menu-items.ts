import { request } from "graphql-request";
import { getLocale } from "next-intl/server";
import { VENDURE_API_URL } from "@/common/constants";
import { collectionsQuery } from "@/common/queries";

export type MenuItem = {
  title: string;
  url: string;
  sublinks?: {
    title: string;
    url: string;
  }[];
};

export async function getMenuItems() {
  const locale = await getLocale();
  const { collections } = await request(
    `${VENDURE_API_URL}?languageCode=${locale}`,
    collectionsQuery,
  );

  // Filter to show only root-level collections and their children
  return collections.items
    .filter((collection) => collection.parent?.name === "__root_collection__")
    .map((collection) => ({
      title: collection.name,
      url: `/collections/${collection.slug}`,
      ...(collection.children && collection.children.length > 0
        ? {
            sublinks: collection.children.map((child) => ({
              title: child.name,
              url: `/collections/${child.slug}`,
            })),
          }
        : {}),
    }));
}
