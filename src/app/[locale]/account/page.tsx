import { getLoggedInUser } from "@/common/utils-server";
import AccountTemplate from "../templates/account-template";
import { Customer } from "@/plugins/organization/gql/generated";
import { Metadata } from "next";
import { SHOP_NAME } from "@/common/constants";
import { getTranslations } from "next-intl/server";
import Container from "@/components/container";
import Header from "@/components/header";
import Login from "@/components/login";
import { getMenuItems } from "@/common/get-menu-items";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return {
    title: `${t("title")} | ${SHOP_NAME}`,
  };
}

export default async function AccountPage() {
  const user = await getLoggedInUser();
  const menuItems = await getMenuItems();

  return (
    <Container>
      <Header menuItems={menuItems} />
      {user ? <AccountTemplate user={user as Customer} /> : <Login />}
    </Container>
  );
}
