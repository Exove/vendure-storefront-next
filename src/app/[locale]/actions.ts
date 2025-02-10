"use server";
import { cookies } from "next/headers";
import { GraphQLClient } from "graphql-request";
import { VENDURE_API_URL, VENDURE_BEARER_TOKEN_KEY } from "@/common/constants";
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
  getCollections,
  registerCustomer,
  verifyCustomer,
} from "@/common/utils-server";
import {
  CreateAddressInput,
  UpdateAddressInput,
  UpdateCustomerInput,
  SearchResultSortParameter,
  RegisterCustomerInput,
} from "@/gql/graphql";
import {
  addPaymentToOrderMutation,
  setOrderShippingAddressMutation,
  setOrderShippingMethodMutation,
  transitionToStateMutation,
  setCustomerForOrderMutation,
  deleteCustomerAddressMutation,
  updateCustomerAddressMutation,
  setOrderBillingAddressMutation,
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
  billingDetails?: {
    fullName: string;
    streetLine1: string;
    city: string;
    postalCode: string;
    countryCode: string;
  },
  guestDetails?: {
    emailAddress: string;
    phoneNumber: string;
  },
) {
  const client = await getAuthenticatedClient();

  try {
    // Check if user is logged in
    const activeCustomer = await getLoggedInUser();

    // Set customer details for guest users first
    if (!activeCustomer && guestDetails) {
      const [firstName, ...lastNameParts] = shippingDetails.fullName.split(" ");
      const customerResult = await client.request(setCustomerForOrderMutation, {
        input: {
          firstName,
          lastName: lastNameParts.join(" "),
          emailAddress: guestDetails.emailAddress,
          phoneNumber: guestDetails.phoneNumber,
          title: "Guest",
        },
      });

      if ("errorCode" in customerResult.setCustomerForOrder) {
        // If the email is already in use, continue without setting customer details
        if (
          customerResult.setCustomerForOrder.message.includes(
            "email address is not available",
          )
        ) {
          console.log("Email already exists, continuing with order...");
        } else {
          throw new Error(
            `Failed to set customer: ${customerResult.setCustomerForOrder.message}`,
          );
        }
      }
    }

    // Set shipping method
    const shippingMethodResult = await client.request(
      setOrderShippingMethodMutation,
      {
        id: [shippingMethod],
      },
    );

    if ("errorCode" in shippingMethodResult.setOrderShippingMethod) {
      throw new Error(
        `Failed to set shipping method: ${shippingMethodResult.setOrderShippingMethod.message}`,
      );
    }

    // Set shipping address
    const shippingAddressResult = await client.request(
      setOrderShippingAddressMutation,
      {
        input: shippingDetails,
      },
    );

    if ("errorCode" in shippingAddressResult.setOrderShippingAddress) {
      throw new Error(
        `Failed to set shipping address: ${shippingAddressResult.setOrderShippingAddress.message}`,
      );
    }

    // Set billing address if provided, otherwise use shipping address
    const billingAddress = billingDetails || shippingDetails;
    const billingAddressResult = await client.request(
      setOrderBillingAddressMutation,
      {
        input: billingAddress,
      },
    );

    if ("errorCode" in billingAddressResult.setOrderBillingAddress) {
      throw new Error(
        `Failed to set billing address: ${billingAddressResult.setOrderBillingAddress.message}`,
      );
    }

    // Transition to ArrangingPayment
    const transitionResult = await client.request(transitionToStateMutation, {
      state: "ArrangingPayment",
    });

    if (!transitionResult.transitionOrderToState) {
      throw new Error("Failed to transition order state: No response received");
    }

    if ("errorCode" in transitionResult.transitionOrderToState) {
      throw new Error(
        `Failed to transition order state: ${transitionResult.transitionOrderToState.message}`,
      );
    }

    // Add payment
    const paymentResult = await client.request(addPaymentToOrderMutation, {
      input: {
        method: paymentMethod,
        metadata: {
          shouldDecline: false,
          shouldError: false,
          shouldErrorOnSettle: false,
        },
      },
    });

    if ("errorCode" in paymentResult.addPaymentToOrder) {
      throw new Error(
        `Failed to add payment: ${paymentResult.addPaymentToOrder.message}`,
      );
    }
  } catch (error) {
    console.error("Order placement failed:", error);
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

export const getFilteredProductsAction = async (
  collectionSlug: string,
  term: string,
  skip: number,
  take: number,
  facetValueFilters: { or: string[] }[],
  groupByProduct: boolean,
  priceMin?: number | null,
  priceMax?: number | null,
  sort?: SearchResultSortParameter,
) => {
  const result = await getFilteredProducts(
    collectionSlug,
    term,
    skip,
    take,
    facetValueFilters,
    groupByProduct,
    priceMin,
    priceMax,
    sort,
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
  const bearerToken = cookieStore.get(VENDURE_BEARER_TOKEN_KEY);
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
    name: VENDURE_BEARER_TOKEN_KEY,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function getBearerToken() {
  const cookieStore = await cookies();
  return cookieStore.get(VENDURE_BEARER_TOKEN_KEY);
}

export async function deleteBearerToken() {
  const cookieStore = await cookies();

  cookieStore.delete(VENDURE_BEARER_TOKEN_KEY);
}

export const getCollectionsAction = async () => {
  const result = await getCollections();
  return result;
};

export const registerCustomerAction = async (input: RegisterCustomerInput) => {
  const result = await registerCustomer(input);
  return result;
};

export const verifyCustomerAction = async (token: string, password: string) => {
  const result = await verifyCustomer(token, password);
  return result;
};

export const deleteCustomerAddressAction = async (addressId: string) => {
  const client = await getAuthenticatedClient();
  const { deleteCustomerAddress } = await client.request(
    deleteCustomerAddressMutation,
    { id: addressId },
  );
  return deleteCustomerAddress;
};

export const setDefaultAddressAction = async (addressId: string) => {
  const client = await getAuthenticatedClient();
  const { updateCustomerAddress } = await client.request(
    updateCustomerAddressMutation,
    { input: { id: addressId, defaultShippingAddress: true } },
  );
  return updateCustomerAddress;
};

export const getLoggedInUserAction = async () => {
  const result = await getLoggedInUser();
  return result;
};
