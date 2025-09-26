import type { notificationDispatch } from './notification/index';
import type { toastDispatch } from './toast';
import type { windowRedirect, windowReload, windowRouterPush, windowGetId, windowRouterGetPath } from './window/index';
import type {
  contextLanguage,
  contextEnvironment,
  contextLocale,
  contextCurrency,
  contextShopwareVersion,
  contextAppInformation,
  contextModuleInformation,
  contextUserInformation,
  contextUserTimezone,
  contextShopId,
} from './context';
import type { uiComponentSectionRenderer } from './ui/component-section/index';
import type { uiTabsAddTabItem } from './ui/tabs';
import type { uiModulePaymentOverviewCard } from './ui/module/payment/overview-card';
import type { cmsRegisterElement, cmsRegisterBlock } from './ui/cms';
import type { locationUpdateHeight, locationUpdateUrl } from './location/index';
import type { menuCollapse, menuExpand, menuItemAdd } from './ui/menu';
import type { settingsItemAdd } from './ui/settings';
import type { mainModuleAdd } from './ui/main-module';
import type { smartBarButtonAdd, smartBarHide } from './ui/main-module';
import type { uiModalOpen, uiModalClose, uiModalUpdate } from './ui/modal/index';
import type { uiMediaModalOpen, uiMediaModalOpenSaveMedia } from './ui/media-modal';
import type { uiSidebarAdd, uiSidebarClose, uiSidebarRemove } from './ui/sidebar';
import type { actionButtonAdd } from './ui/action-button';
import type { actionExecute } from './app/action';
import type Criteria from './data/Criteria';
import type { datasetRegistration, datasetUpdate, datasetGet, datasetSubscribe, datasetSubscribeRegistration } from './data';
import type EntityCollection from './_internals/data/EntityCollection';
import type { Entity } from './_internals/data/Entity';
import type {
  repositoryGet,
  repositorySearch,
  repositorySave,
  repositoryClone,
  repositoryHasChanges,
  repositorySaveAll,
  repositoryDelete,
  repositoryCreate,
} from './data/repository';
import type { iapCheckout } from './iap';

/**
 * Contains all shopware send types.
 * @internal
 */
export interface ShopwareMessageTypes {
  notificationDispatch: notificationDispatch,
  toastDispatch: toastDispatch,
  windowRedirect: windowRedirect,
  windowRouterPush: windowRouterPush,
  windowReload: windowReload,
  windowRouterGetPath: windowRouterGetPath,
  windowGetId: windowGetId,
  contextLanguage: contextLanguage,
  contextEnvironment: contextEnvironment,
  contextLocale: contextLocale,
  contextCurrency: contextCurrency,
  contextShopwareVersion: contextShopwareVersion,
  contextUserInformation: contextUserInformation,
  contextUserTimezone: contextUserTimezone,
  contextAppInformation: contextAppInformation,
  contextModuleInformation: contextModuleInformation,
  contextShopId: contextShopId,
  getPageTitle: getPageTitle,
  uiComponentSectionRenderer: uiComponentSectionRenderer,
  uiTabsAddTabItem: uiTabsAddTabItem,
  uiModulePaymentOverviewCard: uiModulePaymentOverviewCard,
  cmsRegisterElement: cmsRegisterElement,
  cmsRegisterBlock: cmsRegisterBlock,
  locationUpdateHeight: locationUpdateHeight,
  locationUpdateUrl: locationUpdateUrl,
  menuCollapse: menuCollapse,
  menuExpand: menuExpand,
  menuItemAdd: menuItemAdd,
  settingsItemAdd: settingsItemAdd,
  mainModuleAdd: mainModuleAdd,
  smartBarButtonAdd: smartBarButtonAdd,
  smartBarHide: smartBarHide,
  uiModalOpen: uiModalOpen,
  uiModalClose: uiModalClose,
  uiModalUpdate: uiModalUpdate,
  uiMediaModalOpen: uiMediaModalOpen,
  uiMediaModalOpenSaveMedia: uiMediaModalOpenSaveMedia,
  uiSidebarAdd: uiSidebarAdd,
  uiSidebarClose: uiSidebarClose,
  uiSidebarRemove: uiSidebarRemove,
  actionButtonAdd: actionButtonAdd,
  actionExecute: actionExecute,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  repositoryGet: repositoryGet<any>,
  repositorySearch: repositorySearch<any>,
  repositorySave: repositorySave<any>,
  repositoryClone: repositoryClone<any>,
  repositoryHasChanges: repositoryHasChanges<any>,
  repositorySaveAll: repositorySaveAll<any>,
  repositoryDelete: repositoryDelete<any>,
  repositoryCreate: repositoryCreate<any>,
  /* eslint-enable @typescript-eslint/no-explicit-any */
  datasetRegistration: datasetRegistration,
  datasetSubscribe: datasetSubscribe,
  datasetSubscribeRegistration: datasetSubscribeRegistration,
  datasetUpdate: datasetUpdate,
  datasetGet: datasetGet,
  iapCheckout: iapCheckout,
  __function__: __function__,
  __registerWindow__: __registerWindow__,
  _multiply: _multiply,
  _subtract: _subtract,
  _criteriaTest: _criteriaTest,
  _collectionTest: _collectionTest,
  _entityTest: _entityTest,
  _privileges: _privileges,
}

/**
 * @private
 * JUST FOR DEMO CASES HOW A TYPE WITH RESPONSE VALUE LOOKS LIKE
 * Get the actual page title
 */
export type getPageTitle = {
  responseType: string,
}

/**
 * @private
 * JUST FOR TEST CASES
 */
export type _multiply = {
  responseType: number,
  firstNumber: number,
  secondNumber: number,
}

export type _subtract = {
  responseType: number,
  firstNumber: number,
  secondNumber: number,
}

export type _privileges = {
  responseType: void,
}

export type _criteriaTest = {
  responseType: {
    title: string,
    myCriteria: Criteria,
  },
  title: string,
  myCriteria: Criteria,
}

export type _collectionTest = {
  responseType: {
    title: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: EntityCollection<any>,
  },
  title: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collection: EntityCollection<any>,
}

export type _entityTest = {
  responseType: {
    title: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: Entity<any>,
  },
  title: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: Entity<any>,
}

export type __function__ = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseType: any,
  args: unknown[],
  id: string,
}

export type __registerWindow__ = {
  responseType: void,

  sdkVersion: string,
}
