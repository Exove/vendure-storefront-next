"use server";
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { API_URL } from "@/common/constants";
import {
  transitionToStateMutation,
  setOrderShippingMethodMutation,
  addPaymentToOrderMutation,
} from "@/common/queries";

export async function placeOrder() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const sessionSigCookie = cookieStore.get("session.sig");
  const graphQLClient = new GraphQLClient(API_URL, {
    headers: {
      Cookie: `session=${sessionCookie?.value}; session.sig=${sessionSigCookie?.value}`,
    },
  });

  try {
    // Set shipping method
    const { setOrderShippingMethod } = await graphQLClient.request(
      setOrderShippingMethodMutation,
      { id: ["1"] }
    );

    if ("errorCode" in setOrderShippingMethod) {
      throw new Error(setOrderShippingMethod.message);
    }

    // Transition order to payment state
    await graphQLClient.request(transitionToStateMutation, {
      state: "ArrangingPayment",
    });

    // Add payment to order
    const { addPaymentToOrder } = await graphQLClient.request(
      addPaymentToOrderMutation,
      {
        input: {
          method: "standard-payment",
          metadata: {
            shouldDecline: false,
            shouldError: false,
            shouldErrorOnSettle: false,
          },
        },
      }
    );

    console.log("addPaymentToOrder", addPaymentToOrder);
    return addPaymentToOrder;
  } catch (error) {
    console.error("Failed to place order:", error);
    throw error;
  }
}
