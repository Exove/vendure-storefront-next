import { activeOrderFragment } from "@/common/queries";
import { formatCurrency } from "@/common/utils";
import { getActiveOrder, getLoggedInUser } from "@/common/utils-server";
import Container from "@/components/container";
import Header from "@/components/header";
import OrderButton from "@/components/order-button";
import { getFragmentData } from "@/gql/fragment-masking";

export default async function CheckoutPage() {
  const activeOrder = getFragmentData(
    activeOrderFragment,
    await getActiveOrder(),
  );

  const activeUser = await getLoggedInUser();

  return (
    <Container>
      <Header />
      <div className="max-w-screen-xl mx-auto py-16">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <section className="">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div>
                  <div>{activeUser?.addresses?.[0]?.fullName}</div>
                  <div>{activeUser?.addresses?.[0]?.streetLine1}</div>
                  <div>{activeUser?.addresses?.[0]?.streetLine2}</div>
                  <div>
                    {activeUser?.addresses?.[0]?.postalCode}{" "}
                    {activeUser?.addresses?.[0]?.city}
                  </div>
                </div>
              </div>
            </section>

            <section className="">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              Standard Payment
            </section>
            <OrderButton />
          </div>

          <div>
            <section className=" sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex flex-col gap-16">
                <div className="space-y-4">
                  {activeOrder?.lines.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.productVariant.name}</span>
                      <span>{formatCurrency(item.linePriceWithTax)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(activeOrder?.subTotalWithTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(activeOrder?.shippingWithTax)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
}
