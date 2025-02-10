import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Address");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300">
          {t("fullName")}
        </label>
        <input
          name="fullName"
          type="text"
          defaultValue={defaultAddress?.fullName ?? ""}
          placeholder={t("fullName")}
          className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          {t("streetAddress")}
        </label>
        <input
          name="streetLine1"
          type="text"
          defaultValue={defaultAddress?.streetLine1 ?? ""}
          placeholder={t("streetAddress")}
          className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-slate-300">
            {t("postalCode")}
          </label>
          <input
            name="postalCode"
            type="text"
            defaultValue={defaultAddress?.postalCode ?? ""}
            placeholder={t("postalCode")}
            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
          />
        </div>
        <div className="w-2/3">
          <label className="block text-sm font-medium text-slate-300">
            {t("city")}
          </label>
          <input
            name="city"
            type="text"
            defaultValue={defaultAddress?.city ?? ""}
            placeholder={t("city")}
            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          {t("country")}
        </label>
        <div className="relative">
          <select
            name="countryCode"
            defaultValue={defaultAddress?.country.code ?? "FI"}
            className="mt-1 block w-full appearance-none rounded-md border-slate-600 bg-slate-700 px-3 py-2 pr-8"
          >
            <option value="FI">Finland</option>
            <option value="SE">Sweden</option>
            <option value="NO">Norway</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 stroke-2 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
