import { graphql } from "@/gql";

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

export const updateCustomerAddressMutation = graphql(`
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
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
    }
  }
`);

export const updateCustomerMutation = graphql(`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
    }
  }
`);

export const setCustomerForOrderMutation = graphql(`
  mutation SetCustomerForOrder($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const registerMutation = graphql(`
  mutation Register($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const verifyMutation = graphql(`
  mutation Verify($password: String!, $token: String!) {
    verifyCustomerAccount(password: $password, token: $token) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const deleteCustomerAddressMutation = graphql(`
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
    }
  }
`);

export const setOrderBillingAddressMutation = graphql(`
  mutation SetOrderBillingAddress($input: CreateAddressInput!) {
    setOrderBillingAddress(input: $input) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const requestPasswordResetMutation = graphql(`
  mutation RequestPasswordReset($emailAddress: String!) {
    requestPasswordReset(emailAddress: $emailAddress) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);
