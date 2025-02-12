import ProductTemplate from "@/app/[locale]/templates/product-template";
import { SHOP_NAME } from "@/common/constants";
import { Product } from "@/gql/graphql";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getMenuItems } from "@/common/get-menu-items";
import { getProductBySlug } from "@/common/utils-server";

type Params = Promise<{ slug: string; locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, locale: languageCode } = await params;
  const product = await getProductBySlug(slug, languageCode);

  if (!product) {
    notFound();
  }

  return {
    title: `${product.name} | ${SHOP_NAME}`,
    description: product.description,
  };
}

export default async function ProductPage(props: { params: Params }) {
  const { slug, locale: languageCode } = await props.params;
  const product = await getProductBySlug(slug, languageCode);

  if (!product) {
    notFound();
  }

  // Find the collection with the longest breadcrumb path
  const longestBreadcrumbCollection = product.collections.reduce(
    (longest, current) => {
      return current.breadcrumbs.length > longest.breadcrumbs.length
        ? current
        : longest;
    },
    product.collections[0],
  );

  // Create breadcrumb items from the collection
  const breadcrumbItems = longestBreadcrumbCollection.breadcrumbs
    .filter((crumb) => crumb.name !== "__root_collection__")
    .map((crumb) => ({
      label: crumb.name,
      href: `/${languageCode}/collections/${crumb.slug}`,
    }));

  return (
    <ProductTemplate
      product={product as Product}
      menuItems={await getMenuItems()}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
