import { GraphQLClient } from "graphql-request";
import { API_URL } from "./constants";
import { cookies } from "next/headers";
import { getFragmentData } from "../gql/fragment-masking";
import {
  activeCustomerQuery,
  activeOrderFragment,
  activeOrderQuery,
} from "./queries";

export async function getActiveOrder() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const sessionSigCookie = cookieStore.get("session.sig");

  const graphQLClient = new GraphQLClient(API_URL, {
    headers: {
      Cookie: `session=${sessionCookie?.value}; session.sig=${sessionSigCookie?.value}`,
    },
  });
  const { activeOrder } = await graphQLClient.request(activeOrderQuery);
  return activeOrder;
}

export async function getActiveOrderWithFragment() {
  const activeOrder = await getActiveOrder();
  return getFragmentData(activeOrderFragment, activeOrder);
}

export async function getLoggedInUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const sessionSigCookie = cookieStore.get("session.sig");

  const graphQLClient = new GraphQLClient(API_URL, {
    headers: {
      Cookie: `session=${sessionCookie?.value}; session.sig=${sessionSigCookie?.value}`,
    },
  });
  const { activeCustomer } = await graphQLClient.request(activeCustomerQuery);
  return activeCustomer;
}
