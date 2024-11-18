import Container from "@/components/container";
import Header from "@/components/header";
import { getOrder } from "@/common/utils-server";

export default async function OrderCompletePage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);

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
          <div className="rounded-lg border p-6">
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
                {new Date(order.orderPlacedAt!).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-6">
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

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping Method</h2>
            <p>{order.shippingLines[0]?.shippingMethod.name}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Ordered Products</h2>
            <div className="space-y-4">
              {order.lines.map((line) => (
                <div key={line.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{line.productVariant.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {line.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{line.linePriceWithTax / 100} €</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-medium">{order.totalWithTax / 100} €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
