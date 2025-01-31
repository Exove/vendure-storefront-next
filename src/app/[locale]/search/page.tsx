import Container from "@/components/container";
import Header from "@/components/header";
import SearchTemplate from "../templates/search-template";

type Params = Promise<{ locale: string }>;

export default async function SearchPage(props: { params: Params }) {
  const { locale: languageCode } = await props.params;
  console.log("languageCode", languageCode);

  return (
    <Container>
      <Header />
      <SearchTemplate />
    </Container>
  );
}
