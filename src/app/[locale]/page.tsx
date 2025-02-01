import Container from "@/components/container";
import Header from "@/components/header";
import ListingTemplate from "./templates/listing-template";
import { getFilteredProductsAction } from "./actions";
import { SearchResult } from "@/gql/graphql";
import { FacetValue } from "@/gql/graphql";

type Params = Promise<{ locale: string }>;

export default async function Home(props: { params: Params }) {
  const { locale: languageCode } = await props.params;
  console.log("languageCode", languageCode);
  // const data = await request(
  //   `${VENDURE_API_URL}?languageCode=${languageCode}`,
  //   productsQuery,
  // );

  const filteredProducts = await getFilteredProductsAction(
    "",
    0,
    100,
    [],
    true,
  );

  console.log("filteredProducts", filteredProducts);

  return (
    <Container>
      <Header />
      <ListingTemplate
        facets={
          filteredProducts.facetValues as {
            count: number;
            facetValue: FacetValue;
          }[]
        }
        products={filteredProducts.items as SearchResult[]}
        title="Elektronikka ja kodinkoneet"
      />
    </Container>
  );
}
