import { useRepository } from './useRepository';
import { getRepository } from './getRepository';
import { ref } from 'vue';
import type { SDKRepository } from '../repository-adapter';

// Mock dependencies
jest.mock('./getRepository');
jest.mock('vue', () => {
  const originalVue = jest.requireActual('vue');
  return {
    ...originalVue,
    inject: jest.fn(),
  };
});

// Type definitions for testing
declare global {
  namespace EntitySchema {
    interface Entities {
      product: {
        id: string;
        name: string;
      };
      category: {
        id: string;
        name: string;
      };
    }
  }
}

describe('useRepository', () => {
  const mockProductRepository = { id: 'product-repo' } as unknown as SDKRepository<'product'>;
  const mockCategoryRepository = { id: 'category-repo' } as unknown as SDKRepository<'category'>;
  const mockCustomRepository = { id: 'custom-repo' } as unknown as SDKRepository<'product'>;
  const mockComputedValue = { value: mockProductRepository };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (getRepository as jest.Mock).mockImplementation((entityName, factory) => {
      if (factory) return mockCustomRepository;
      return entityName === 'product' ? mockProductRepository : mockCategoryRepository;
    });
  });

  it('should return a computed ref', () => {
    const repository = useRepository('product');
    
    expect(repository.value).toBe(mockComputedValue.value);
  });

  it('should call getRepository with unwrapped values inside computed', async() => {
    const repository = useRepository('product');

    expect(repository.value).toBeDefined();
    expect(getRepository).toHaveBeenCalledWith('product', undefined);
  });

  it('should handle reactive entity name', () => {
    const entityName = ref<'product' | 'category'>('product');
    const repository = useRepository(entityName);

    expect(repository.value).toBeDefined();
    expect(getRepository).toHaveBeenCalledWith('product', undefined);
  });

  it('should handle reactive repository factory', () => {
    const mockFactory = jest.fn();
    const factoryRef = ref(mockFactory);
    const repository = useRepository('product', factoryRef);

    expect(repository.value).toBeDefined();
    expect(getRepository).toHaveBeenCalledWith('product', mockFactory);
  });

  it('should handle both reactive entity name and factory', () => {
    const entityName = ref<'product' | 'category'>('product');
    const mockFactory = jest.fn();
    const factoryRef = ref(mockFactory);

    const repository = useRepository(entityName, factoryRef);

    expect(repository.value).toBeDefined();
    expect(getRepository).toHaveBeenCalledWith('product', mockFactory);
  });
});
