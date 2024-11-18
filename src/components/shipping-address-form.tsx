import { GetActiveCustomerQuery } from "@/gql/graphql";
import { motion } from "motion/react";

interface ShippingAddressFormProps {
  activeUser: GetActiveCustomerQuery["activeCustomer"];
  editingAddress: boolean;
  setEditingAddress: (editing: boolean) => void;
}

export default function ShippingAddressForm({
  activeUser,
  editingAddress,
  setEditingAddress,
}: ShippingAddressFormProps) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
        {activeUser?.addresses?.[0] && (
          <button
            type="button"
            onClick={() => setEditingAddress(!editingAddress)}
          >
            {editingAddress ? "Cancel" : "Edit"}
          </button>
        )}
      </div>

      {/* Use existing address by default */}
      {!editingAddress && activeUser?.addresses?.[0] ? (
        <div>
          <input
            type="hidden"
            name="fullName"
            value={activeUser?.addresses[0].fullName || ""}
          />
          <input
            type="hidden"
            name="streetLine1"
            value={activeUser?.addresses[0].streetLine1 || ""}
          />
          <input
            type="hidden"
            name="city"
            value={activeUser?.addresses[0].city || ""}
          />
          <input
            type="hidden"
            name="postalCode"
            value={activeUser?.addresses[0].postalCode || ""}
          />
          <div>
            <div>{activeUser?.addresses?.[0]?.fullName}</div>
            <div>{activeUser?.addresses?.[0]?.streetLine1}</div>
            <div>
              {activeUser?.addresses?.[0]?.postalCode}{" "}
              {activeUser?.addresses?.[0]?.city}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0.5, scale: 0.95 }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="fullName" className="block text-sm text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="mt-1 block w-full rounded-md p-2 text-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="streetLine1"
              className="block text-sm text-slate-400"
            >
              Street Address
            </label>
            <input
              type="text"
              id="streetLine1"
              name="streetLine1"
              className="mt-1 block w-full rounded-md p-2 text-black"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-slate-400">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="mt-1 block w-full rounded-md p-2 text-black"
                required
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm text-slate-400"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                className="mt-1 block w-full rounded-md p-2 text-black"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveAddress"
              name="saveAddress"
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="saveAddress" className="text-sm text-slate-400">
              Save address
            </label>
          </div>
        </motion.div>
      )}
    </section>
  );
}
