import Link from "next/link";
import { API_URL } from "../common/constants";
import { productsQuery } from "../common/queries";
import { request } from "graphql-request";
import Container from "@/components/container";
import Header from "@/components/header";
import { formatCurrency } from "@/common/utils";
import Image from "next/image";

export default async function Home() {
  const { products } = await request(API_URL, productsQuery);

  return (
    <Container>
      <Header />
      <div className="mx-auto max-w-screen-2xl py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.items.map((product) => (
            <Link
              href={`/products/${product.slug}`}
              key={product.name}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-700 transition-all hover:border-blue-500"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.assets[0].source}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-slate-400">
                  {product.collections[0]?.name}
                </p>
                <p className="mt-auto text-lg font-semibold text-blue-400">
                  {formatCurrency(product.variantList.items[0].priceWithTax)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
