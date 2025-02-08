import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import RegisterTemplate from "../templates/register-template";
import Header from "@/components/header";
import Container from "@/components/container";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Register");

  return {
    title: t("createAccount"),
    description: t("createAccount"),
  };
}

export default function RegisterPage() {
  return (
    <Container>
      <Header />
      <RegisterTemplate />
    </Container>
  );
}
