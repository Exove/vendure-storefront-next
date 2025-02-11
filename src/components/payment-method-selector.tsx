import { GetPaymentMethodsQuery } from "@/gql/graphql";
import RadioOption from "./radio-option";
import { useTranslations } from "next-intl";
import Heading from "./heading";

interface PaymentMethodSelectorProps {
  paymentMethods: GetPaymentMethodsQuery["eligiblePaymentMethods"];
}

export default function PaymentMethodSelector({
  paymentMethods,
}: PaymentMethodSelectorProps) {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <Heading level="h2" size="md">
        {t("checkout.paymentMethod")}
      </Heading>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <RadioOption
            key={method.id}
            value={method.code}
            name={method.name}
            groupName="paymentMethod"
          />
        ))}
      </div>
    </div>
  );
}
