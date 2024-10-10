import {
  test as ShopwareTestSuite,
  mergeTests,
} from '@shopware-ag/acceptance-test-suite';
import type { FixtureTypes as BaseTypes } from '@shopware-ag/acceptance-test-suite';

export * from '@shopware-ag/acceptance-test-suite';

export type FixtureTypes = BaseTypes;

export const test = mergeTests(ShopwareTestSuite);
