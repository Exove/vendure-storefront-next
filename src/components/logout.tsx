"use client";

import { useRouter } from "@/i18n/routing";
import { deleteBearerToken } from "@/app/[locale]/actions";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await deleteBearerToken();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}
