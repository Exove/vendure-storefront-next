import { GetShippingMethodsQuery } from "@/gql/graphql";
import RadioOption from "./radio-option";
import { useTranslations } from "next-intl";
import { setOrderShippingMethodAction } from "@/app/[locale]/actions";
import { mutate } from "swr";
import Heading from "./heading";

interface ShippingMethodSelectorProps {
  shippingMethods: GetShippingMethodsQuery["eligibleShippingMethods"];
  selectedShippingMethod?: string;
}

export default function ShippingMethodSelector({
  shippingMethods,
  selectedShippingMethod,
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
      <Heading level="h2" size="md">
        {t("shippingMethod")}
      </Heading>
      <div className="space-y-2">
        {shippingMethods.map((method) => (
          <RadioOption
            key={method.id}
            name={method.name}
            value={method.id}
            groupName="shippingMethod"
            onChange={() => handleShippingMethodChange(method.id)}
            checked={selectedShippingMethod === method.id}
          />
        ))}
      </div>
    </div>
  );
}
