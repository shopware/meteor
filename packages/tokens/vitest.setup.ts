import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './tests/mocks/node.js';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
