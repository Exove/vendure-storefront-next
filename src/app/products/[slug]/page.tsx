import ProductTemplate from "@/app/templates/product-template";
import { API_URL } from "@/common/constants";
import { productBySlugQuery } from "@/common/queries";
import { Product } from "@/gql/graphql";
import { request } from "graphql-request";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

export default async function ProductPage(props: { params: Params }) {
  const { slug } = await props.params;
  const { product } = await request(API_URL, productBySlugQuery, {
    slug: slug,
  });

  if (!product) {
    notFound();
  }

  return <ProductTemplate product={product as Product} />;
}
