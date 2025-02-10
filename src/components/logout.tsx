"use client";

import { useRouter } from "@/i18n/routing";
import { deleteBearerToken } from "@/app/[locale]/actions";
import Button from "./button";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await deleteBearerToken();
    router.push("/");
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} style="secondary">
      Logout
    </Button>
  );
}
