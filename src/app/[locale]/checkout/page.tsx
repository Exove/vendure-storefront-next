import {
  getLoggedInUser,
  getPaymentMethods,
  getShippingMethods,
} from "@/common/utils-server";
import CheckoutTemplate from "../templates/checkout-template";
import { Metadata } from "next";
import { SHOP_NAME } from "@/common/constants";
import { getTranslations } from "next-intl/server";
import { getMenuItems } from "@/common/get-menu-items";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout");
  return {
    title: `${t("title")} | ${SHOP_NAME}`,
  };
}

export default async function CheckoutPage() {
  const activeUser = await getLoggedInUser();
  const paymentMethods = await getPaymentMethods();
  const shippingMethods = await getShippingMethods();
  const menuItems = await getMenuItems();

  return (
    <CheckoutTemplate
      activeUser={activeUser}
      paymentMethods={paymentMethods}
      shippingMethods={shippingMethods}
      menuItems={menuItems}
    />
  );
}
