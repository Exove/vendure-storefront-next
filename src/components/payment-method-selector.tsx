import { GetPaymentMethodsQuery } from "@/gql/graphql";

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
          <label
            key={method.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.code}
              className="h-4 w-4"
              required
            />
            <div>
              <div className="font-medium">{method.name}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
