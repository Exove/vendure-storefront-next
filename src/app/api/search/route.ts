import Client from "@searchkit/api";
import { NextRequest, NextResponse } from "next/server";

const apiConfig = {
  connection: {
    host: process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST || "http://localhost:9200",
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME!,
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
  },
  search_settings: {
    search_attributes: [
      { field: "productVariantName", weight: 3 },
      { field: "slug", weight: 2 },
    ],
    result_attributes: [
      "productVariantName",
      "slug",
      "collectionSlugs",
      "facetIds",
      "facetValueIds",
      "product-facetValueData",
    ],
    facet_attributes: [
      {
        attribute: "collectionSlugs",
        field: "collectionSlugs.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
      {
        attribute: "facetIds",
        field: "facetIds.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
      {
        attribute: "facetValueIds",
        field: "facetValueIds.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
      {
        attribute: "product-facetValueSlugs",
        field: "product-facetValueSlugs.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
      {
        attribute: "product-facetValueData.category",
        field: "product-facetValueData.category.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
      {
        attribute: "product-facetValueData.brand",
        field: "product-facetValueData.brand.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
    ],
  },
};

const apiClient = Client(apiConfig);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const results = await apiClient.handleRequest(data);
  return NextResponse.json(results);
}
