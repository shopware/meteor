import { send } from '../channel';
import repository from './repository';
import Criteria from './Criteria';
import type { Entity } from '../_internals/data/Entity';
import type EntityCollection from '../_internals/data/EntityCollection';
import type { ApiContext } from '../_internals/data/EntityCollection';

jest.mock('../channel', () => ({
  send: jest.fn(() => Promise.resolve(null)),
}));

const sendMock = send as jest.MockedFunction<typeof send>;

describe('repository', () => {
  const productRepository = repository('product');
  const criteria = new Criteria();
  const context = { languageId: 'en-GB' } as ApiContext;
  const entity = { id: '123' } as unknown as Entity<'product'>;
  const entities = [entity] as unknown as EntityCollection<'product'>;
  const options = { timeout: 30000 };

  beforeEach(() => {
    sendMock.mockClear();
  });

  it.each([
    ['search', () => productRepository.search(criteria, context, options), 'repositorySearch', { entityName: 'product', context, criteria }],
    ['get', () => productRepository.get('123', context, criteria, options), 'repositoryGet', { entityName: 'product', id: '123', context, criteria }],
    ['save', () => productRepository.save(entity, context, options), 'repositorySave', { entityName: 'product', entity, context }],
    ['saveAll', () => productRepository.saveAll(entities, context, options), 'repositorySaveAll', { entityName: 'product', entities, context }],
    ['delete', () => productRepository.delete('123', context, options), 'repositoryDelete', { entityName: 'product', entityId: '123', context }],
  ])('%s passes the options to send, not into the message', async (_name, call, type, data) => {
    await call();

    expect(sendMock).toHaveBeenCalledWith(type, data, undefined, undefined, options);
  });

  it.each([
    ['context first', () => productRepository.clone('123', context, { deep: true }, options)],
    ['behavior first', () => productRepository.clone('123', { deep: true }, context, options)],
  ])('clone passes the options to send with the %s', async (_name, call) => {
    await call();

    expect(sendMock).toHaveBeenCalledWith(
      'repositoryClone',
      { entityName: 'product', entityId: '123', context, behavior: { deep: true } },
      undefined,
      undefined,
      options,
    );
  });

  it('sends without options when none are given', async () => {
    await productRepository.search(criteria, context);

    expect(sendMock).toHaveBeenCalledWith('repositorySearch', { entityName: 'product', context, criteria }, undefined, undefined, undefined);
  });
});
