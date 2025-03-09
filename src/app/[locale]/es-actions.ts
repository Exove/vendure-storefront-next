"use server";

import { Client } from "@elastic/elasticsearch";

// ES-hakuparametrien tyyppi
export interface ElasticsearchSearchParams {
  selectedCategories?: string[];
  selectedBrands?: string[];
}

// ES-vastaustyypit
interface ESSource {
  productVariantName?: string;
  productName?: string;
  slug?: string;
  [key: string]: unknown;
}

interface ESHit {
  _id: string;
  _source: ESSource;
}

interface ESBucket {
  key: string;
  doc_count: number;
  distinct_slugs?: {
    value: number;
  };
}

interface ESAggregations {
  categories?: {
    buckets: ESBucket[];
  };
  brands?: {
    buckets: ESBucket[];
  };
}

export const searchElasticsearchAction = async (
  searchParams: ElasticsearchSearchParams,
) => {
  const { selectedCategories = [], selectedBrands = [] } = searchParams;

  // Elasticsearch-client
  const esClient = new Client({
    node: "http://localhost:9200", // Vaihda oikeaan Elasticsearch-osoitteeseen
  });

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
          aggs: {
            distinct_slugs: {
              cardinality: {
                field: "slug.keyword",
              },
            },
          },
        },
        brands: {
          terms: { field: "product-brand.keyword", size: 20 },
          aggs: {
            distinct_slugs: {
              cardinality: {
                field: "slug.keyword",
              },
            },
          },
        },
      },
      collapse: {
        field: "slug.keyword",
        inner_hits: {
          name: "variants",
          size: 10,
        },
      },
    },
  });

  // Käsittele hakutulokset
  const hits = (response.hits?.hits as ESHit[]) || [];
  const results = hits.map((hit) => ({
    id: hit._id,
    productVariantName: hit._source?.productVariantName || "",
    productName: hit._source?.productName || "",
    slug: hit._source?.slug || "",
  }));

  // Käsittele aggregaatiot (suodattimet)
  const aggregations = response.aggregations as ESAggregations;
  const categoryBuckets = aggregations?.categories?.buckets || [];
  const brandBuckets = aggregations?.brands?.buckets || [];

  // Päivitetään suodattimien doc_count arvot käyttämään distinct_slugs-arvoa
  const categoryFilters = categoryBuckets.map((bucket) => ({
    key: bucket.key,
    doc_count: bucket.distinct_slugs?.value || bucket.doc_count,
  }));

  const brandFilters = brandBuckets.map((bucket) => ({
    key: bucket.key,
    doc_count: bucket.distinct_slugs?.value || bucket.doc_count,
  }));

  // Palautetaan hakutulokset ja suodattimet
  return {
    results,
    categories: categoryFilters,
    brands: brandFilters,
  };
};
