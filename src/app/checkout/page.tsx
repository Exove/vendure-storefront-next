import { getLoggedInUser, getPaymentMethods } from "@/common/utils-server";
import CheckoutTemplate from "../templates/checkout-template";

export default async function CheckoutPage() {
  const activeUser = await getLoggedInUser();

  const paymentMethods = await getPaymentMethods();

  return (
    <CheckoutTemplate activeUser={activeUser} paymentMethods={paymentMethods} />
  );
}
