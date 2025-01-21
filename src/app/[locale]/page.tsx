import request from "graphql-request";
import { API_URL } from "@/common/constants";
import { productsQuery } from "@/common/queries";
import Container from "@/components/container";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";

type Params = Promise<{ locale: string }>;

export default async function Home(props: { params: Params }) {
  const { locale: languageCode } = await props.params;
  const data = await request(
    `${API_URL}?languageCode=${languageCode}`,
    productsQuery,
  );

  return (
    <Container>
      <Header />
      <div className="mx-auto max-w-screen-2xl py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.products.items.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              imageSource={product.assets[0]?.source ?? ""}
              priceWithTax={product.variantList.items[0].priceWithTax}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
