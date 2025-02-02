import Container from "@/components/container";
import Header from "@/components/header";
import ListingTemplate from "@/app/[locale]/templates/listing-template";
import { getFilteredProductsAction } from "@/app/[locale]/actions";
import { SearchResult } from "@/gql/graphql";
import { FacetValue } from "@/gql/graphql";
import { PRODUCTS_PER_PAGE } from "@/common/constants";
type Params = Promise<{ locale: string }>;

export default async function CollectionPage(props: {
  params: Params;
  searchParams: { page?: string };
}) {
  const { locale: languageCode } = await props.params;
  const page = props.searchParams.page
    ? parseInt(props.searchParams.page) - 1
    : 0;
  console.log("languageCode", languageCode);

  const filteredProducts = await getFilteredProductsAction(
    "",
    page * PRODUCTS_PER_PAGE,
    PRODUCTS_PER_PAGE,
    [],
    true,
  );

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
        title="Elektroniikka ja kodinkoneet"
      />
    </Container>
  );
}
