import { formatCurrency } from "@/common/utils";
import { Order } from "@/gql/graphql";
import { useTranslations } from "next-intl";

type Props = {
  order: Order | null;
};

export default function OrderCompleteTemplate({ order }: Props) {
  const t = useTranslations();

  if (!order) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-xl text-slate-400">{t("orderComplete.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-32 max-w-screen-md pt-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-blue-400">
          {t("orderComplete.thankYou")}
        </h1>
        <p className="text-lg text-slate-300">
          {t("orderComplete.emailConfirmation")}
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
          <h2 className="mb-6 text-2xl font-semibold text-slate-200">
            {t("orderComplete.orderDetails")}
          </h2>
          <div className="grid gap-4 text-lg">
            <div className="flex justify-between">
              <span className="text-slate-400">
                {t("orderComplete.orderNumber")}
              </span>
              <span
                className="font-medium text-slate-200"
                data-testid="order-number"
              >
                {order.code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">
                {t("orderComplete.status")}
              </span>
              <span className="font-medium capitalize text-blue-400">
                {order.state.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">
                {t("orderComplete.orderDate")}
              </span>
              <span className="font-medium text-slate-200">
                {new Date(order.orderPlacedAt!).toLocaleDateString("fi-FI")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
          <h2 className="mb-6 text-2xl font-semibold text-slate-200">
            {t("orderComplete.shippingAddress")}
          </h2>
          <div className="space-y-2 text-lg text-slate-300">
            <p className="font-medium">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.streetLine1}</p>
            <p>
              {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
          <h2 className="mb-6 text-2xl font-semibold text-slate-200">
            {t("orderComplete.shippingMethod")}
          </h2>
          <p className="text-lg text-slate-300">
            {order.shippingLines[0]?.shippingMethod.name}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
          <h2 className="mb-6 text-2xl font-semibold text-slate-200">
            {t("orderComplete.orderSummary")}
          </h2>
          <div className="space-y-6">
            {order.lines.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between border-b border-slate-700 pb-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg text-slate-200">
                    {line.productVariant.name}
                  </span>
                  {line.quantity > 1 && (
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400">
                      x {line.quantity}
                    </span>
                  )}
                </div>
                <span className="text-lg font-medium text-slate-200">
                  {formatCurrency(line.linePriceWithTax)}
                </span>
              </div>
            ))}

            <div className="space-y-4 rounded-lg bg-slate-900/50 p-6">
              <div className="flex justify-between text-slate-400">
                <span>{t("cart.subtotal")}</span>
                <span>{formatCurrency(order.totalWithTax)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t("orderComplete.shipping")}</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-4 text-xl font-bold">
                <span className="text-slate-200">
                  {t("orderComplete.total")}
                </span>
                <span className="text-blue-400" data-testid="order-total">
                  {formatCurrency(order.totalWithTax)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
