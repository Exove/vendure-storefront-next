import { MetadataRoute } from "next";
import { NEXT_PUBLIC_URL, VENDURE_API_URL } from "@/common/constants";
import { request } from "graphql-request";
import { gql } from "graphql-tag";

interface SlugsResponse {
  products: {
    items: Array<{ slug: string }>;
  };
  collections: {
    items: Array<{ slug: string }>;
  };
}

const getAllSlugsQuery = gql`
  query GetAllSlugs {
    products {
      items {
        slug
      }
    }
    collections {
      items {
        slug
      }
    }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = NEXT_PUBLIC_URL;

  // Fetch all slugs for dynamic routes
  const { products, collections } = await request<SlugsResponse>(
    VENDURE_API_URL,
    getAllSlugsQuery,
  );

  // Basic routes without locale prefix
  const routes = ["", "/checkout", "/account", "/register", "/login"];

  // Language versions (fi, en)
  const locales = ["fi", "en"];

  // Generate sitemap entries for static routes
  const staticEntries = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          fi: `${baseUrl}/fi${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    })),
  );

  // Generate sitemap entries for dynamic product routes
  const productEntries = locales.flatMap((locale) =>
    products.items.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.8,
      alternates: {
        languages: {
          fi: `${baseUrl}/fi/products/${product.slug}`,
          en: `${baseUrl}/en/products/${product.slug}`,
        },
      },
    })),
  );

  // Generate sitemap entries for dynamic collection routes
  const collectionEntries = locales.flatMap((locale) =>
    collections.items.map((collection) => ({
      url: `${baseUrl}/${locale}/collections/${collection.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.8,
      alternates: {
        languages: {
          fi: `${baseUrl}/fi/collections/${collection.slug}`,
          en: `${baseUrl}/en/collections/${collection.slug}`,
        },
      },
    })),
  );

  return [...staticEntries, ...productEntries, ...collectionEntries];
}
