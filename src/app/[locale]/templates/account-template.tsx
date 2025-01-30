"use client";

import { toast } from "sonner";
import { formatDate } from "@/common/utils";
import BoxWrap from "@/components/box-wrap";
import Button from "@/components/button";
import Heading from "@/components/heading";
import Logout from "@/components/logout";
import { GetActiveCustomerQuery } from "@/gql/graphql";
import useSWR from "swr";
import { updateCustomerAddressAction } from "../actions";
import { FormEvent } from "react";
import AddressFields from "@/components/address-fields";
import { useTranslations } from "next-intl";

interface AccountTemplateProps {
  user: GetActiveCustomerQuery["activeCustomer"];
}

export default function AccountTemplate({ user }: AccountTemplateProps) {
  const t = useTranslations();
  const { mutate } = useSWR("shop-api", updateCustomerAddressAction, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

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
      await mutate(); // Refresh SWR cache
    } catch (error) {
      console.error("Failed to update address:", error);
    } finally {
      toast(t("account.addressUpdated"));
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
            <h2 className="mb-4 text-xl font-semibold">
              {t("account.shippingAddress")}
            </h2>
            <div className="space-y-4">
              {user?.addresses?.map((address) => (
                <BoxWrap key={address.id}>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={(e) => handleSubmit(e, address.id)}
                  >
                    <AddressFields defaultAddress={address} />
                    <div className="mt-4 flex gap-2">
                      <Button size="small" style="secondary" type="submit">
                        {t("account.saveChanges")}
                      </Button>
                      <Button
                        size="small"
                        style="text"
                        type="button"
                        onClick={() => {
                          const form = document.forms[0];
                          const inputs = form.querySelectorAll("input");
                          inputs.forEach((input) => (input.value = ""));
                        }}
                      >
                        {t("account.emptyFields")}
                      </Button>
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
                  .filter((order) => order.state !== "AddingItems")
                  .slice(-1)
                  .map((order, index) => (
                    <BoxWrap key={index}>
                      <div className="text-sm text-slate-400">
                        {formatDate(order.orderPlacedAt)}
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          {order.lines.map((line) => (
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
