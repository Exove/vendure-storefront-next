"use client";

import { formatCurrency } from "@/common/utils";
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
import ShippingAddressForm from "@/components/shipping-address-form";
import OrderSummary from "@/components/order-summary";

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
  const [editingAddress, setEditingAddress] = useState(false);

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
    }
  };

  return (
    <CartContext.Provider value={{ cartQuantity, setCartQuantity }}>
      <Container>
        <Header />
        <div className="mx-auto max-w-screen-xl py-16">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
          {order && order.lines.length > 0 ? (
            <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
              <div className="flex flex-col gap-12">
                <form onSubmit={handleSubmitAddress} className="space-y-4">
                  <ShippingAddressForm
                    activeUser={activeUser}
                    editingAddress={editingAddress}
                    setEditingAddress={setEditingAddress}
                  />
                  <ShippingMethodSelector shippingMethods={shippingMethods} />
                  <PaymentMethodSelector paymentMethods={paymentMethods} />
                  <button
                    type="submit"
                    className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Place Order
                  </button>
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
