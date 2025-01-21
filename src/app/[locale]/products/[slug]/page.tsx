import ProductTemplate from "@/app/[locale]/templates/product-template";
import { API_URL, SHOP_NAME } from "@/common/constants";
import { productBySlugQuery } from "@/common/queries";
import { Product } from "@/gql/graphql";
import { request } from "graphql-request";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Params = Promise<{ slug: string; locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, locale: languageCode } = await params;
  const { product } = await request(
    `${API_URL}?languageCode=${languageCode}`,
    productBySlugQuery,
    {
      slug: slug,
    },
  );

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
  const { product } = await request(
    `${API_URL}?languageCode=${languageCode}`,
    productBySlugQuery,
    {
      slug: slug,
    },
  );

  if (!product) {
    notFound();
  }

  return <ProductTemplate product={product as Product} />;
}
