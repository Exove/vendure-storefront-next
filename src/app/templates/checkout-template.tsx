"use client";

import { activeOrderFragment } from "@/common/queries";
import { formatCurrency } from "@/common/utils";
import { getActiveOrder, getLoggedInUser } from "@/common/utils-server";
import Container from "@/components/container";
import Header from "@/components/header";
import OrderButton from "@/components/order-button";
import { getFragmentData } from "@/gql/fragment-masking";
import { GetActiveCustomerQuery } from "@/gql/graphql";
import useSWR, { mutate } from "swr";
import { activeOrderAction, placeOrderAction } from "../actions";
import { createContext, useEffect, useState } from "react";
import { createCustomerAddressAction } from "../actions";
import { motion } from "motion/react";

export const CartContext = createContext<{
  cartQuantity: number;
  setCartQuantity: (quantity: number) => void;
}>({ cartQuantity: 0, setCartQuantity: () => {} });

interface CheckoutTemplateProps {
  activeUser: GetActiveCustomerQuery["activeCustomer"];
}

export default function CheckoutTemplate({
  activeUser,
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
      await createCustomerAddressAction({
        fullName: formData.get("fullName") as string,
        streetLine1: formData.get("streetLine1") as string,
        city: formData.get("city") as string,
        postalCode: formData.get("postalCode") as string,
        countryCode: "FI",
      });
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

          <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
            <div className="flex flex-col gap-12">
              <section>
                <div className="flex items-baseline justify-between">
                  <h2 className="mb-4 text-xl font-semibold">
                    Shipping Address
                  </h2>
                  <button onClick={() => setEditingAddress(!editingAddress)}>
                    {editingAddress ? "Cancel" : "Edit"}
                  </button>
                </div>
                {!editingAddress ? (
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
                ) : (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                  >
                    <form onSubmit={handleSubmitAddress} className="space-y-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm text-slate-400"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="mt-1 block w-full rounded-md p-2 text-black"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="streetLine1"
                          className="block text-sm text-slate-400"
                        >
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="streetLine1"
                          name="streetLine1"
                          className="mt-1 block w-full rounded-md p-2 text-black"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm text-slate-400"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            className="mt-1 block w-full rounded-md p-2 text-black"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="postalCode"
                            className="block text-sm text-slate-400"
                          >
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            className="mt-1 block w-full rounded-md p-2 text-black"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          name="saveAddress"
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                          htmlFor="saveAddress"
                          className="text-sm text-slate-400"
                        >
                          Save as default address
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      >
                        Save Address
                      </button>
                    </form>
                  </motion.div>
                )}
              </section>

              <section className="">
                <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
                Standard Payment
              </section>
              <button
                onClick={() => placeOrderAction()}
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Place Order
              </button>
            </div>

            <div>
              <section className="sticky top-4">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                {order?.lines.length ? (
                  <div className="flex flex-col gap-16">
                    <div className="space-y-4">
                      {order?.lines.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div className="flex gap-2">
                            <span>{item.productVariant.name}</span>
                            {item.quantity > 1 && (
                              <span>x {item.quantity}</span>
                            )}
                          </div>
                          <span>{formatCurrency(item.linePriceWithTax)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
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
                          {formatCurrency(
                            order?.subTotalWithTax + order?.shippingWithTax,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>Empty Cart</div>
                )}
              </section>
            </div>
          </div>
        </div>
      </Container>
    </CartContext.Provider>
  );
}
