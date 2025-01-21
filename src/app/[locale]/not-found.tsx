import Container from "@/components/container";
import Header from "@/components/header";
import Heading from "@/components/heading";
import { SHOP_NAME } from "@/common/constants";
import { useTranslations } from "next-intl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `404 | ${SHOP_NAME}`,
};

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container>
      <Header />
      <div className="mt-20 text-center">
        <Heading level="h1" size="xl" className="mb-4">
          {t("title")}
        </Heading>
        <p className="text-lg text-gray-400">
          {t("description", { shop: SHOP_NAME })}
        </p>
      </div>
    </Container>
  );
}
