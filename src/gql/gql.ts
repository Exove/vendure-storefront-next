/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
  "\n  fragment ActiveOrder on Order {\n    __typename\n    id\n    code\n    couponCodes\n    state\n    currencyCode\n    totalQuantity\n    subTotalWithTax\n    shippingWithTax\n    totalWithTax\n    customer {\n      emailAddress\n      phoneNumber\n    }\n    discounts {\n      description\n      amountWithTax\n    }\n    lines {\n      id\n      unitPriceWithTax\n      quantity\n      linePriceWithTax\n      productVariant {\n        id\n        name\n        product {\n          slug\n        }\n        sku\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n    shippingLines {\n      shippingMethod {\n        id\n        name\n        description\n      }\n      priceWithTax\n    }\n  }\n":
    types.ActiveOrderFragmentDoc,
  "\n  fragment Order on Order {\n    id\n    type\n    orderPlacedAt\n    code\n    state\n    active\n    totalWithTax\n    customer {\n      firstName\n      lastName\n      emailAddress\n      phoneNumber\n    }\n    shipping\n    shippingLines {\n      shippingMethod {\n        name\n        description\n        id\n      }\n    }\n    shippingAddress {\n      fullName\n      streetLine1\n      postalCode\n      city\n    }\n    lines {\n      id\n      unitPriceWithTax\n      quantity\n      linePriceWithTax\n      productVariant {\n        id\n        name\n        product {\n          slug\n        }\n        sku\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n  }\n":
    types.OrderFragmentDoc,
  "\n  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.AddItemToOrderDocument,
  "\n  mutation Login(\n    $emailAddress: String!\n    $password: String!\n    $rememberMe: Boolean!\n  ) {\n    login(\n      username: $emailAddress\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n    }\n  }\n":
    types.LoginDocument,
  "\n  mutation LogOut {\n    logout {\n      success\n    }\n  }\n":
    types.LogOutDocument,
  "\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.SetOrderShippingAddressDocument,
  "\n  mutation SetShippingMethod($id: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $id) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.SetShippingMethodDocument,
  "\n  mutation TransitionToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ...ActiveOrder\n      ... on OrderStateTransitionError {\n        errorCode\n        message\n        transitionError\n        fromState\n        toState\n      }\n    }\n  }\n":
    types.TransitionToStateDocument,
  "\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.AddPaymentToOrderDocument,
  "\n  mutation RemoveItemFromOrder($orderLineId: ID!) {\n    removeOrderLine(orderLineId: $orderLineId) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.RemoveItemFromOrderDocument,
  "\n  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {\n    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.AdjustOrderLineDocument,
  "\n  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {\n    updateCustomerAddress(input: $input) {\n      id\n      createdAt\n      updatedAt\n      fullName\n      company\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n      country {\n        code\n        name\n      }\n      phoneNumber\n      defaultShippingAddress\n      defaultBillingAddress\n    }\n  }\n":
    types.UpdateCustomerAddressDocument,
  "\n  mutation CreateCustomerAddress($input: CreateAddressInput!) {\n    createCustomerAddress(input: $input) {\n      id\n      createdAt\n      updatedAt\n      fullName\n      company\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n      country {\n        code\n        name\n      }\n      phoneNumber\n    }\n  }\n":
    types.CreateCustomerAddressDocument,
  "\n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      id\n    }\n  }\n":
    types.UpdateCustomerDocument,
  "\n  mutation SetCustomerForOrder($input: CreateCustomerInput!) {\n    setCustomerForOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.SetCustomerForOrderDocument,
  "\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.RegisterDocument,
  "\n  mutation Verify($password: String!, $token: String!) {\n    verifyCustomerAccount(password: $password, token: $token) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.VerifyDocument,
  "\n  mutation DeleteCustomerAddress($id: ID!) {\n    deleteCustomerAddress(id: $id) {\n      success\n    }\n  }\n":
    types.DeleteCustomerAddressDocument,
  "\n  mutation SetOrderBillingAddress($input: CreateAddressInput!) {\n    setOrderBillingAddress(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n":
    types.SetOrderBillingAddressDocument,
  "\n  query Products {\n    products {\n      items {\n        id\n        name\n        slug\n        collections {\n          name\n        }\n        variantList {\n          items {\n            priceWithTax\n          }\n        }\n        assets {\n          source\n          width\n          height\n        }\n      }\n    }\n  }\n":
    types.ProductsDocument,
  "\n  query ProductBySlug($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      description\n      assets {\n        source\n        width\n        height\n      }\n      variants {\n        name\n        price\n        priceWithTax\n        id\n      }\n      collections {\n        name\n        position\n        parent {\n          name\n        }\n        breadcrumbs {\n          name\n          id\n          slug\n        }\n      }\n      optionGroups {\n        name\n      }\n      languageCode\n      translations {\n        name\n        description\n      }\n    }\n  }\n":
    types.ProductBySlugDocument,
  "\n  query GetFilteredProducts(\n    $term: String\n    $collectionId: ID\n    $collectionSlug: String\n    $groupByProduct: Boolean\n    $take: Int\n    $skip: Int\n    $sort: SearchResultSortParameter\n    $facetValueFilters: [FacetValueFilterInput!]\n    $priceMin: Int!\n    $priceMax: Int!\n  ) {\n    search(\n      input: {\n        term: $term\n        collectionId: $collectionId\n        collectionSlug: $collectionSlug\n        groupByProduct: $groupByProduct\n        take: $take\n        skip: $skip\n        sort: $sort\n        facetValueFilters: $facetValueFilters\n        priceRangeWithTax: { min: $priceMin, max: $priceMax }\n      }\n    ) {\n      collections {\n        collection {\n          name\n          parent {\n            name\n          }\n        }\n      }\n      totalItems\n      facetValues {\n        count\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n      }\n      items {\n        productName\n        slug\n        productAsset {\n          id\n          preview\n        }\n        priceWithTax {\n          ... on SinglePrice {\n            __typename\n            value\n          }\n          ... on PriceRange {\n            __typename\n            min\n            max\n          }\n        }\n        currencyCode\n      }\n    }\n  }\n":
    types.GetFilteredProductsDocument,
  "\n  query ActiveOrder {\n    activeOrder {\n      ...ActiveOrder\n    }\n  }\n":
    types.ActiveOrderDocument,
  "\n  query GetActiveCustomer {\n    activeCustomer {\n      id\n      firstName\n      lastName\n      emailAddress\n      orders {\n        items {\n          state\n          orderPlacedAt\n          lines {\n            quantity\n            productVariant {\n              name\n            }\n          }\n        }\n      }\n      addresses {\n        id\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country {\n          code\n          name\n        }\n        phoneNumber\n        defaultShippingAddress\n        defaultBillingAddress\n      }\n    }\n  }\n":
    types.GetActiveCustomerDocument,
  "\n  query GetShippingMethods {\n    eligibleShippingMethods {\n      id\n      price\n      priceWithTax\n      code\n      name\n      description\n    }\n  }\n":
    types.GetShippingMethodsDocument,
  "\n  query GetPaymentMethods {\n    eligiblePaymentMethods {\n      id\n      name\n      code\n      isEligible\n    }\n  }\n":
    types.GetPaymentMethodsDocument,
  "\n  query GetOrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      id\n      state\n    }\n  }\n":
    types.GetOrderByCodeDocument,
  "\n  query OrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      ...Order\n    }\n  }\n":
    types.OrderByCodeDocument,
  "\n  query Collections {\n    collections {\n      items {\n        name\n        slug\n        id\n        parent {\n          name\n        }\n        children {\n          name\n          slug\n          id\n        }\n      }\n    }\n  }\n":
    types.CollectionsDocument,
  "\n  query CollectionBySlug($slug: String!) {\n    collection(slug: $slug) {\n      name\n      parent {\n        name\n        slug\n      }\n    }\n  }\n":
    types.CollectionBySlugDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment ActiveOrder on Order {\n    __typename\n    id\n    code\n    couponCodes\n    state\n    currencyCode\n    totalQuantity\n    subTotalWithTax\n    shippingWithTax\n    totalWithTax\n    customer {\n      emailAddress\n      phoneNumber\n    }\n    discounts {\n      description\n      amountWithTax\n    }\n    lines {\n      id\n      unitPriceWithTax\n      quantity\n      linePriceWithTax\n      productVariant {\n        id\n        name\n        product {\n          slug\n        }\n        sku\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n    shippingLines {\n      shippingMethod {\n        id\n        name\n        description\n      }\n      priceWithTax\n    }\n  }\n",
): (typeof documents)["\n  fragment ActiveOrder on Order {\n    __typename\n    id\n    code\n    couponCodes\n    state\n    currencyCode\n    totalQuantity\n    subTotalWithTax\n    shippingWithTax\n    totalWithTax\n    customer {\n      emailAddress\n      phoneNumber\n    }\n    discounts {\n      description\n      amountWithTax\n    }\n    lines {\n      id\n      unitPriceWithTax\n      quantity\n      linePriceWithTax\n      productVariant {\n        id\n        name\n        product {\n          slug\n        }\n        sku\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n    shippingLines {\n      shippingMethod {\n        id\n        name\n        description\n      }\n      priceWithTax\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment Order on Order {\n    id\n    type\n    orderPlacedAt\n    code\n    state\n    active\n    totalWithTax\n    customer {\n      firstName\n      lastName\n      emailAddress\n      phoneNumber\n    }\n    shipping\n    shippingLines {\n      shippingMethod {\n        name\n        description\n        id\n      }\n    }\n    shippingAddress {\n      fullName\n      streetLine1\n      postalCode\n      city\n    }\n    lines {\n      id\n      unitPriceWithTax\n      quantity\n      linePriceWithTax\n      productVariant {\n        id\n        name\n        product {\n          slug\n        }\n        sku\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment Order on Order {\n    id\n    type\n    orderPlacedAt\n    code\n    state\n    active\n    totalWithTax\n    customer {\n      firstName\n      lastName\n      emailAddress\n      phoneNumber\n    }\n    shipping\n    shippingLines {\n      shippingMethod {\n        name\n        description\n        id\n      }\n    }\n    shippingAddress {\n      fullName\n      streetLine1\n      postalCode\n      city\n    }\n    lines {\n      id\n      unitPriceWithTax\n      quantity\n      linePriceWithTax\n      productVariant {\n        id\n        name\n        product {\n          slug\n        }\n        sku\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      ... on Order {\n        id\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Login(\n    $emailAddress: String!\n    $password: String!\n    $rememberMe: Boolean!\n  ) {\n    login(\n      username: $emailAddress\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation Login(\n    $emailAddress: String!\n    $password: String!\n    $rememberMe: Boolean!\n  ) {\n    login(\n      username: $emailAddress\n      password: $password\n      rememberMe: $rememberMe\n    ) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation LogOut {\n    logout {\n      success\n    }\n  }\n",
): (typeof documents)["\n  mutation LogOut {\n    logout {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SetShippingMethod($id: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $id) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation SetShippingMethod($id: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $id) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation TransitionToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ...ActiveOrder\n      ... on OrderStateTransitionError {\n        errorCode\n        message\n        transitionError\n        fromState\n        toState\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation TransitionToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ...ActiveOrder\n      ... on OrderStateTransitionError {\n        errorCode\n        message\n        transitionError\n        fromState\n        toState\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation RemoveItemFromOrder($orderLineId: ID!) {\n    removeOrderLine(orderLineId: $orderLineId) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation RemoveItemFromOrder($orderLineId: ID!) {\n    removeOrderLine(orderLineId: $orderLineId) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {\n    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {\n    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {\n    updateCustomerAddress(input: $input) {\n      id\n      createdAt\n      updatedAt\n      fullName\n      company\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n      country {\n        code\n        name\n      }\n      phoneNumber\n      defaultShippingAddress\n      defaultBillingAddress\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {\n    updateCustomerAddress(input: $input) {\n      id\n      createdAt\n      updatedAt\n      fullName\n      company\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n      country {\n        code\n        name\n      }\n      phoneNumber\n      defaultShippingAddress\n      defaultBillingAddress\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateCustomerAddress($input: CreateAddressInput!) {\n    createCustomerAddress(input: $input) {\n      id\n      createdAt\n      updatedAt\n      fullName\n      company\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n      country {\n        code\n        name\n      }\n      phoneNumber\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateCustomerAddress($input: CreateAddressInput!) {\n    createCustomerAddress(input: $input) {\n      id\n      createdAt\n      updatedAt\n      fullName\n      company\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n      country {\n        code\n        name\n      }\n      phoneNumber\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateCustomer($input: UpdateCustomerInput!) {\n    updateCustomer(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SetCustomerForOrder($input: CreateCustomerInput!) {\n    setCustomerForOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation SetCustomerForOrder($input: CreateCustomerInput!) {\n    setCustomerForOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Verify($password: String!, $token: String!) {\n    verifyCustomerAccount(password: $password, token: $token) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation Verify($password: String!, $token: String!) {\n    verifyCustomerAccount(password: $password, token: $token) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteCustomerAddress($id: ID!) {\n    deleteCustomerAddress(id: $id) {\n      success\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteCustomerAddress($id: ID!) {\n    deleteCustomerAddress(id: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SetOrderBillingAddress($input: CreateAddressInput!) {\n    setOrderBillingAddress(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation SetOrderBillingAddress($input: CreateAddressInput!) {\n    setOrderBillingAddress(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Products {\n    products {\n      items {\n        id\n        name\n        slug\n        collections {\n          name\n        }\n        variantList {\n          items {\n            priceWithTax\n          }\n        }\n        assets {\n          source\n          width\n          height\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query Products {\n    products {\n      items {\n        id\n        name\n        slug\n        collections {\n          name\n        }\n        variantList {\n          items {\n            priceWithTax\n          }\n        }\n        assets {\n          source\n          width\n          height\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query ProductBySlug($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      description\n      assets {\n        source\n        width\n        height\n      }\n      variants {\n        name\n        price\n        priceWithTax\n        id\n      }\n      collections {\n        name\n        position\n        parent {\n          name\n        }\n        breadcrumbs {\n          name\n          id\n          slug\n        }\n      }\n      optionGroups {\n        name\n      }\n      languageCode\n      translations {\n        name\n        description\n      }\n    }\n  }\n",
): (typeof documents)["\n  query ProductBySlug($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      description\n      assets {\n        source\n        width\n        height\n      }\n      variants {\n        name\n        price\n        priceWithTax\n        id\n      }\n      collections {\n        name\n        position\n        parent {\n          name\n        }\n        breadcrumbs {\n          name\n          id\n          slug\n        }\n      }\n      optionGroups {\n        name\n      }\n      languageCode\n      translations {\n        name\n        description\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetFilteredProducts(\n    $term: String\n    $collectionId: ID\n    $collectionSlug: String\n    $groupByProduct: Boolean\n    $take: Int\n    $skip: Int\n    $sort: SearchResultSortParameter\n    $facetValueFilters: [FacetValueFilterInput!]\n    $priceMin: Int!\n    $priceMax: Int!\n  ) {\n    search(\n      input: {\n        term: $term\n        collectionId: $collectionId\n        collectionSlug: $collectionSlug\n        groupByProduct: $groupByProduct\n        take: $take\n        skip: $skip\n        sort: $sort\n        facetValueFilters: $facetValueFilters\n        priceRangeWithTax: { min: $priceMin, max: $priceMax }\n      }\n    ) {\n      collections {\n        collection {\n          name\n          parent {\n            name\n          }\n        }\n      }\n      totalItems\n      facetValues {\n        count\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n      }\n      items {\n        productName\n        slug\n        productAsset {\n          id\n          preview\n        }\n        priceWithTax {\n          ... on SinglePrice {\n            __typename\n            value\n          }\n          ... on PriceRange {\n            __typename\n            min\n            max\n          }\n        }\n        currencyCode\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetFilteredProducts(\n    $term: String\n    $collectionId: ID\n    $collectionSlug: String\n    $groupByProduct: Boolean\n    $take: Int\n    $skip: Int\n    $sort: SearchResultSortParameter\n    $facetValueFilters: [FacetValueFilterInput!]\n    $priceMin: Int!\n    $priceMax: Int!\n  ) {\n    search(\n      input: {\n        term: $term\n        collectionId: $collectionId\n        collectionSlug: $collectionSlug\n        groupByProduct: $groupByProduct\n        take: $take\n        skip: $skip\n        sort: $sort\n        facetValueFilters: $facetValueFilters\n        priceRangeWithTax: { min: $priceMin, max: $priceMax }\n      }\n    ) {\n      collections {\n        collection {\n          name\n          parent {\n            name\n          }\n        }\n      }\n      totalItems\n      facetValues {\n        count\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n      }\n      items {\n        productName\n        slug\n        productAsset {\n          id\n          preview\n        }\n        priceWithTax {\n          ... on SinglePrice {\n            __typename\n            value\n          }\n          ... on PriceRange {\n            __typename\n            min\n            max\n          }\n        }\n        currencyCode\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query ActiveOrder {\n    activeOrder {\n      ...ActiveOrder\n    }\n  }\n",
): (typeof documents)["\n  query ActiveOrder {\n    activeOrder {\n      ...ActiveOrder\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetActiveCustomer {\n    activeCustomer {\n      id\n      firstName\n      lastName\n      emailAddress\n      orders {\n        items {\n          state\n          orderPlacedAt\n          lines {\n            quantity\n            productVariant {\n              name\n            }\n          }\n        }\n      }\n      addresses {\n        id\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country {\n          code\n          name\n        }\n        phoneNumber\n        defaultShippingAddress\n        defaultBillingAddress\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetActiveCustomer {\n    activeCustomer {\n      id\n      firstName\n      lastName\n      emailAddress\n      orders {\n        items {\n          state\n          orderPlacedAt\n          lines {\n            quantity\n            productVariant {\n              name\n            }\n          }\n        }\n      }\n      addresses {\n        id\n        fullName\n        company\n        streetLine1\n        streetLine2\n        city\n        province\n        postalCode\n        country {\n          code\n          name\n        }\n        phoneNumber\n        defaultShippingAddress\n        defaultBillingAddress\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetShippingMethods {\n    eligibleShippingMethods {\n      id\n      price\n      priceWithTax\n      code\n      name\n      description\n    }\n  }\n",
): (typeof documents)["\n  query GetShippingMethods {\n    eligibleShippingMethods {\n      id\n      price\n      priceWithTax\n      code\n      name\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetPaymentMethods {\n    eligiblePaymentMethods {\n      id\n      name\n      code\n      isEligible\n    }\n  }\n",
): (typeof documents)["\n  query GetPaymentMethods {\n    eligiblePaymentMethods {\n      id\n      name\n      code\n      isEligible\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetOrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      id\n      state\n    }\n  }\n",
): (typeof documents)["\n  query GetOrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      id\n      state\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query OrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  query OrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Collections {\n    collections {\n      items {\n        name\n        slug\n        id\n        parent {\n          name\n        }\n        children {\n          name\n          slug\n          id\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query Collections {\n    collections {\n      items {\n        name\n        slug\n        id\n        parent {\n          name\n        }\n        children {\n          name\n          slug\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query CollectionBySlug($slug: String!) {\n    collection(slug: $slug) {\n      name\n      parent {\n        name\n        slug\n      }\n    }\n  }\n",
): (typeof documents)["\n  query CollectionBySlug($slug: String!) {\n    collection(slug: $slug) {\n      name\n      parent {\n        name\n        slug\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
