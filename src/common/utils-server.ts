import { GraphQLClient } from "graphql-request";
import { API_URL } from "./constants";
import { cookies } from "next/headers";
import { getFragmentData } from "../gql/fragment-masking";
import {
  activeCustomerQuery,
  activeOrderFragment,
  activeOrderQuery,
  adjustOrderLineMutation,
  createCustomerAddressMutation,
  getPaymentMethodsQuery,
  getShippingMethodsQuery,
  removeItemFromOrderMutation,
} from "./queries";
import { CreateAddressInput } from "../gql/graphql";

// Create reusable function to get GraphQL client with auth cookies
async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const sessionSigCookie = cookieStore.get("session.sig");

  return new GraphQLClient(API_URL, {
    headers: {
      Cookie: `session=${sessionCookie?.value}; session.sig=${sessionSigCookie?.value}`,
    },
  });
}

export async function getActiveOrder() {
  const client = await getAuthenticatedClient();
  const { activeOrder } = await client.request(activeOrderQuery);
  return activeOrder;
}

export async function removeItemFromOrder(orderLineId: string) {
  const client = await getAuthenticatedClient();
  const { removeOrderLine } = await client.request(
    removeItemFromOrderMutation,
    { orderLineId },
  );
  return removeOrderLine;
}

export async function adjustOrderLine(orderLineId: string, quantity: number) {
  const client = await getAuthenticatedClient();
  const { adjustOrderLine } = await client.request(adjustOrderLineMutation, {
    orderLineId,
    quantity,
  });
  return adjustOrderLine;
}

export async function getActiveOrderWithFragment() {
  const activeOrder = await getActiveOrder();
  return getFragmentData(activeOrderFragment, activeOrder);
}

export async function getLoggedInUser() {
  const client = await getAuthenticatedClient();
  const { activeCustomer } = await client.request(activeCustomerQuery);
  return activeCustomer;
}

export async function createCustomerAddress(input: CreateAddressInput) {
  const client = await getAuthenticatedClient();
  const { createCustomerAddress } = await client.request(
    createCustomerAddressMutation,
    { input },
  );
  return createCustomerAddress;
}

export async function getPaymentMethods() {
  const client = await getAuthenticatedClient();
  const { eligiblePaymentMethods } = await client.request(
    getPaymentMethodsQuery,
  );
  return eligiblePaymentMethods;
}

export async function getShippingMethods() {
  const client = await getAuthenticatedClient();
  const { eligibleShippingMethods } = await client.request(
    getShippingMethodsQuery,
  );
  return eligibleShippingMethods;
}
