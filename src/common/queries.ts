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
    $collectionId: ID
    $collectionSlug: String
    $groupByProduct: Boolean
    $take: Int
    $skip: Int
    $sort: SearchResultSortParameter
    $facetValueFilters: [FacetValueFilterInput!]
  ) {
    search(
      input: {
        term: $term
        collectionId: $collectionId
        collectionSlug: $collectionSlug
        groupByProduct: $groupByProduct
        take: $take
        skip: $skip
        sort: $sort
        facetValueFilters: $facetValueFilters
      }
    ) {
      collections {
        collection {
          name
          parent {
            name
          }
        }
      }
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

export const collectionsQuery = graphql(`
  query Collections {
    collections {
      items {
        name
        slug
        id
        parent {
          name
        }
        children {
          name
          slug
          id
        }
      }
    }
  }
`);
