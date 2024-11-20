"use client";

import { toast } from "sonner";
import { formatDate } from "@/common/utils";
import BoxWrap from "@/components/box-wrap";
import Button from "@/components/button";
import Container from "@/components/container";
import Header from "@/components/header";
import Heading from "@/components/heading";
import Logout from "@/components/logout";
import { GetActiveCustomerQuery } from "@/gql/graphql";
import useSWR from "swr";
import { updateCustomerAddressAction } from "../actions";
import { FormEvent } from "react";
import AddressFields from "@/components/address-fields";

interface AccountTemplateProps {
  user: GetActiveCustomerQuery["activeCustomer"];
}

export default function AccountTemplate({ user }: AccountTemplateProps) {
  const { mutate } = useSWR("order/add", updateCustomerAddressAction, {
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
      console.log("Address updated.");
      toast("Address updated.");
    }
  };

  return (
    <Container>
      <Header />
      <div className="py-16">
        <div className="mb-16 flex items-center justify-between">
          <Heading size="xl" level="h1" zeroMargin>
            Account
          </Heading>
          <Logout />
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-16">
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Personal Information
              </h2>
              <BoxWrap>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400">Name:</span>{" "}
                    <span className="font-medium text-slate-200">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>{" "}
                    <span className="font-medium text-slate-200">
                      {user?.emailAddress}
                    </span>
                  </div>
                </div>
              </BoxWrap>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
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
                          Save Changes
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
                          Empty Fields
                        </Button>
                      </div>
                    </form>
                  </BoxWrap>
                ))}
              </div>
            </section>
          </div>
          <div className="flex flex-col gap-16">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Latest Order</h2>
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
          </div>
        </div>
      </div>
    </Container>
  );
}
