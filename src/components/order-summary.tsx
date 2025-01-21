import { formatCurrency } from "@/common/utils";
import { ActiveOrderFragment } from "@/gql/graphql";
import { useLocale, useTranslations } from "next-intl";

interface OrderSummaryProps {
  order: ActiveOrderFragment;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="sticky top-4">
      <h2 className="mb-4 text-xl font-semibold">
        {t("orderComplete.orderSummary")}
      </h2>

      <div className="space-y-4">
        {order?.lines.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-200">{item.productVariant.name}</span>
              {item.quantity > 1 && (
                <span className="rounded bg-slate-800 px-2 py-1 text-sm text-slate-400">
                  x {item.quantity}
                </span>
              )}
            </div>
            <span className="font-medium text-slate-200">
              {formatCurrency(item.linePriceWithTax, locale)}
            </span>
          </div>
        ))}
        <div className="py-4">
          <hr className="border-slate-700" />
        </div>
        <div className="flex justify-between text-slate-400">
          <span>{t("cart.subtotal")}</span>
          <span>{formatCurrency(order?.subTotalWithTax, locale)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>{t("orderComplete.shipping")}</span>
          <span>{formatCurrency(order?.shippingWithTax, locale)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-700 pt-4 text-lg font-bold text-slate-200">
          <span>{t("orderComplete.total")}</span>
          <span>
            {formatCurrency(
              order?.subTotalWithTax + order?.shippingWithTax,
              locale,
            )}
          </span>
        </div>
      </div>
    </section>
  );
}
