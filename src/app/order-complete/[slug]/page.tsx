import Container from "@/components/container";
import Header from "@/components/header";
import { getOrderByCode } from "@/common/utils-server";
import { formatCurrency } from "@/common/utils";

type Params = Promise<{ slug: string }>;

export default async function Page(props: { params: Params }) {
  const order = await getOrderByCode((await props.params).slug);

  if (!order) {
    return (
      <Container>
        <Header />
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-xl text-slate-400">Order not found</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <div className="mx-auto mb-32 max-w-screen-md pt-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-blue-400">
            Thank you for your order!
          </h1>
          <p className="text-lg text-slate-300">
            We will send you a confirmation email shortly.
          </p>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
            <h2 className="mb-6 text-2xl font-semibold text-slate-200">
              Order Details
            </h2>
            <div className="grid gap-4 text-lg">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Number</span>
                <span className="font-medium text-slate-200">{order.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-medium capitalize text-blue-400">
                  {order.state.toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Date</span>
                <span className="font-medium text-slate-200">
                  {new Date(order.orderPlacedAt!).toLocaleDateString("fi-FI")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
            <h2 className="mb-6 text-2xl font-semibold text-slate-200">
              Shipping Address
            </h2>
            <div className="space-y-2 text-lg text-slate-300">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.streetLine1}</p>
              <p>
                {order.shippingAddress?.postalCode}{" "}
                {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
            <h2 className="mb-6 text-2xl font-semibold text-slate-200">
              Shipping Method
            </h2>
            <p className="text-lg text-slate-300">
              {order.shippingLines[0]?.shippingMethod.name}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-8 shadow-lg backdrop-blur">
            <h2 className="mb-6 text-2xl font-semibold text-slate-200">
              Order Summary
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
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.totalWithTax)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-4 text-xl font-bold">
                  <span className="text-slate-200">Total</span>
                  <span className="text-blue-400">
                    {formatCurrency(order.totalWithTax)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
