import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import RegisterTemplate from "../templates/register-template";
import Header from "@/components/header";
import Container from "@/components/container";
import { getMenuItems } from "@/common/get-menu-items";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Register");

  return {
    title: t("createAccount"),
    description: t("createAccount"),
  };
}

export default async function RegisterPage() {
  const menuItems = await getMenuItems();

  return (
    <Container>
      <Header menuItems={menuItems} />
      <RegisterTemplate />
    </Container>
  );
}
