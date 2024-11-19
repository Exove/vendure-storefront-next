import Container from "@/components/container";
import Header from "@/components/header";
import { getOrderByCode } from "@/common/utils-server";
import { formatCurrency } from "@/common/utils";

type Params = Promise<{ slug: string }>;

export default async function Page(props: { params: Params }) {
  const order = await getOrderByCode((await props.params).slug);

  if (!order) {
    return <div>Order not found</div>;
  }

  console.log(order);
  return (
    <Container>
      <Header />
      <div className="mx-auto mb-32 max-w-screen-md pt-16">
        <h1 className="mb-8 text-3xl font-bold">Order Received</h1>
        <p className="text-lg">
          Thank you for your order! We will send you a confirmation email.
        </p>
        <div className="mt-8 space-y-6">
          <div className="rounded-lg bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Order Number:</span> {order.code}
              </p>
              <p>
                <span className="font-medium">Status:</span> {order.state}
              </p>
              <p>
                <span className="font-medium">Order Date:</span>{" "}
                {new Date(order.orderPlacedAt!).toLocaleDateString("fi-FI")}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
            <div className="space-y-2">
              <p>{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.streetLine1}</p>
              <p>
                {order.shippingAddress?.postalCode}{" "}
                {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping Method</h2>
            <p>{order.shippingLines[0]?.shippingMethod.name}</p>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Ordered Products</h2>
            <div className="space-y-4">
              {order.lines.map((line) => (
                <div key={line.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{line.productVariant.name}</p>
                    <p className="text-sm">Quantity: {line.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(line.linePriceWithTax)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-medium">
                  {formatCurrency(order.totalWithTax)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
