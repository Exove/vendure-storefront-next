export const VENDURE_API_URL =
  process.env.NEXT_PUBLIC_VENDURE_API_URL || "http://localhost:8000/shop-api";

export const VENDURE_ROOT_URL =
  process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:8000";

export const SHOP_NAME = "Vendure Next.js";

export const PRODUCTS_PER_PAGE = 48;

export const FRONT_PAGE_COLLECTION_SLUG = "front-page";

export const HIDDEN_FACET_GROUPS = ["visibility"] as string[];
