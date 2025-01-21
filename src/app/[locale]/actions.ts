"use server";
import { cookies } from "next/headers";
import request, { GraphQLClient } from "graphql-request";
import { API_URL } from "@/common/constants";
import { filteredProductsQuery } from "@/common/queries";
import { getFragmentData } from "@/gql";
import {
  adjustOrderLine,
  createCustomerAddress,
  getActiveOrder,
  removeCreditBalance,
  removeItemFromOrder,
  updateCustomer,
  updateCustomerAddress,
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
  const cookieStore = await cookies();
  const bearerToken = cookieStore.get("vendure-bearer-token");

  const graphQLClient = new GraphQLClient(API_URL, {
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken?.value && {
        Authorization: `Bearer ${bearerToken.value}`,
      }),
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
  const graphQLClient = new GraphQLClient(API_URL, {
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

export const getFilteredProductsAction = async (
  term: string,
  skip: number,
  take: number,
  facetValueFilters: { and: string }[],
  groupByProduct: boolean,
) => {
  const { search } = await request(API_URL, filteredProductsQuery, {
    term,
    skip,
    take,
    facetValueFilters,
    groupByProduct,
  });
  return search;
};

export const removeCreditBalanceAction = async (id: string) => {
  const result = await removeCreditBalance(id);
  return result;
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
