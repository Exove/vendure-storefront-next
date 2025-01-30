"use server";
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { VENDURE_API_URL } from "@/common/constants";
import { getFragmentData } from "@/gql";
import {
  adjustOrderLine,
  createCustomerAddress,
  getActiveOrder,
  getAuthenticatedClient,
  removeItemFromOrder,
  updateCustomer,
  updateCustomerAddress,
  getLoggedInUser,
  getFilteredProducts,
} from "@/common/utils-server";
import {
  CreateAddressInput,
  UpdateAddressInput,
  UpdateCustomerInput,
} from "@/gql/graphql";
import {
  addPaymentToOrderMutation,
  setOrderShippingAddressMutation,
  setOrderShippingMethodMutation,
  transitionToStateMutation,
  setCustomerForOrderMutation,
} from "@/common/mutations";
import { activeOrderFragment } from "@/common/fragments";

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
  const client = await getAuthenticatedClient();

  // Check if user is logged in
  const activeCustomer = await getLoggedInUser();

  // Set customer details
  if (!activeCustomer) {
    const [firstName, ...lastNameParts] = shippingDetails.fullName.split(" ");
    await client.request(setCustomerForOrderMutation, {
      input: {
        firstName,
        lastName: lastNameParts.join(" "),
        emailAddress: "guest@example.com", // TODO: Get from form
      },
    });
  }

  // Set shipping address
  await client.request(setOrderShippingAddressMutation, {
    input: shippingDetails,
  });

  // Set shipping method
  await client.request(setOrderShippingMethodMutation, {
    id: [shippingMethod],
  });

  // Transition to ArrangingPayment
  await client.request(transitionToStateMutation, {
    state: "ArrangingPayment",
  });

  // Add payment
  await client.request(addPaymentToOrderMutation, {
    input: {
      method: paymentMethod,
      metadata: {
        shouldDecline: false,
        shouldError: false,
        shouldErrorOnSettle: false,
      },
    },
  });
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

export const getFilteredProductsAction = async (
  term: string,
  skip: number,
  take: number,
  facetValueFilters: { or: string[] }[],
  groupByProduct: boolean,
) => {
  const result = await getFilteredProducts(
    term,
    skip,
    take,
    facetValueFilters,
    groupByProduct,
  );
  return result;
};

export const createCustomerAddressAction = async (
  input: CreateAddressInput,
) => {
  const result = await createCustomerAddress(input);
  return result;
};

export const updateCustomerAddressAction = async (
  input: UpdateAddressInput,
) => {
  const result = await updateCustomerAddress(input);
  return result;
};

export const setOrderShippingAddressAction = async (
  input: CreateAddressInput,
) => {
  const cookieStore = await cookies();
  const bearerToken = cookieStore.get("vendure-bearer-token");
  const graphQLClient = new GraphQLClient(VENDURE_API_URL, {
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken?.value && {
        Authorization: `Bearer ${bearerToken.value}`,
      }),
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

export const updateCustomerAction = async (input: UpdateCustomerInput) => {
  const result = await updateCustomer(input);
  return result;
};

export async function setBearerToken(token: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "vendure-bearer-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function getBearerToken() {
  const cookieStore = await cookies();
  return cookieStore.get("vendure-bearer-token");
}

export async function deleteBearerToken() {
  const cookieStore = await cookies();

  cookieStore.delete("vendure-bearer-token");
}
