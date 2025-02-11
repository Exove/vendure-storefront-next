import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import VerifyEmailTemplate from "../templates/verify-email-template";
import Container from "@/components/container";
import Header from "@/components/header";
import { getMenuItems } from "@/common/get-menu-items";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Verify");

  return {
    title: t("verifyAccount"),
    description: t("verifyAccount"),
  };
}

export default async function VerifyEmailPage() {
  const menuItems = await getMenuItems();

  return (
    <Container>
      <Header menuItems={menuItems} />
      <VerifyEmailTemplate />
    </Container>
  );
}
