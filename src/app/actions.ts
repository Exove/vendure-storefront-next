"use server";
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { API_URL } from "@/common/constants";
import {
  transitionToStateMutation,
  setOrderShippingMethodMutation,
  addPaymentToOrderMutation,
  activeOrderFragment,
  adjustOrderLineMutation,
} from "@/common/queries";
import { getFragmentData } from "@/gql";
import {
  adjustOrderLine,
  getActiveOrder,
  removeItemFromOrder,
} from "@/common/utils-server";

export async function placeOrderAction() {
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
      { id: ["1"] },
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
      },
    );

    console.log("addPaymentToOrder", addPaymentToOrder);
    return addPaymentToOrder;
  } catch (error) {
    console.error("Failed to place order:", error);
    throw error;
  }
}

export const activeOrderAction = async () => {
  const result = await getActiveOrder();
  if (!result) {
    throw new Error("No active order found");
  }
  if ("errorCode" in result) {
    throw new Error("An error occurred fetching the active order");
  }
  return getFragmentData(activeOrderFragment, result);
};

export const removeItemFromOrderAction = async (orderLineId: string) => {
  const result = await removeItemFromOrder(orderLineId);
  if ("errorCode" in result) {
    throw new Error(result.message);
  }
  return getFragmentData(activeOrderFragment, result);
};

export const adjustOrderLineAction = async (
  orderLineId: string,
  quantity: number,
) => {
  const result = await adjustOrderLine(orderLineId, quantity);
  if ("errorCode" in result) {
    throw new Error(result.message);
  }
  return getFragmentData(activeOrderFragment, result);
};
