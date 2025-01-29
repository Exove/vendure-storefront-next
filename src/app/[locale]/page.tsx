import Container from "@/components/container";
import Header from "@/components/header";
import ListingTemplate from "./templates/listing-template";

type Params = Promise<{ locale: string }>;

export default async function Home(props: { params: Params }) {
  const { locale: languageCode } = await props.params;

  console.log("languageCode", languageCode);

  return (
    <Container>
      <Header />
      <ListingTemplate />
    </Container>
  );
}
