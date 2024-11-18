import { formatCurrency } from "@/common/utils";
import { ActiveOrderFragment } from "@/gql/graphql";

interface OrderSummaryProps {
  order: ActiveOrderFragment;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <section className="sticky top-4">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

      <div className="space-y-2">
        {order?.lines.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex gap-2">
              <span>{item.productVariant.name}</span>
              {item.quantity > 1 && <span>x {item.quantity}</span>}
            </div>
            <span>{formatCurrency(item.linePriceWithTax)}</span>
          </div>
        ))}
        <div className="pb-2 pt-4">
          <hr />
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(order?.subTotalWithTax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatCurrency(order?.shippingWithTax)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>
            {formatCurrency(order?.subTotalWithTax + order?.shippingWithTax)}
          </span>
        </div>
      </div>
    </section>
  );
}
