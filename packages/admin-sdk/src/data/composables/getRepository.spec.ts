import { getRepository } from './getRepository';
import * as repositoryModule from '../repository';
import { inject } from 'vue';
import { createRepositoryAdapter, type RepositorySource } from '../repository-adapter';
import type Criteria from '../Criteria';
import type { ApiContext } from '../../_internals/data/EntityCollection';
import type { Entity } from '../../_internals/data/Entity';

// Mock dependencies
jest.mock('vue');
jest.mock('../repository-adapter');
jest.mock('../repository', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Type definitions for testing
type TestEntityName = 'product';
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

describe('getRepository', () => {
  // Common mocks and setup
  const mockRepositorySource: RepositorySource<TestEntityName> = {
    search: jest.fn(),
    get: jest.fn(),
    save: jest.fn(),
    clone: jest.fn(),
    saveAll: jest.fn(),
    delete: jest.fn(),
    hasChanges: jest.fn(),
    create: jest.fn(),
  };
  
  const mockRepositoryAdapter = {
    search: jest.fn(),
    get: jest.fn(),
    save: jest.fn(),
    clone: jest.fn(),
    saveAll: jest.fn(),
    delete: jest.fn(),
    hasChanges: jest.fn(),
    create: jest.fn(),
  };

  const mockDefaultRepository = {
    search: jest.fn(),
    get: jest.fn(),
    save: jest.fn(),
    clone: jest.fn(),
    saveAll: jest.fn(),
    delete: jest.fn(),
    hasChanges: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createRepositoryAdapter as jest.Mock).mockReturnValue(mockRepositoryAdapter);
    (repositoryModule.default as jest.Mock).mockReturnValue(mockDefaultRepository);
  });

  describe('with propRepositoryFactory', () => {
    it('should use the provided repository factory', () => {
      const propRepositoryFactory = jest.fn().mockReturnValue(mockRepositorySource);
      
      const repository = getRepository('product', propRepositoryFactory);
      
      expect(propRepositoryFactory).toHaveBeenCalledWith('product');
      expect(createRepositoryAdapter).toHaveBeenCalledWith(mockRepositorySource);
      expect(repository).toBe(mockRepositoryAdapter);
    });
  });

  describe('with injected repositoryFactory', () => {
    it('should use the injected repository factory when available', () => {
      const injectedFactory = {
        create: jest.fn().mockReturnValue(mockRepositorySource)
      };
      (inject as jest.Mock).mockReturnValue(injectedFactory);
      
      const repository = getRepository('product');
      
      expect(inject).toHaveBeenCalledWith('repositoryFactory');
      expect(injectedFactory.create).toHaveBeenCalledWith('product');
      expect(createRepositoryAdapter).toHaveBeenCalledWith(mockRepositorySource);
      expect(repository).toBe(mockRepositoryAdapter);
    });
  });

  describe('with lazy loading fallback', () => {
    beforeEach(() => {
      (inject as jest.Mock).mockReturnValue(undefined);
    });

    it('should create a proxy for lazy loading repository', async () => {
      const repository = getRepository('product');
      
      // Repository should be a proxy at this point
      expect(repository).toBeInstanceOf(Object);
      
      // Verify lazy loading works on method call
      await repository.search({ limit: 10 } as Criteria);
      
      expect(repositoryModule.default).toHaveBeenCalledWith('product');
      expect(mockDefaultRepository.search).toHaveBeenCalledWith({ limit: 10 });
    });

    it('should only load the repository once across multiple method calls', async () => {
      const repository = getRepository('product');
      
      expect(repositoryModule.default).not.toHaveBeenCalled();
      await repository.search({ limit: 10 } as Criteria);
      await repository.get('123');

      // Repository module should only be imported once
      expect(repositoryModule.default).toHaveBeenCalledTimes(1);
      expect(mockDefaultRepository.search).toHaveBeenCalledWith({ limit: 10 });
      expect(mockDefaultRepository.get).toHaveBeenCalledWith('123');
    });

    it('should pass all arguments to the underlying repository methods', async () => {
      const repository = getRepository('product');
      
      await repository.search({ limit: 10 } as Criteria, { languageId: 'en-US' } as ApiContext);
      await repository.get('123', { languageId: 'en-US' } as ApiContext, { limit: 1 } as Criteria);
      await repository.save({ id: '123', name: 'Test' } as Entity<'product'>, { languageId: 'en-US' } as ApiContext);
      
      expect(mockDefaultRepository.search).toHaveBeenCalledWith(
        { limit: 10 }, 
        { languageId: 'en-US' }
      );
      expect(mockDefaultRepository.get).toHaveBeenCalledWith(
        '123', 
        { languageId: 'en-US' }, 
        { limit: 1 }
      );
      expect(mockDefaultRepository.save).toHaveBeenCalledWith(
        { id: '123', name: 'Test' }, 
        { languageId: 'en-US' }
      );
    });

    it('should support all repository methods', async () => {
      const repository = getRepository('product');
      const entity = { id: '123', name: 'Test' } as Entity<'product'>;
      
      await repository.search({} as Criteria);
      await repository.get('123');
      await repository.save(entity);
      await repository.clone('123', {});
      await repository.hasChanges(entity);
      await repository.saveAll([] as any);
      await repository.delete('123');
      await repository.create();
      
      expect(mockDefaultRepository.search).toHaveBeenCalled();
      expect(mockDefaultRepository.get).toHaveBeenCalled();
      expect(mockDefaultRepository.save).toHaveBeenCalled();
      expect(mockDefaultRepository.clone).toHaveBeenCalled();
      expect(mockDefaultRepository.hasChanges).toHaveBeenCalled();
      expect(mockDefaultRepository.saveAll).toHaveBeenCalled();
      expect(mockDefaultRepository.delete).toHaveBeenCalled();
      expect(mockDefaultRepository.create).toHaveBeenCalled();
    });
  });
});
