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
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import ShippingMethodSelector from "@/components/shipping-method-selector";
import PaymentMethodSelector from "@/components/payment-method-selector";
import OrderSummary from "@/components/order-summary";
import Button from "@/components/button";
import AddressFields from "@/components/address-fields";
import { MenuItem } from "@/common/get-menu-items";

export const CartContext = createContext<{
  cartQuantity: number;
  setCartQuantity: (quantity: number) => void;
}>({ cartQuantity: 0, setCartQuantity: () => {} });

interface CheckoutTemplateProps {
  activeUser: GetActiveCustomerQuery["activeCustomer"];
  paymentMethods: GetPaymentMethodsQuery["eligiblePaymentMethods"];
  shippingMethods: GetShippingMethodsQuery["eligibleShippingMethods"];
  menuItems: MenuItem[];
}

export default function CheckoutTemplate({
  activeUser,
  paymentMethods,
  shippingMethods,
  menuItems,
}: CheckoutTemplateProps) {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const { data: order, error } = useSWR("shop-api", activeOrderAction, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
  if (error) throw error;

  useEffect(() => {
    if (cartQuantity) {
      mutate("shop-api");
    }
  }, [cartQuantity]);

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const shippingDetails = {
      fullName: formData.get("fullName") as string,
      streetLine1: formData.get("streetLine1") as string,
      city: formData.get("city") as string,
      postalCode: formData.get("postalCode") as string,
      countryCode: formData.get("countryCode") as string,
    };

    const billingDetails = showBillingAddress
      ? {
          fullName: formData.get("billingfullName") as string,
          streetLine1: formData.get("billingstreetLine1") as string,
          city: formData.get("billingcity") as string,
          postalCode: formData.get("billingpostalCode") as string,
          countryCode: formData.get("billingcountryCode") as string,
        }
      : undefined;

    const guestDetails = !activeUser
      ? {
          emailAddress: formData.get("email") as string,
          phoneNumber: formData.get("phone") as string,
        }
      : undefined;

    try {
      await placeOrderAction(
        shippingDetails,
        formData.get("paymentMethod") as string,
        formData.get("shippingMethod") as string,
        billingDetails,
        guestDetails,
      );
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }

    router.push(`/order-complete/${order?.code}`);
  };

  return (
    <CartContext.Provider value={{ cartQuantity, setCartQuantity }}>
      <Container>
        <Header menuItems={menuItems} />
        <div className="mx-auto mb-32 max-w-screen-xl pt-16">
          <h1 className="mb-8 text-3xl font-bold">{t("checkout.title")}</h1>
          {order && order.lines.length > 0 ? (
            <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
              <div className="flex flex-col gap-12">
                <form onSubmit={handleSubmitOrder} className="space-y-10">
                  {!activeUser && (
                    <div>
                      <h2 className="mb-6 text-xl font-medium">
                        {t("checkout.contactInformation")}
                      </h2>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-1/2">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-slate-300"
                            >
                              {t("auth.email")}
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
                              required
                            />
                          </div>
                          <div className="w-1/2">
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-slate-300"
                            >
                              {t("Register.phone")}
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <h2 className="mb-6 text-xl font-medium">
                      {t("checkout.shippingAddress")}
                    </h2>
                    <AddressFields
                      defaultAddress={activeUser?.addresses?.find(
                        (address) => address.defaultShippingAddress,
                      )}
                    />
                  </div>
                  <div>
                    <div className="mb-6 flex items-center gap-4">
                      <h2 className="text-xl font-medium">
                        {t("checkout.billingAddress")}
                      </h2>
                      <Button
                        type="button"
                        size="small"
                        style="secondary"
                        onClick={() =>
                          setShowBillingAddress(!showBillingAddress)
                        }
                      >
                        {showBillingAddress
                          ? t("common.remove")
                          : t("common.add")}
                      </Button>
                    </div>
                    {showBillingAddress && (
                      <AddressFields
                        defaultAddress={activeUser?.addresses?.find(
                          (address) => address.defaultBillingAddress,
                        )}
                        fieldNamePrefix="billing"
                      />
                    )}
                  </div>
                  <ShippingMethodSelector shippingMethods={shippingMethods} />
                  <PaymentMethodSelector paymentMethods={paymentMethods} />
                  <Button type="submit" fullWidth id="submit-order">
                    {t("checkout.placeOrder")}
                  </Button>
                </form>
              </div>
              <OrderSummary order={order} />
            </div>
          ) : (
            <div>{t("checkout.emptyCart")}</div>
          )}
        </div>
      </Container>
    </CartContext.Provider>
  );
}
