"use client";

import { GetActiveCustomerQuery } from "@/gql/graphql";
import { useTranslations } from "next-intl";
import BoxWrap from "@/components/box-wrap";
import { formatDate } from "@/common/utils";
import { useState } from "react";
import Button from "./button";

type Order = NonNullable<
  GetActiveCustomerQuery["activeCustomer"]
>["orders"]["items"][number];
type OrderLine = Order["lines"][number];

interface OrderHistoryProps {
  orders: Order[] | undefined;
}

const ORDER_HISTORY_DISPLAY_COUNT = 10;

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const t = useTranslations();
  const [displayCount, setDisplayCount] = useState(ORDER_HISTORY_DISPLAY_COUNT);

  const filteredOrders =
    orders?.filter((order: Order) => order.state !== "AddingItems") || [];

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">
        {t("account.orderHistory")}
      </h2>
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-sm">{t("account.noOrders")}</div>
        ) : (
          <>
            {filteredOrders
              .reverse()
              .slice(0, displayCount)
              .map((order: Order, index: number) => (
                <BoxWrap key={index}>
                  <div className="text-sm text-slate-400">
                    {formatDate(order.orderPlacedAt)}
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      {order.lines.map((line: OrderLine) => (
                        <div
                          key={line.productVariant.name}
                          className="font-medium"
                        >
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
            {filteredOrders.length > displayCount && (
              <div className="flex justify-center">
                <Button
                  size="small"
                  style="secondary"
                  onClick={() =>
                    setDisplayCount(
                      (prev) => prev + ORDER_HISTORY_DISPLAY_COUNT,
                    )
                  }
                >
                  {t("common.showMore")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
