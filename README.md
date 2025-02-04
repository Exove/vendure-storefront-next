# Next.js Storefront Template for Vendure

A modern and high-performance e-commerce storefront built with Next.js 15 for the Vendure e-commerce platform.

## Technologies

- **Frontend Framework:** Next.js 15
- **Localization:** next-intl
- **Styling:** Tailwind CSS
- **State Management:** SWR
- **GraphQL:** graphql-request
- **Search:** Searchkit, React InstantSearch
- **UI Components:** Headless UI, Shadcn
- **Carousel:** Embla Carousel
- **Code Quality:** TypeScript, ESLint, Prettier
- **Git Hooks:** Husky, lint-staged
- **Testing:** Playwright

## Getting Started

1. Ensure you have a Vendure server running with the Elasticsearch plugin installed. See [Elasticsearch Plugin documentation](https://docs.vendure.io/reference/core-plugins/elasticsearch-plugin/) for installation instructions.

2. Create `.env` file and add your Vendure API URL:

```bash
NEXT_PUBLIC_VENDURE_API_URL=http://path-to-your-vendure-server/shop-api
```

3. Install dependencies:

```bash
npm i
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Check code quality
- `npm run gen` - Generate GraphQL types
- `npm run prepare` - Install Husky git hooks

## GraphQL Type Generation

The project uses GraphQL Code Generator to create TypeScript types from GraphQL queries. To generate types:

1. Ensure your Vendure server is running
2. Run `npm run gen`
3. Use the generated types in your components

Types are automatically generated based on the configuration in `codegen.ts`.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Localized routes
│   └── api/               # API routes
├── common/                # Shared utilities and constants
├── components/            # Reusable components
└── messages/              # Translation files
```

## Development

- Project uses TypeScript for type-safe development
- ESLint and Prettier ensure consistent code style
- Husky and lint-staged check code quality before commits
- GraphQL Code Generator creates types for GraphQL queries

## E2E Testing

The project uses Playwright for end-to-end testing. Tests are located in the `tests` directory.

To run the tests:

```bash
# Install Playwright browsers
npx playwright install

# Run tests
npx playwright test

# Run tests with UI
npx playwright test --ui
```

## Deployment

1. Create a production build:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```
