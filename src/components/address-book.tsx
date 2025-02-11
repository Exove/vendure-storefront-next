"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { GetActiveCustomerQuery } from "@/gql/graphql";
import { useTranslations } from "next-intl";
import BoxWrap from "@/components/box-wrap";
import Button from "@/components/button";
import AddressFields from "@/components/address-fields";
import Heading from "@/components/heading";
import {
  createCustomerAddressAction,
  deleteCustomerAddressAction,
  updateCustomerAddressAction,
  setDefaultAddressAction,
} from "@/app/[locale]/actions";

type Address = NonNullable<
  NonNullable<GetActiveCustomerQuery["activeCustomer"]>["addresses"]
>[number];

interface AddressBookProps {
  addresses: Address[] | null | undefined;
  onAddressChange: () => Promise<unknown>;
}

export default function AddressBook({
  addresses,
  onAddressChange,
}: AddressBookProps) {
  const t = useTranslations();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

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
      await onAddressChange();
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
      defaultShippingAddress: addresses?.length === 0,
    };

    try {
      await createCustomerAddressAction(addressData);
      await onAddressChange();
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
      await onAddressChange();
      toast(t("account.addressDeleted"));
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(t("account.addressDeleteError"));
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddressAction(addressId);
      await onAddressChange();
      toast(t("account.defaultAddressSet"));
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error(t("account.defaultAddressError"));
    }
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <Heading level="h2" size="md">
          {t("account.shippingAddress")}
        </Heading>
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

        {addresses?.map((address: Address) => (
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
                  <span className="ml-2 flex items-center text-sm text-emerald-200">
                    {t("account.defaultAddress")}
                  </span>
                )}
              </div>
            </form>
          </BoxWrap>
        ))}
      </div>
    </section>
  );
}
