"use client";

import { toast } from "sonner";
import { formatDate } from "@/common/utils";
import BoxWrap from "@/components/box-wrap";
import Button from "@/components/button";
import Heading from "@/components/heading";
import Logout from "@/components/logout";
import { GetActiveCustomerQuery } from "@/gql/graphql";
import useSWR from "swr";
import {
  createCustomerAddressAction,
  deleteCustomerAddressAction,
  updateCustomerAddressAction,
  setDefaultAddressAction,
  getLoggedInUserAction,
} from "../actions";
import { FormEvent, useState } from "react";
import AddressFields from "@/components/address-fields";
import { useTranslations } from "next-intl";

interface AccountTemplateProps {
  user: GetActiveCustomerQuery["activeCustomer"];
}

type Address = NonNullable<
  NonNullable<GetActiveCustomerQuery["activeCustomer"]>["addresses"]
>[number];
type Order = NonNullable<
  GetActiveCustomerQuery["activeCustomer"]
>["orders"]["items"][number];
type OrderLine = Order["lines"][number];

export default function AccountTemplate({
  user: initialUser,
}: AccountTemplateProps) {
  const t = useTranslations();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const { data: user, mutate } = useSWR(
    "active-customer",
    getLoggedInUserAction,
    {
      fallbackData: initialUser,
      revalidateOnFocus: false,
    },
  );

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    addressId: string,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const addressData = {
      id: addressId,
      fullName: formData.get("fullName") as string,
      streetLine1: formData.get("streetLine1") as string,
      postalCode: formData.get("postalCode") as string,
      city: formData.get("city") as string,
      countryCode: formData.get("countryCode") as string,
    };

    try {
      await updateCustomerAddressAction(addressData);
      await mutate();
      toast(t("account.addressUpdated"));
    } catch (error) {
      console.error("Failed to update address:", error);
      toast.error(t("account.addressUpdateError"));
    }
  };

  const handleCreateAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const addressData = {
      fullName: formData.get("fullName") as string,
      streetLine1: formData.get("streetLine1") as string,
      postalCode: formData.get("postalCode") as string,
      city: formData.get("city") as string,
      countryCode: formData.get("countryCode") as string,
    };

    try {
      await createCustomerAddressAction(addressData);
      await mutate();
      setShowNewAddressForm(false);
      form.reset();
      toast(t("account.addressCreated"));
    } catch (error) {
      console.error("Failed to create address:", error);
      toast.error(t("account.addressCreateError"));
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteCustomerAddressAction(addressId);
      await mutate();
      toast(t("account.addressDeleted"));
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(t("account.addressDeleteError"));
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddressAction(addressId);
      await mutate();
      toast(t("account.defaultAddressSet"));
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error(t("account.defaultAddressError"));
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-screen-xl py-16">
        <h1 className="mb-8 text-3xl font-bold">{t("account.title")}</h1>
        <p>{t("account.notLoggedIn")}</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="mb-16 flex items-center justify-between">
        <Heading size="xl" level="h1" className="mb-0">
          {t("account.title")}
        </Heading>
        <Logout />
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <div className="flex flex-col gap-16">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t("account.shippingAddress")}
              </h2>
              <Button
                size="small"
                style="primary"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              >
                {showNewAddressForm
                  ? t("account.cancel")
                  : t("account.addNewAddress")}
              </Button>
            </div>

            <div className="space-y-4">
              {showNewAddressForm && (
                <BoxWrap>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={handleCreateAddress}
                  >
                    <AddressFields />
                    <div className="mt-4 flex gap-2">
                      <Button size="small" style="primary" type="submit">
                        {t("account.addAddress")}
                      </Button>
                    </div>
                  </form>
                </BoxWrap>
              )}

              {user?.addresses?.map((address: Address) => (
                <BoxWrap key={address.id}>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={(e) => handleSubmit(e, address.id)}
                  >
                    <AddressFields defaultAddress={address} />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="small" style="secondary" type="submit">
                        {t("account.saveChanges")}
                      </Button>
                      <Button
                        size="small"
                        style="text"
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        {t("account.deleteAddress")}
                      </Button>
                      {!address.defaultShippingAddress && (
                        <Button
                          size="small"
                          style="text"
                          type="button"
                          onClick={() => handleSetDefaultAddress(address.id)}
                        >
                          {t("account.setAsDefault")}
                        </Button>
                      )}
                      {address.defaultShippingAddress && (
                        <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                          {t("account.defaultAddress")}
                        </span>
                      )}
                    </div>
                  </form>
                </BoxWrap>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-16">
          {user?.orders?.items.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                {t("account.latestOrder")}
              </h2>
              <div className="space-y-4">
                {user?.orders?.items
                  .filter((order: Order) => order.state !== "AddingItems")
                  .slice(-1)
                  .map((order: Order, index: number) => (
                    <BoxWrap key={index}>
                      <div className="text-sm text-slate-400">
                        {formatDate(order.orderPlacedAt)}
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          {order.lines.map((line: OrderLine) => (
                            <div
                              key={line.productVariant.name}
                              className="font-medium"
                            >
                              {line.quantity} x {line.productVariant.name}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-full bg-slate-700 px-3 py-1 text-sm">
                          {order.state}
                        </div>
                      </div>
                    </BoxWrap>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
