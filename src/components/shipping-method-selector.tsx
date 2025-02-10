import { GetShippingMethodsQuery } from "@/gql/graphql";
import RadioOption from "./radio-option";
import { useTranslations } from "next-intl";
import { setOrderShippingMethodAction } from "@/app/[locale]/actions";
import { mutate } from "swr";

interface ShippingMethodSelectorProps {
  shippingMethods: GetShippingMethodsQuery["eligibleShippingMethods"];
}

export default function ShippingMethodSelector({
  shippingMethods,
}: ShippingMethodSelectorProps) {
  const t = useTranslations("checkout");

  const handleShippingMethodChange = async (methodId: string) => {
    try {
      await setOrderShippingMethodAction(methodId);
      mutate("shop-api");
    } catch (error) {
      console.error("Failed to set shipping method:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t("shippingMethod")}</h2>
      <div className="space-y-2">
        {shippingMethods.map((method) => (
          <RadioOption
            key={method.id}
            name={method.name}
            value={method.id}
            groupName="shippingMethod"
            onChange={() => handleShippingMethodChange(method.id)}
          />
        ))}
      </div>
    </div>
  );
}
