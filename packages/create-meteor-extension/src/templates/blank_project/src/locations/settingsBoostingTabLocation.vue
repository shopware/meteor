<template>
  <main>
    <mt-data-table
      :dataSource="boostings"
      :columns="boostingsColumns"
      :current-page="currentPage"
      :pagination-limit="paginationLimit"
      :pagination-total-items="paginationTotalItems"
      :is-loading="isLoading"
      @item-delete="onBoostingDelete"
      @open-details="openDetails"
    >
      <template #toolbar>
        <mt-button
          variant="secondary"
          @click="openDetails({ id: '', name: '' })"
        >
          {{ t('sw-advanced-search.boostingTab.addBoosting')}}
        </mt-button>
      </template>
    </mt-data-table>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { MtDataTable, MtButton } from '@shopware-ag/meteor-component-library'
import { data, ui, composables, notification } from '@shopware-ag/meteor-admin-sdk'
import type EntityCollection from '@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection'
import { useAdvancedSearch } from '../store/sw-advanced-search.store'
import type { MtColorBadgeVariant } from '@shopware-ag/meteor-component-library/dist/esm/components/feedback-indicator/mt-color-badge/mt-color-badge'
import type { BadgeColumnDefinition } from '@shopware-ag/meteor-component-library/dist/esm/components/table-and-list/mt-data-table/renderer/mt-data-table-badge-renderer'
import type { TextColumnDefinition } from '@shopware-ag/meteor-component-library/dist/esm/components/table-and-list/mt-data-table/renderer/mt-data-table-text-renderer'
import type { NumberColumnDefinition } from '@shopware-ag/meteor-component-library/dist/esm/components/table-and-list/mt-data-table/renderer/mt-data-table-number-renderer'
import type { PriceColumnDefinition } from '@shopware-ag/meteor-component-library/dist/esm/components/table-and-list/mt-data-table/renderer/mt-data-table-price-renderer'

import { useI18n } from 'vue-i18n'
import {settingsBoostingEditModalLocation} from "@/locations.ts";

const { t } = useI18n()
const { useSharedState } = composables;

// TODO: this is not needed when using `ColumnDefinition` from the meteor-component-library
interface BaseColumnDefinition {
  label: string // the label for the column
  property: string // the value for each entry
  position: number // the initial position of the column. Should be defined in 100 steps
  sortable?: boolean // enable or disable sortability for this column (default=true)
  width?: number // define the width value for this column
  allowResize?: boolean // you can disable the possibility for the user to resize this column
  cellWrap?: 'nowrap' | 'normal'
  visible?: boolean // you can hide a column by default
}

// TODO: this should be `ColumnDefinition` from the meteor-component-library but the exports aren't working
type ColumnDefinition =
  | BadgeColumnDefinition
  | TextColumnDefinition
  | NumberColumnDefinition
  | PriceColumnDefinition

const Criteria = data.Classes.Criteria
const { advancedSearchConfigId, isReady } = useAdvancedSearch()

// data-table prop values
// TODO: add real values
const boostings = ref<EntityCollection<'advanced_search_boosting'>>([])
const currentPage = ref(1)
const paginationLimit = ref(25)
const paginationTotalItems = ref(67)
const isLoading = ref(true)
const searchTerm = ref('')
const boostingsColumns = computed<ColumnDefinition[]>(() => {
  return [
    {
      label: t('sw-advanced-search.boostingTab.column.name'),
      property: 'name',
      position: 100,
      renderer: 'text',
    },
    {
      label: t('sw-advanced-search.boostingTab.column.active'),
      property: 'active',
      position: 200,
      renderer: 'badge',
      rendererOptions: {
        renderItemBadge(data, columnDefinition) {
          const isActive = data[columnDefinition.property]
          const variant: MtColorBadgeVariant = isActive ? 'success' : 'danger'
          return {
            variant,
            label: isActive
              ? t('sw-advanced-search.boostingTab.columnContent.active.active')
              : t('sw-advanced-search.boostingTab.columnContent.active.inactive'),
          }
        },
      },
    },
    // TODO: Add validFrom and validTo
  ]
})

// Handle Table events
const onBoostingDelete = async ({ id: boostingId }: { id: string }) => {
  if (!boostingId) {
    return
  }

  isLoading.value = true;

  try {
    boostings.value.remove(boostingId)
    await boostingRepository.value.delete(boostingId)
  } catch (error) {
    console.error('Error deleting boosting:', error)
  } finally {
    await fetchBoostings()
  }

  isLoading.value = false
}

// Modal logic (should be in the modal component but does not work with the buttons)
const boosting = useSharedState('boostingEntity', null)

const openDetails = async ({ id, name }: {
  id: string,
  name: string
}) => {
  // Get the current boostingId shared state
  const boostingId = useSharedState('boostingId', '');
  // Wait 1 second because we need to have the value beforehand
  window.setTimeout(() => {
    // Set the boostingId shared state after the initial value is loaded
    boostingId.value = id;
  }, 200);

  // Trigger modal opening
  ui.modal.open({
    locationId: settingsBoostingEditModalLocation,
    title: name,
    closable: true,
    buttons: [
      {
        // TODO: Add label translation
        label: 'global.default.cancel',
        variant: 'secondary',
        size: 'small',
        method: () => {
          ui.modal.close({
            locationId: settingsBoostingEditModalLocation,
          })
        },
      },
      {
        label: 'global.default.save',
        variant: 'primary',
        size: 'small',
        async method() {
          // TODO: implement save logic (which ideally is inside the modal)
          try {
            await boostingRepository.value.save(boosting.value)

            notification.dispatch({
              variant: 'success',
              title: 'Saved successfully',
              message: 'The boosting was saved successfully',
            })
          } catch (e) {
            notification.dispatch({
              variant: 'error',
              title: 'Error on save',
              message: 'The boosting could not be saved',
            })
          } finally {
            ui.modal.close({
              locationId: settingsBoostingEditModalLocation,
            })

            // Reload the table
            await fetchBoostings()
          }
        }
      },
    ]
  })
}


// Fetch data
const boostingRepository = computed(() => {
  return data.repository('advanced_search_boosting')
})

const boostingCriteria = computed(() => {
  const criteria = new Criteria(currentPage.value, paginationLimit.value)
  criteria.addFilter(Criteria.equals('configId', advancedSearchConfigId.value))

  if (searchTerm.value) {
    criteria.setTerm(searchTerm.value)
  }

  return criteria
})

const fetchBoostings = async () => {
  isLoading.value = true

  try {
    const response = await boostingRepository.value.search(boostingCriteria.value)
    boostings.value = response
    paginationTotalItems.value = response.total
  } catch (error) {
    console.error('Error fetching boostings:', error)
  } finally {
    isLoading.value = false
  }
}
watch(
  isReady,
  async (newValue) => {
    if (!newValue) {
      return
    }

    fetchBoostings()
  },
  {
    immediate: true,
  },
)
</script>
