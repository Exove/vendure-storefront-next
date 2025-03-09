import { Client } from "@elastic/elasticsearch";
import { NextResponse } from "next/server";

// Elasticsearch-asiakas
const esClient = new Client({
  node: "http://localhost:9200", // Vaihda oikeaan Elasticsearch-osoitteeseen
});

// Elasticsearch tulosten tyypit
interface ESSource {
  productVariantName?: string;
  slug?: string;
  [key: string]: unknown;
}

interface ESAggregation {
  buckets: Array<{
    key: string;
    doc_count: number;
  }>;
}

interface ESAggregations {
  categories?: ESAggregation;
  brands?: ESAggregation;
}

// Hakutietojen tyyppi pyynnössä
interface SearchParams {
  selectedCategories?: string[];
  selectedBrands?: string[];
}

export async function POST(request: Request) {
  try {
    // Haetaan hakuparametrit pyynnöstä
    const searchParams: SearchParams = await request.json();
    const { selectedCategories = [], selectedBrands = [] } = searchParams;

    // Rakennetaan kyselyobjekti
    const query = {
      bool: {
        must: [{ match_all: {} }],
        filter: [] as object[],
      },
    };

    // Lisää kategoria- ja brändisuodattimet jos valittuna
    if (selectedCategories.length > 0) {
      query.bool.filter.push({
        terms: { "product-category.keyword": selectedCategories },
      });
    }

    if (selectedBrands.length > 0) {
      query.bool.filter.push({
        terms: { "product-brand.keyword": selectedBrands },
      });
    }

    // Suorita haku Elasticsearchilla
    const response = await esClient.search({
      index: "vendure-variants",
      body: {
        query,
        size: 20,
        aggs: {
          categories: {
            terms: { field: "product-category.keyword", size: 20 },
          },
          brands: {
            terms: { field: "product-brand.keyword", size: 20 },
          },
        },
      },
    });

    // Käsittele hakutulokset
    const hits = response.hits?.hits || [];
    const results = hits.map((hit) => ({
      id: hit._id as string,
      productVariantName: (hit._source as ESSource)?.productVariantName || "",
      slug: (hit._source as ESSource)?.slug || "",
    }));

    // Käsittele aggregaatiot (suodattimet)
    const aggregations = response.aggregations as unknown as ESAggregations;
    const categoryBuckets = aggregations?.categories?.buckets || [];
    const brandBuckets = aggregations?.brands?.buckets || [];

    // Palautetaan hakutulokset ja suodattimet
    return NextResponse.json({
      results,
      categories: categoryBuckets,
      brands: brandBuckets,
    });
  } catch (error) {
    console.error("Elasticsearch-haku epäonnistui:", error);
    return NextResponse.json(
      { error: "Hakupyyntö epäonnistui" },
      { status: 500 },
    );
  }
}
