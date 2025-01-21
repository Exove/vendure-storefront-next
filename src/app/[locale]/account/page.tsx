import { getLoggedInUser } from "@/common/utils-server";
import AccountTemplate from "../templates/account-template";
import { Customer } from "@/plugins/organization/gql/generated";
import { Metadata } from "next";
import { SHOP_NAME } from "@/common/constants";
import { getTranslations } from "next-intl/server";
import Container from "@/components/container";
import Header from "@/components/header";
import Login from "@/components/login";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return {
    title: `${t("title")} | ${SHOP_NAME}`,
  };
}

export default async function AccountPage() {
  const user = await getLoggedInUser();

  return (
    <Container>
      <Header />
      {user ? <AccountTemplate user={user as Customer} /> : <Login />}
    </Container>
  );
}
