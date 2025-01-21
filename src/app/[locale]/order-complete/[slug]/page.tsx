import { Order } from "@/gql/graphql";
import OrderCompleteTemplate from "../../templates/order-complete-template";
import { getOrderByCode } from "@/common/utils-server";

type Params = Promise<{ slug: string }>;

export default async function OrderCompletePage(props: { params: Params }) {
  const order = await getOrderByCode((await props.params).slug);
  return <OrderCompleteTemplate order={order as Order} />;
}
