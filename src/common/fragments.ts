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
    customer {
      emailAddress
      phoneNumber
    }
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
        id
        name
        description
      }
      priceWithTax
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
      emailAddress
      phoneNumber
    }
    shipping
    shippingLines {
      shippingMethod {
        name
        description
        id
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
