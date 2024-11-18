import { getLoggedInUser } from "@/common/utils-server";
import CheckoutTemplate from "../templates/checkout-template";

export default async function CheckoutPage() {
  const activeUser = await getLoggedInUser();

  return <CheckoutTemplate activeUser={activeUser} />;
}
