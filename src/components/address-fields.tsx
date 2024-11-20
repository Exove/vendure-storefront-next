import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface AddressFieldsProps {
  defaultAddress?: {
    fullName?: string | null;
    streetLine1: string | null;
    postalCode?: string | null;
    city?: string | null;
    country: {
      code?: string | null;
    };
  };
}

export default function AddressFields({ defaultAddress }: AddressFieldsProps) {
  return (
    <div className="space-y-2">
      <input
        name="fullName"
        type="text"
        defaultValue={defaultAddress?.fullName ?? ""}
        placeholder="Full name"
        className="w-full rounded bg-slate-800 px-3 py-2"
      />
      <input
        name="streetLine1"
        type="text"
        defaultValue={defaultAddress?.streetLine1 ?? ""}
        placeholder="Street address"
        className="w-full rounded bg-slate-800 px-3 py-2"
      />
      <div className="flex gap-2">
        <input
          name="postalCode"
          type="text"
          defaultValue={defaultAddress?.postalCode ?? ""}
          placeholder="Postal code"
          className="w-1/3 rounded bg-slate-800 px-3 py-2"
        />
        <input
          name="city"
          type="text"
          defaultValue={defaultAddress?.city ?? ""}
          placeholder="City"
          className="w-2/3 rounded bg-slate-800 px-3 py-2"
        />
      </div>
      <div className="relative">
        <select
          name="countryCode"
          defaultValue={defaultAddress?.country.code ?? "FI"}
          className="w-full appearance-none rounded bg-slate-800 px-3 py-2 pr-8"
        >
          <option value="FI">Finland</option>
          <option value="SE">Sweden</option>
          <option value="NO">Norway</option>
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 stroke-2 text-slate-400" />
      </div>
    </div>
  );
}
