import { reactive, computed, onMounted } from 'vue';
import type { Entity } from '@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity'
import {composables, data} from '@shopware-ag/meteor-admin-sdk';

export type EntityName = 'product' | 'category' | 'product_manufacturer';

type AdvancedSearchState = {
  currentSearchType: EntityName;
  advancedSearchConfig: Entity<'advanced_search_config'>;
  isReady: boolean;
};

const state = reactive<AdvancedSearchState>({
  currentSearchType: 'product',
  advancedSearchConfig: {
    id: null,
    andLogic: true,
    minSearchLength: 2,
    esEnabled: true,
    salesChannelId: null,
    hitCount: {
      product: {
        maxSearchCount: null,
        maxSuggestCount: 10,
      },
      category: {
        maxSearchCount: 30,
        maxSuggestCount: 10,
      },
      product_manufacturer: {
        maxSearchCount: 30,
        maxSuggestCount: 10,
      },
    },
  },
  isReady: false,
});

// Actions
function setCurrentSearchType(currentSearchType: EntityName) {
  state.currentSearchType = currentSearchType;
}

function setAdvancedSearchConfig(config: Entity<'advanced_search_config'>) {
  state.advancedSearchConfig = config;
}

// Getters
const esEnabled = computed(() => state.advancedSearchConfig.esEnabled);

const salesChannelId = computed(() => state.advancedSearchConfig.salesChannelId);

const advancedSearchConfigId = computed(() => state.advancedSearchConfig.id);

const entity = computed(() => state.currentSearchType);

const entities = computed(() => {
  const options = [{
    value: 'product',
    label: 'sw-advanced-search.entity.product',
  }];

  if (!state.advancedSearchConfig.esEnabled) {
    return options;
  }

  return options.concat([
    {
      value: 'category',
      label: 'sw-advanced-search.entity.category',
    },
    {
      value: 'product_manufacturer',
      label: 'sw-advanced-search.entity.product_manufacturer',
    },
  ]);
});

const isReady = computed(() => state.isReady);

export function useAdvancedSearch() {
  onMounted(async () => {
    const { useSharedState } = composables;

    // TODO: this is not optimal because the whole store should be shared
    // Get the shared state for advanced search config ID
    const sharedAdvancedSearchConfigId = useSharedState('advancedSearchConfigId', '');

    // Subscribe to the salesChannelId changes
    data.subscribe('sw-settings-search__salesChannelId', async ({ data: salesChannelId }) => {
      sharedAdvancedSearchConfigId.value = salesChannelId as string;

      // Fetch the advanced search config
      const Criteria = data.Classes.Criteria;
      const advancedSearchConfigRepository = computed(() => {
        return data.repository('advanced_search_config')
      })
      const advancedSearchConfigCriteria = computed(() => {
        const criteria = new Criteria();
        criteria.addFilter(Criteria.equals('salesChannelId', sharedAdvancedSearchConfigId.value));
        return criteria;
      })
      const response = await advancedSearchConfigRepository.value.search(advancedSearchConfigCriteria.value);

      // When the response is not empty, set the advanced search config
      if (response?.length && response?.length > 0) {
        setAdvancedSearchConfig(response?.[0] as unknown as Entity<'advanced_search_config'>);
        state.isReady = true;
      }
    }, {})
  });

  return {
    // State
    state,

    // Actions
    setCurrentSearchType,
    setAdvancedSearchConfig,

    // Getters
    esEnabled,
    salesChannelId,
    advancedSearchConfigId,
    entity,
    entities,
    isReady,
  };
}
