import { GetPaymentMethodsQuery } from "@/gql/graphql";
import RadioOption from "./radio-option";

interface PaymentMethodSelectorProps {
  paymentMethods: GetPaymentMethodsQuery["eligiblePaymentMethods"];
}

export default function PaymentMethodSelector({
  paymentMethods,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Maksutapa</h2>
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
