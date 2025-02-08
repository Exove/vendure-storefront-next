import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import VerifyTemplate from "../templates/verify-template";
import Container from "@/components/container";
import Header from "@/components/header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Verify");

  return {
    title: t("verifyAccount"),
    description: t("verifyAccount"),
  };
}

export default function VerifyPage() {
  return (
    <Container>
      <Header />
      <VerifyTemplate />
    </Container>
  );
}
