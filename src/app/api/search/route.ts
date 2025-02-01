import Client from "@searchkit/api";
import { NextRequest, NextResponse } from "next/server";

const apiConfig = {
  connection: {
    host: process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST || "http://localhost:9200",
  },
  search_settings: {
    analysis: {
      analyzer: {
        finnish_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "finnish_stop", "finnish_stemmer"],
        },
      },
    },
    search_attributes: [
      { field: "productName", weight: 5, analyzer: "finnish_analyzer" },
      { field: "productName.keyword", weight: 10 },
      { field: "description", weight: 1, analyzer: "finnish_analyzer" },
    ],
    result_attributes: [
      "productName",
      "slug",
      "productPreview",
      "priceWithTax",
      "collectionSlugs",
    ],
    facets: [
      {
        identifier: "collectionSlugs",
        type: "term",
        field: "collectionSlugs",
        size: 10,
      },
    ],
  },
};

const apiClient = Client(apiConfig);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const results = await apiClient.handleRequest(data);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Elasticsearch error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
