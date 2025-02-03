import '@testing-library/jest-dom'; // Provides custom Jest matchers for DOM nodes
import 'whatwg-fetch'; // Polyfill for fetch API in Node.js environments
import { setupServer } from 'msw/node';
import { handlers } from './handlers'; // Import your mock handlers

// Create an MSW server with the handlers
const server = setupServer(...handlers);

beforeAll(() => {
  console.log('Starting MSW Server');
  server.listen({ onUnhandledRequest: 'warn' }); // Logs unhandled requests as warnings
});

afterEach(() => {
  console.log('Resetting MSW Handlers');
  server.resetHandlers(); // Resets handlers after each test
});

afterAll(() => {
  console.log('Closing MSW Server');
  server.close(); // Stops the server when all tests are done
});

// Export the server for use in tests (optional)
export { server };