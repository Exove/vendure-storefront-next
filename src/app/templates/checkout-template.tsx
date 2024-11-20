"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import {
  GetActiveCustomerQuery,
  GetPaymentMethodsQuery,
  GetShippingMethodsQuery,
} from "@/gql/graphql";
import useSWR, { mutate } from "swr";
import { activeOrderAction, placeOrderAction } from "../actions";
import { createContext, useEffect, useState } from "react";
import { createCustomerAddressAction } from "../actions";

import ShippingMethodSelector from "@/components/shipping-method-selector";
import PaymentMethodSelector from "@/components/payment-method-selector";
import OrderSummary from "@/components/order-summary";
import Button from "@/components/button";
import AddressFields from "@/components/address-fields";
import BoxWrap from "@/components/box-wrap";

export const CartContext = createContext<{
  cartQuantity: number;
  setCartQuantity: (quantity: number) => void;
}>({ cartQuantity: 0, setCartQuantity: () => {} });

interface CheckoutTemplateProps {
  activeUser: GetActiveCustomerQuery["activeCustomer"];
  paymentMethods: GetPaymentMethodsQuery["eligiblePaymentMethods"];
  shippingMethods: GetShippingMethodsQuery["eligibleShippingMethods"];
}

export default function CheckoutTemplate({
  activeUser,
  paymentMethods,
  shippingMethods,
}: CheckoutTemplateProps) {
  const [cartQuantity, setCartQuantity] = useState(0);

  const { data: order, error } = useSWR("order/add", activeOrderAction, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
  if (error) throw error;

  useEffect(() => {
    if (cartQuantity) {
      mutate("order/add");
    }
  }, [cartQuantity]);

  const handleSubmitAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      if (formData.get("saveAddress")) {
        await createCustomerAddressAction({
          fullName: formData.get("fullName") as string,
          streetLine1: formData.get("streetLine1") as string,
          city: formData.get("city") as string,
          postalCode: formData.get("postalCode") as string,
          countryCode: "FI",
          phoneNumber: "",
        });
      }

      await placeOrderAction(
        {
          fullName: formData.get("fullName") as string,
          streetLine1: formData.get("streetLine1") as string,
          city: formData.get("city") as string,
          postalCode: formData.get("postalCode") as string,
          countryCode: "FI",
        },
        formData.get("paymentMethod") as string,
        formData.get("shippingMethod") as string,
      );
    } catch (error) {
      console.error("Failed to create address:", error);
    } finally {
      window.location.href = `/order-complete/${order?.code}`;
    }
  };

  return (
    <CartContext.Provider value={{ cartQuantity, setCartQuantity }}>
      <Container>
        <Header />
        <div className="mx-auto mb-32 max-w-screen-xl pt-16">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
          {order && order.lines.length > 0 ? (
            <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
              <div className="flex flex-col gap-12">
                <form onSubmit={handleSubmitAddress} className="space-y-10">
                  <div>
                    <h2 className="mb-6 text-xl font-medium">
                      Shipping Address
                    </h2>
                    <AddressFields
                      defaultAddress={activeUser?.addresses?.[0]}
                    />
                  </div>
                  <ShippingMethodSelector shippingMethods={shippingMethods} />
                  <PaymentMethodSelector paymentMethods={paymentMethods} />
                  <Button type="submit" fullWidth>
                    Place Order
                  </Button>
                </form>
              </div>
              <OrderSummary order={order} />
            </div>
          ) : (
            <div>Empty Cart</div>
          )}
        </div>
      </Container>
    </CartContext.Provider>
  );
}
