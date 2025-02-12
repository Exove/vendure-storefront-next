import { FRONT_PAGE_COLLECTION_SLUG } from "@/common/constants";
import { getFilteredProducts, getCollections } from "@/common/utils-server";
import { getMenuItems } from "@/common/get-menu-items";
import FrontPageTemplate from "./templates/front-page-template";

type Params = Promise<{ locale: string }>;

export default async function Home(props: { params: Params }) {
  const params = await props.params;
  const languageCode = params.locale;
  const menuItems = await getMenuItems();

  const collections = await getCollections(languageCode);
  const filteredCollections = {
    ...collections,
    items: collections.items.filter(
      (collection) =>
        collection.parent?.name === "__root_collection__" &&
        collection.slug !== FRONT_PAGE_COLLECTION_SLUG,
    ),
  };

  const frontPageProducts = await getFilteredProducts(
    FRONT_PAGE_COLLECTION_SLUG,
    "",
    0,
    100,
    [],
    true,
    0,
    1000000000,
    undefined,
    languageCode,
  );

  return (
    <FrontPageTemplate
      collections={filteredCollections}
      frontPageProducts={frontPageProducts}
      menuItems={menuItems}
    />
  );
}
