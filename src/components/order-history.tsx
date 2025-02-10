"use client";

import { GetActiveCustomerQuery } from "@/gql/graphql";
import { useTranslations } from "next-intl";
import BoxWrap from "@/components/box-wrap";
import { formatDate } from "@/common/utils";

type Order = NonNullable<
  GetActiveCustomerQuery["activeCustomer"]
>["orders"]["items"][number];
type OrderLine = Order["lines"][number];

interface OrderHistoryProps {
  orders: Order[] | undefined;
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const t = useTranslations();

  if (!orders?.length) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{t("account.latestOrder")}</h2>
      <div className="space-y-4">
        {orders
          .filter((order: Order) => order.state !== "AddingItems")
          .slice(-1)
          .map((order: Order, index: number) => (
            <BoxWrap key={index}>
              <div className="text-sm text-slate-400">
                {formatDate(order.orderPlacedAt)}
              </div>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {order.lines.map((line: OrderLine) => (
                    <div key={line.productVariant.name} className="font-medium">
                      {line.quantity} x {line.productVariant.name}
                    </div>
                  ))}
                </div>
                <div className="rounded-full bg-slate-700 px-3 py-1 text-sm">
                  {order.state}
                </div>
              </div>
            </BoxWrap>
          ))}
      </div>
    </section>
  );
}
