import { graphql } from "@/gql";

export const productsQuery = graphql(`
  query Products {
    products {
      items {
        id
        name
        slug
        collections {
          name
        }
        variantList {
          items {
            priceWithTax
          }
        }
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

export const filteredProductsQuery = graphql(`
  query GetFilteredProducts(
    $term: String
    $skip: Int
    $take: Int
    $facetValueFilters: [FacetValueFilterInput!]!
    $groupByProduct: Boolean!
    $priceMin: Int!
    $priceMax: Int!
    $sort: SearchResultSortParameter
  ) {
    search(
      input: {
        term: $term
        skip: $skip
        take: $take
        facetValueFilters: $facetValueFilters
        groupByProduct: $groupByProduct
        priceRange: { min: $priceMin, max: $priceMax }
        sort: $sort
      }
    ) {
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
      items {
        productName
        slug
        productAsset {
          id
          preview
        }
        priceWithTax {
          ... on SinglePrice {
            __typename
            value
          }
          ... on PriceRange {
            __typename
            min
            max
          }
        }
        currencyCode
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

export const activeCustomerQuery = graphql(`
  query GetActiveCustomer {
    activeCustomer {
      id
      firstName
      lastName
      emailAddress
      orders {
        items {
          state
          orderPlacedAt
          lines {
            quantity
            productVariant {
              name
            }
          }
        }
      }
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

export const getOrderByCodeQuery = graphql(`
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      state
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
