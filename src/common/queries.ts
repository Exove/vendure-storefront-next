import { graphql } from "@/gql";

export const activeOrderFragment = graphql(`
  fragment ActiveOrder on Order {
    __typename
    id
    code
    couponCodes
    state
    currencyCode
    totalQuantity
    subTotalWithTax
    shippingWithTax
    totalWithTax
    discounts {
      description
      amountWithTax
    }
    lines {
      id
      unitPriceWithTax
      quantity
      linePriceWithTax
      productVariant {
        id
        name
        product {
          slug
        }
        sku
      }
      featuredAsset {
        id
        preview
      }
    }
    shippingLines {
      shippingMethod {
        description
      }
      priceWithTax
    }
  }
`);

export const productsQuery = graphql(`
  query Products {
    products {
      items {
        name
        slug
        assets {
          source
          width
          height
        }
      }
    }
  }
`);

export const productBySlugQuery = graphql(`
  query ProductBySlug($slug: String!) {
    product(slug: $slug) {
      id
      name
      description
      assets {
        source
        width
        height
      }
      variants {
        name
        price
        id
      }
      collections {
        name
      }
      optionGroups {
        name
      }
      languageCode
      translations {
        name
        description
      }
    }
  }
`);

export const activeOrderQuery = graphql(`
  query ActiveOrder {
    activeOrder {
      ...ActiveOrder
    }
  }
`);

export const addItemToOrderMutation = graphql(`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const loginMutation = graphql(`
  mutation Login(
    $emailAddress: String!
    $password: String!
    $rememberMe: Boolean!
  ) {
    login(
      username: $emailAddress
      password: $password
      rememberMe: $rememberMe
    ) {
      ... on CurrentUser {
        id
        identifier
      }
    }
  }
`);

export const activeCustomerQuery = graphql(`
  query GetActiveCustomer {
    activeCustomer {
      id
      firstName
      lastName
      emailAddress
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          code
          name
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
    }
  }
`);

export const logoutMutation = graphql(`
  mutation LogOut {
    logout {
      success
    }
  }
`);

export const setOrderShippingAddressMutation = graphql(`
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const getShippingMethodsQuery = graphql(`
  query GetShippingMethods {
    eligibleShippingMethods {
      id
      price
      priceWithTax
      code
      name
      description
    }
  }
`);

export const setOrderShippingMethodMutation = graphql(`
  mutation SetShippingMethod($id: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $id) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const getPaymentMethodsQuery = graphql(`
  query GetPaymentMethods {
    eligiblePaymentMethods {
      id
      name
      code
      isEligible
    }
  }
`);

export const transitionToStateMutation = graphql(`
  mutation TransitionToState($state: String!) {
    transitionOrderToState(state: $state) {
      ...ActiveOrder
      ... on OrderStateTransitionError {
        errorCode
        message
        transitionError
        fromState
        toState
      }
    }
  }
`);

export const addPaymentToOrderMutation = graphql(`
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const getOrderByCodeQuery = graphql(`
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      state
    }
  }
`);

export const removeItemFromOrderMutation = graphql(`
  mutation RemoveItemFromOrder($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const adjustOrderLineMutation = graphql(`
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const createCustomerAddressMutation = graphql(`
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      id
      createdAt
      updatedAt
      fullName
      company
      streetLine1
      streetLine2
      city
      province
      postalCode
      country {
        code
        name
      }
      phoneNumber
      defaultShippingAddress
      defaultBillingAddress
      customFields
    }
  }
`);

// For orders that are completed
export const orderFragment = graphql(`
  fragment Order on Order {
    id
    type
    orderPlacedAt
    code
    state
    active
    totalWithTax
    customer {
      firstName
      lastName
    }
    shipping
    shippingLines {
      shippingMethod {
        name
      }
    }
    shippingAddress {
      fullName
      streetLine1
      postalCode
      city
    }
    lines {
      id
      unitPriceWithTax
      quantity
      linePriceWithTax
      productVariant {
        id
        name
        product {
          slug
        }
        sku
      }
      featuredAsset {
        id
        preview
      }
    }
  }
`);

export const orderByCodeQuery = graphql(`
  query OrderByCode($code: String!) {
    orderByCode(code: $code) {
      ...Order
    }
  }
`);

export const orderQuery = graphql(`
  query Order($id: ID!) {
    order(id: $id) {
      ...Order
    }
  }
`);
