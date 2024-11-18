import {
  getLoggedInUser,
  getPaymentMethods,
  getShippingMethods,
} from "@/common/utils-server";
import CheckoutTemplate from "../templates/checkout-template";

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
