"use client";

import { API_URL } from "@/common/constants";
import { logoutMutation } from "@/common/queries";
import { GraphQLClient } from "graphql-request";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const graphQLClient = new GraphQLClient(API_URL, {
        credentials: "include",
      });

      await graphQLClient.request(logoutMutation);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
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
