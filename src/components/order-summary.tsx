import { formatCurrency } from "@/common/utils";
import { ActiveOrderFragment } from "@/gql/graphql";

interface OrderSummaryProps {
  order: ActiveOrderFragment;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <section className="sticky top-4">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

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
              {formatCurrency(item.linePriceWithTax)}
            </span>
          </div>
        ))}
        <div className="py-4">
          <hr className="border-slate-700" />
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span>{formatCurrency(order?.subTotalWithTax)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Shipping</span>
          <span>{formatCurrency(order?.shippingWithTax)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-700 pt-4 text-lg font-bold text-slate-200">
          <span>Total</span>
          <span>
            {formatCurrency(order?.subTotalWithTax + order?.shippingWithTax)}
          </span>
        </div>
      </div>
    </section>
  );
}
