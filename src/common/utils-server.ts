import { GraphQLClient } from "graphql-request";
import { VENDURE_API_URL, VENDURE_BEARER_TOKEN_KEY } from "./constants";
import { cookies } from "next/headers";
import { getFragmentData } from "../gql/fragment-masking";
import {
  activeCustomerQuery,
  activeOrderQuery,
  getPaymentMethodsQuery,
  getShippingMethodsQuery,
  orderByCodeQuery,
  filteredProductsQuery,
  collectionsQuery,
} from "./queries";
import {
  CreateAddressInput,
  UpdateAddressInput,
  UpdateCustomerInput,
  GetFilteredProductsQuery,
  SearchResultSortParameter,
  RegisterCustomerInput,
} from "../gql/graphql";
import {
  adjustOrderLineMutation,
  createCustomerAddressMutation,
  removeItemFromOrderMutation,
  updateCustomerAddressMutation,
  updateCustomerMutation,
  registerMutation,
  verifyMutation,
} from "./mutations";
import { activeOrderFragment, orderFragment } from "./fragments";

// Create reusable function to get GraphQL client with auth cookies
export async function getAuthenticatedClient(apiUrl: string = VENDURE_API_URL) {
  const cookieStore = await cookies();
  const bearerToken = cookieStore.get(VENDURE_BEARER_TOKEN_KEY);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (bearerToken?.value) {
    headers["Authorization"] = `Bearer ${bearerToken.value}`;
  }

  return new GraphQLClient(apiUrl, { headers });
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

export async function updateCustomerAddress(input: UpdateAddressInput) {
  const client = await getAuthenticatedClient();
  const { updateCustomerAddress } = await client.request(
    updateCustomerAddressMutation,
    { input },
  );
  return updateCustomerAddress;
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

export async function getOrderByCode(id: string) {
  const client = await getAuthenticatedClient();
  const { orderByCode } = await client.request(orderByCodeQuery, { code: id });
  return getFragmentData(orderFragment, orderByCode);
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const client = await getAuthenticatedClient();
  const { updateCustomer } = await client.request(updateCustomerMutation, {
    input,
  });
  return updateCustomer;
}

export async function getFilteredProducts(
  collectionSlug: string,
  term: string,
  skip: number,
  take: number,
  facetValueFilters: { or: string[] }[],
  groupByProduct: boolean,
  priceMin?: number | null,
  priceMax?: number | null,
  sort?: SearchResultSortParameter,
) {
  const client = await getAuthenticatedClient();
  const { search } = await client.request<GetFilteredProductsQuery>(
    filteredProductsQuery,
    {
      collectionSlug,
      term,
      skip,
      take,
      facetValueFilters,
      groupByProduct,
      priceMin: priceMin ?? 0,
      priceMax: priceMax ?? 1000000000,
      sort,
    },
  );
  return search;
}

export async function getCollections() {
  const client = await getAuthenticatedClient();
  const { collections } = await client.request(collectionsQuery);
  return collections;
}

export async function registerCustomer(input: RegisterCustomerInput) {
  const client = await getAuthenticatedClient();
  const { registerCustomerAccount } = await client.request(registerMutation, {
    input,
  });
  return registerCustomerAccount;
}

export async function verifyCustomer(token: string, password: string) {
  const client = await getAuthenticatedClient();
  const { verifyCustomerAccount } = await client.request(verifyMutation, {
    token,
    password,
  });
  return verifyCustomerAccount;
}
