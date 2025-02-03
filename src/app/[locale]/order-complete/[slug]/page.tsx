import { Order } from "@/gql/graphql";
import OrderCompleteTemplate from "../../templates/order-complete-template";
import { getOrderByCode } from "@/common/utils-server";
import { getMenuItems } from "@/common/get-menu-items";
import Header from "@/components/header";
import Container from "@/components/container";

type Params = Promise<{ slug: string }>;

export default async function OrderCompletePage(props: { params: Params }) {
  const menuItems = await getMenuItems();
  const order = await getOrderByCode((await props.params).slug);

  return (
    <Container>
      <Header menuItems={menuItems} />
      <OrderCompleteTemplate order={order as Order} />
    </Container>
  );
}
