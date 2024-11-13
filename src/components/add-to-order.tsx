"use client";

import { API_URL } from "@/common/constants";
import { addItemToOrderMutation, loginMutation } from "@/common/queries";
import { GraphQLClient } from "graphql-request";

interface AddToOrderProps {
  productVariantId: string;
  quantity?: number;
}

export default function AddToOrder({
  productVariantId,
  quantity = 1,
}: AddToOrderProps) {
  const addToCart = async () => {
    try {
      const graphQLClient = new GraphQLClient(API_URL, {
        credentials: "include",
      });
      await graphQLClient.request(addItemToOrderMutation, {
        productVariantId,
        quantity,
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const login = async () => {
    try {
      const graphQLClient = new GraphQLClient(API_URL, {
        credentials: "include",
      });
      const user = await graphQLClient.request(loginMutation, {
        emailAddress: "test@test.com",
        password: "test",
        rememberMe: true,
      });

      console.log("user", user);
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <div>
      <button
        onClick={addToCart}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add to cart
      </button>
      <button onClick={login}>Login</button>
    </div>
  );
}
