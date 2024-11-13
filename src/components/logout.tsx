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
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}
