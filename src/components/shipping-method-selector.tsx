import { GetShippingMethodsQuery } from "@/gql/graphql";

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
          <label
            key={method.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
          >
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              className="h-4 w-4"
              required
            />
            <div>
              <div className="font-medium">{method.name}</div>
              <div className="text-sm text-gray-500">{method.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
