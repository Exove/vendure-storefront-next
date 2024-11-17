import Link from "next/link";
import { API_URL } from "../common/constants";
import { activeOrderFragment, productsQuery } from "../common/queries";
import { request } from "graphql-request";
import { getActiveOrder } from "@/common/utils-server";
import { getFragmentData } from "../gql/fragment-masking";
import Container from "@/components/container";
import Header from "@/components/header";

export default async function Home() {
  const { products } = await request(API_URL, productsQuery);

  const activeOrder = getFragmentData(
    activeOrderFragment,
    await getActiveOrder(),
  );

  return (
    <Container>
      <Header />
      <div className="max-w-screen-md mx-auto py-20">
        {products?.items.map((product) => (
          <div key={product.name} className="border-b border-gray-200 py-4">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </div>
        ))}
      </div>
    </Container>
  );
}
