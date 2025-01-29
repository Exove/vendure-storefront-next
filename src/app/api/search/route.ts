import Client from "@searchkit/api";
import { NextRequest, NextResponse } from "next/server";

const apiConfig = {
  connection: {
    host: process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST || "http://localhost:9200",
  },
  search_settings: {
    search_attributes: ["productName"],
    result_attributes: ["slug"],
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
