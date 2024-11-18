"use server";
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { API_URL } from "@/common/constants";
import {
  transitionToStateMutation,
  setOrderShippingMethodMutation,
  addPaymentToOrderMutation,
  activeOrderFragment,
  setOrderShippingAddressMutation,
} from "@/common/queries";
import { getFragmentData } from "@/gql";
import {
  adjustOrderLine,
  createCustomerAddress,
  getActiveOrder,
  removeItemFromOrder,
} from "@/common/utils-server";
import { CreateAddressInput } from "@/gql/graphql";

export async function placeOrderAction(
  shippingDetails: {
    fullName: string;
    streetLine1: string;
    city: string;
    postalCode: string;
    countryCode: string;
  },
  paymentMethod: string,
  shippingMethod: string,
) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const sessionSigCookie = cookieStore.get("session.sig");
  const graphQLClient = new GraphQLClient(API_URL, {
    headers: {
      Cookie: `session=${sessionCookie?.value}; session.sig=${sessionSigCookie?.value}`,
    },
  });

  // Set shipping address
  const { setOrderShippingAddress } = await graphQLClient.request(
    setOrderShippingAddressMutation,
    {
      input: shippingDetails,
    },
  );

  if ("errorCode" in setOrderShippingAddress) {
    throw new Error(setOrderShippingAddress.message);
  }

  try {
    // Set shipping method
    const { setOrderShippingMethod } = await graphQLClient.request(
      setOrderShippingMethodMutation,
      { id: [shippingMethod] },
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
          method: paymentMethod,
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

export const createCustomerAddressAction = async (
  input: CreateAddressInput,
) => {
  const result = await createCustomerAddress(input);
  return result;
};

export const setOrderShippingAddressAction = async (
  input: CreateAddressInput,
) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const sessionSigCookie = cookieStore.get("session.sig");
  const graphQLClient = new GraphQLClient(API_URL, {
    headers: {
      Cookie: `session=${sessionCookie?.value}; session.sig=${sessionSigCookie?.value}`,
    },
  });

  try {
    const { setOrderShippingAddress } = await graphQLClient.request(
      setOrderShippingAddressMutation,
      { input },
    );

    if ("errorCode" in setOrderShippingAddress) {
      throw new Error(setOrderShippingAddress.message);
    }

    return getFragmentData(activeOrderFragment, setOrderShippingAddress);
  } catch (error) {
    console.error("Failed to set shipping address:", error);
    throw error;
  }
};
