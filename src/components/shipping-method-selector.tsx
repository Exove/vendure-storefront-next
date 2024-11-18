import { GetShippingMethodsQuery } from "@/gql/graphql";
import RadioOption from "./radio-option";

interface ShippingMethodSelectorProps {
  shippingMethods: GetShippingMethodsQuery["eligibleShippingMethods"];
}

export default function ShippingMethodSelector({
  shippingMethods,
}: ShippingMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Toimitustapa</h2>
      <div className="space-y-2">
        {shippingMethods.map((method) => (
          <RadioOption
            key={method.id}
            name={method.name}
            value={method.id}
            groupName="shippingMethod"
          />
        ))}
      </div>
    </div>
  );
}
