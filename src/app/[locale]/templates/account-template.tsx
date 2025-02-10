"use client";

import { GetActiveCustomerQuery } from "@/gql/graphql";
import useSWR from "swr";
import { getLoggedInUserAction } from "../actions";
import { useTranslations } from "next-intl";
import Heading from "@/components/heading";
import Logout from "@/components/logout";
import AddressBook from "@/components/address-book";
import OrderHistory from "@/components/order-history";

interface AccountTemplateProps {
  user: GetActiveCustomerQuery["activeCustomer"];
}

export default function AccountTemplate({
  user: initialUser,
}: AccountTemplateProps) {
  const t = useTranslations();

  const { data: user, mutate } = useSWR(
    "active-customer",
    getLoggedInUserAction,
    {
      fallbackData: initialUser,
      revalidateOnFocus: false,
    },
  );

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
          <AddressBook addresses={user.addresses} onAddressChange={mutate} />
        </div>

        <div className="flex flex-col gap-16">
          <OrderHistory orders={user.orders?.items} />
        </div>
      </div>
    </div>
  );
}
