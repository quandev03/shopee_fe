import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import productRestHandler from './src/msw/product.msw';
import categoriesRestHandler from './src/msw/categories.msw';
import purchasesRestHandler from './src/msw/purchases.msw';
import authRestHandlers from "./src/msw/auth.msw"
import profileRestHandler from "./src/msw/profile.msw";

const server = setupServer(
  ...authRestHandlers,
  ...productRestHandler,
  ...categoriesRestHandler,
  ...purchasesRestHandler,
  ...profileRestHandler
);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
