import {
  getLoggedInUser,
  getPaymentMethods,
  getShippingMethods,
} from "@/common/utils-server";
import CheckoutTemplate from "../templates/checkout-template";
import { Metadata } from "next";
import { SHOP_NAME } from "@/common/constants";
import { getTranslations } from "next-intl/server";

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

  return (
    <CheckoutTemplate
      activeUser={activeUser}
      paymentMethods={paymentMethods}
      shippingMethods={shippingMethods}
    />
  );
}
