import {
  RepositoryAdapter,
  createRepositoryAdapter,
} from './repository-adapter';
import type { RepositorySource } from './repository-adapter';
import type EntityCollection from '../_internals/data/EntityCollection';
import type { ApiContext } from '../_internals/data/EntityCollection';
import Criteria from './Criteria';
import type { Entity } from '../_internals/data/Entity';

// Mock types to make testing easier
type TestEntityName = 'product';
interface TestEntity extends Entity<TestEntityName> {
  id: string;
  name: string;
}

declare global {
  namespace EntitySchema {
    interface Entities {
      product: {
        id: string;
        name: string;
      };
    }
  }
}

describe('RepositoryAdapter', () => {
  // Mock repository source
  const mockEntity = { id: '123', name: 'Test Product' } as TestEntity;
  const mockEntityCollection = {
    length: 1,
  } as EntityCollection<TestEntityName>;
  const mockContext = { languageId: 'en-US' } as ApiContext;
  const mockAsyncSource: RepositorySource<TestEntityName> = {
    search: jest.fn().mockResolvedValue(mockEntityCollection),
    get: jest.fn().mockResolvedValue(mockEntity),
    save: jest.fn().mockResolvedValue(undefined),
    clone: jest.fn().mockResolvedValue({ id: '456', name: 'Cloned Product' }),
    saveAll: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    hasChanges: jest.fn().mockResolvedValue(true),
    create: jest.fn().mockResolvedValue(mockEntity),
  };
  const mockSyncSource: RepositorySource<TestEntityName> = {
    search: jest.fn().mockResolvedValue(mockEntityCollection),
    get: jest.fn().mockResolvedValue(mockEntity),
    save: jest.fn().mockResolvedValue(undefined),
    clone: jest.fn().mockResolvedValue({ id: '456', name: 'Cloned Product' }),
    saveAll: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    hasChanges: jest.fn().mockReturnValue(true),
    create: jest.fn().mockReturnValue(mockEntity),
  };
  const asyncRepositoryAdapter: RepositoryAdapter<TestEntityName> =
    new RepositoryAdapter(mockAsyncSource);
  const syncRepositoryAdapter: RepositoryAdapter<TestEntityName> =
    new RepositoryAdapter(mockSyncSource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('async repository', () => {
    it('should call source.search with provided parameters', async () => {
      const criteria = { limit: 10 } as Criteria;

      const result = await asyncRepositoryAdapter.search(criteria, mockContext);

      expect(mockAsyncSource.search).toHaveBeenCalledWith(
        criteria,
        mockContext
      );
      expect(result).toBe(mockEntityCollection);
    });

    it('should call source.get with provided parameters', async () => {
      const id = '123';
      const criteria = { limit: 1 } as Criteria;

      const result = await asyncRepositoryAdapter.get(
        id,
        mockContext,
        criteria
      );

      expect(mockAsyncSource.get).toHaveBeenCalledWith(
        id,
        mockContext,
        criteria
      );
      expect(result).toBe(mockEntity);
    });

    it('should call source.save with provided parameters', async () => {
      await asyncRepositoryAdapter.save(mockEntity, mockContext);

      expect(mockAsyncSource.save).toHaveBeenCalledWith(
        mockEntity,
        mockContext
      );
    });

    it('should call source.clone with provided parameters', async () => {
      const entityId = '123';
      const behavior = { deep: true };

      const result = await asyncRepositoryAdapter.clone(
        entityId,
        behavior,
        mockContext
      );

      expect(mockAsyncSource.clone).toHaveBeenCalledWith(
        entityId,
        behavior,
        mockContext
      );
      expect(result).toEqual({ id: '456', name: 'Cloned Product' });
    });

    it('should handle Promise return from source.hasChanges', async () => {
      mockAsyncSource.hasChanges = jest.fn().mockResolvedValue(true);

      const result = await asyncRepositoryAdapter.hasChanges(mockEntity);

      expect(mockAsyncSource.hasChanges).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(true);
    });

    it('should handle boolean return from source.hasChanges', async () => {
      mockAsyncSource.hasChanges = jest.fn().mockReturnValue(false);

      const result = await asyncRepositoryAdapter.hasChanges(mockEntity);

      expect(mockAsyncSource.hasChanges).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(false);
    });

    it('should call source.saveAll with provided parameters', async () => {
      await asyncRepositoryAdapter.saveAll(mockEntityCollection, mockContext);

      expect(mockAsyncSource.saveAll).toHaveBeenCalledWith(
        mockEntityCollection,
        mockContext
      );
    });

    it('should call source.delete with provided parameters', async () => {
      const entityId = '123';

      await asyncRepositoryAdapter.delete(entityId, mockContext);

      expect(mockAsyncSource.delete).toHaveBeenCalledWith(
        entityId,
        mockContext
      );
    });

    it('should handle Promise return from source.create', async () => {
      mockAsyncSource.create = jest.fn().mockResolvedValue(mockEntity);
      const entityId = '123';

      const result = await asyncRepositoryAdapter.create(mockContext, entityId);

      expect(mockAsyncSource.create).toHaveBeenCalledWith(
        mockContext,
        entityId
      );
      expect(result).toBe(mockEntity);
    });

    it('should handle direct return from source.create', async () => {
      mockAsyncSource.create = jest.fn().mockReturnValue(mockEntity);
      const entityId = '123';

      const result = await asyncRepositoryAdapter.create(mockContext, entityId);

      expect(mockAsyncSource.create).toHaveBeenCalledWith(
        mockContext,
        entityId
      );
      expect(result).toBe(mockEntity);
    });
  });

  describe('sync repository', () => {
    it('should call source.search with provided parameters', async () => {
      const criteria = { limit: 10 } as Criteria;

      const result = await syncRepositoryAdapter.search(criteria, mockContext);

      expect(mockSyncSource.search).toHaveBeenCalledWith(
        criteria,
        mockContext
      );
      expect(result).toBe(mockEntityCollection);
    });

    it('should call source.get with provided parameters', async () => {
      const id = '123';
      const criteria = { limit: 1 } as Criteria;

      const result = await syncRepositoryAdapter.get(id, mockContext, criteria);

      expect(mockSyncSource.get).toHaveBeenCalledWith(
        id,
        mockContext,
        criteria
      );
      expect(result).toBe(mockEntity);
    });

    it('should call source.save with provided parameters', async () => {
      await syncRepositoryAdapter.save(mockEntity, mockContext);

      expect(mockSyncSource.save).toHaveBeenCalledWith(
        mockEntity,
        mockContext
      );
    });

    it('should call source.clone with provided parameters', async () => {
      const entityId = '123';
      const behavior = { deep: true };

      const result = await syncRepositoryAdapter.clone(
        entityId,
        behavior,
        mockContext
      );

      expect(mockSyncSource.clone).toHaveBeenCalledWith(
        entityId,
        behavior,
        mockContext
      );
      expect(result).toEqual({ id: '456', name: 'Cloned Product' });
    });

    it('should handle Promise return from source.hasChanges', async () => {
      mockSyncSource.hasChanges = jest.fn().mockResolvedValue(true);

      const result = await syncRepositoryAdapter.hasChanges(mockEntity);

      expect(mockSyncSource.hasChanges).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(true);
    });

    it('should handle boolean return from source.hasChanges', async () => {
      mockSyncSource.hasChanges = jest.fn().mockReturnValue(false);

      const result = await syncRepositoryAdapter.hasChanges(mockEntity);

      expect(mockSyncSource.hasChanges).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(false);
    });

    it('should call source.saveAll with provided parameters', async () => {
      await syncRepositoryAdapter.saveAll(mockEntityCollection, mockContext);

      expect(mockSyncSource.saveAll).toHaveBeenCalledWith(
        mockEntityCollection,
        mockContext
      );
    });

    it('should call source.delete with provided parameters', async () => {
      const entityId = '123';

      await syncRepositoryAdapter.delete(entityId, mockContext);

      expect(mockSyncSource.delete).toHaveBeenCalledWith(
        entityId,
        mockContext
      );
    });

    it('should handle Promise return from source.create', async () => {
      mockSyncSource.create = jest.fn().mockResolvedValue(mockEntity);
      const entityId = '123';

      const result = await syncRepositoryAdapter.create(mockContext, entityId);

      expect(mockSyncSource.create).toHaveBeenCalledWith(
        mockContext,
        entityId
      );
      expect(result).toBe(mockEntity);
    });

    it('should handle direct return from source.create', async () => {
      mockSyncSource.create = jest.fn().mockReturnValue(mockEntity);
      const entityId = '123';

      const result = await syncRepositoryAdapter.create(mockContext, entityId);

      expect(mockSyncSource.create).toHaveBeenCalledWith(
        mockContext,
        entityId
      );
      expect(result).toBe(mockEntity);
    });
  });

  it('should create a repository adapter instance', () => {
    const mockSource = {} as RepositorySource<'product'>;
    const adapter = createRepositoryAdapter(mockSource);

    expect(adapter).toBeInstanceOf(RepositoryAdapter);
  });
});
