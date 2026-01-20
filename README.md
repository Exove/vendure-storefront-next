# Vendure Storefront Next.js

Next.js e-commerce storefront for Vendure headless commerce platform.

## Folder Structure

```
src/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── account/           # User account page
│   │   ├── checkout/          # Checkout flow
│   │   ├── collections/[slug] # Product collection listings
│   │   ├── order-complete/    # Order confirmation
│   │   ├── products/[slug]    # Product detail pages
│   │   ├── register/          # User registration
│   │   ├── reset-password/    # Password reset
│   │   ├── templates/         # Page template components
│   │   ├── verify-email/      # Email verification
│   │   ├── actions.ts         # Server actions
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   └── api/                   # API routes
├── common/
│   ├── constants.ts           # Application constants
│   ├── fragments.ts           # GraphQL fragments
│   ├── mutations.ts           # GraphQL mutation definitions
│   ├── queries.ts             # GraphQL query definitions
│   └── utils-server.ts        # Server-side utility functions
├── components/                # Reusable UI components
├── gql/                       # Generated GraphQL types (codegen)
├── i18n/                      # Internationalization configuration
├── messages/                  # Translation files
└── plugins/                   # Custom plugin integrations
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                                                    │
│  │   Pages (RSC)       │  Server Components fetch data at request time     │
│  │   /app/[locale]/    │                                                    │
│  │   ├── page.tsx      │──────────┐                                         │
│  │   └── products/     │          │                                         │
│  │       └── page.tsx  │          │                                         │
│  └─────────────────────┘          │                                         │
│            │                      │                                         │
│            │ renders              │ imports & calls                         │
│            ▼                      ▼                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐                           │
│  │  Templates (Client) │  │  utils-server.ts    │                           │
│  │  /templates/        │  │  Server utilities   │                           │
│  │  └── *-template.tsx │  │  - getProductBySlug │                           │
│  └─────────────────────┘  │  - getActiveOrder   │                           │
│            │              │  - getCollections   │                           │
│            │ uses         └─────────────────────┘                           │
│            ▼                      │                                         │
│  ┌─────────────────────┐          │ uses                                    │
│  │  Components         │          ▼                                         │
│  │  /components/       │  ┌─────────────────────┐                           │
│  │  - ProductCard      │  │  GraphQL Client     │                           │
│  │  - CartMenu         │  │  (graphql-request)  │                           │
│  │  - Header           │  └─────────────────────┘                           │
│  └─────────────────────┘          │                                         │
│            │                      │                                         │
│            │ calls                │ executes                                │
│            ▼                      ▼                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐                           │
│  │  Server Actions     │  │  queries.ts         │                           │
│  │  /actions.ts        │  │  mutations.ts       │                           │
│  │  "use server"       │  │  fragments.ts       │                           │
│  │                     │  │  GraphQL operations │                           │
│  │  - placeOrderAction │  └─────────────────────┘                           │
│  │  - adjustOrderLine  │          │                                         │
│  │  - removeItem       │          │                                         │
│  └─────────────────────┘          │                                         │
│                                   │                                         │
└───────────────────────────────────│─────────────────────────────────────────┘
                                    │
                                    │ HTTP / GraphQL
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VENDURE BACKEND                                   │
│                         (GraphQL API Server)                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Query Flow (Read Operations)

```
Page (RSC) → utils-server.ts → GraphQL Client → Vendure API
     ↓
Template (receives data as props)
     ↓
Components (render UI)
```

1. **Page Component** calls server utility function (e.g., `getProductBySlug`)
2. **Server Utility** creates authenticated GraphQL client and executes query
3. **Vendure API** returns data
4. **Page** passes data to template component as props
5. **Template** renders components with the data

### Mutation Flow (Write Operations)

```
Component (user action) → Server Action → GraphQL Client → Vendure API
                               ↓
                    Returns updated state
```

1. **Component** triggers server action (e.g., button click calls `addItemToOrder`)
2. **Server Action** executes GraphQL mutation via authenticated client
3. **Vendure API** processes mutation and returns result
4. **Component** receives updated data and re-renders

## Key Patterns

- **Server Components (RSC)**: Pages fetch data server-side for optimal performance
- **Server Actions**: Client components call server actions for mutations, maintaining security
- **GraphQL Code Generation**: Types are auto-generated from schema via `codegen.ts`
- **Fragment Colocation**: Reusable GraphQL fragments defined in `fragments.ts`
- **Cookie-based Auth**: Bearer token stored in HTTP-only cookies for API authentication
