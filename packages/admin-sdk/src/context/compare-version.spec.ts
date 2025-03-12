import getCompareIsShopwareVersion from './compare-version';

type Comparator = '=' | '!=' | '<' | '>' | '<=' | '>=';

describe('getCompareShopwareVersion', () => {
  const mock = (version: string) => () => Promise.resolve(version);

  describe('It works with shopware versions and semver versions', () => {
    it.each<[boolean, string, Comparator, string]>([
      [true, '6.6.8.2', '=', '6.6.8.2'],
      [true, '6.6.8.2', '=', '6.8.2'],
      [true, '6.8.2', '=', '6.6.8.2'],
      [true, '6.8.2', '=', '6.8.2'],
  
      [false, '6.6.8.2', '=', '6.6.9.2'],
      [false, '6.6.8.2', '=', '6.9.2'],
      [false, '6.8.2', '=', '6.6.9.2'],
      [false, '6.8.2', '=', '6.9.2'],
    ])("returns %s for '%s %s %s'", async (exptectedResult, shopwareVersion, comparator, comparedVersion) => {
      const compareIsShopwareVersion = getCompareIsShopwareVersion(mock(shopwareVersion));

      expect(await compareIsShopwareVersion(comparator, comparedVersion)).toBe(exptectedResult)
    });
  });

  describe('It works like semver package', () => {
    it.each<[boolean, string, Comparator, string]>([
      [true, '6.6.8.2', '=', '6.6.8.2'],
      [false, '6.6.8.2', '=', '6.6.9.2'],
    
      [true, '6.6.8.2', '!=', '6.7.8.2'],
      [false, '6.6.8.2', '!=', '6.6.8.2'],
  
      [true, '6.6.8.2', '>', '6.6.7.2'],
      [false, '6.6.8.2', '>', '6.6.8.2'],
      [false, '6.6.8.2', '>', '6.6.9.2'],
  
      [true, '6.6.8.2', '<', '6.6.9.2'],
      [false, '6.6.8.2', '<', '6.6.8.2'],
      [false, '6.6.8.2', '<', '6.6.7.2'],
  
      [true, '6.6.8.2', '>=', '6.6.8.2'],
      [true, '6.6.8.2', '>=', '6.6.7.2'],
      [false, '6.6.8.2', '>=', '6.6.9.2'],
  
      [true, '6.6.8.2', '<=', '6.6.8.2'],
      [true, '6.6.8.2', '<=', '6.6.9.2'],
      [false, '6.6.8.2', '<=', '6.6.6.2'],

      [true, '6.7.0.0-rc-1', '<', '6.7.0.0'],
      [true, '6.7.0.0', '>', '6.7.0.0-rc-1'],

      [true, '6.7.0.0-rc-1', '<', '6.7.0.0-rc-2'],
      [true, '6.7.0.0-rc-2', '>', '6.7.0.0-rc-1'],
      [true, '6.7.0.0-rc-2', '<', '6.7.0.0-rc-3'],
      [true, '6.7.0.0-rc-3', '>', '6.7.0.0-rc-2'],

      [true, '6.7.0.0-alpha', '=', '6.7.0.0-alpha'],
      [true, '6.7.0.0-alpha', '<', '6.7.0.0-beta'],
      [true, '6.7.0.0-beta', '>', '6.7.0.0-alpha'],
    ])("returns %s for '%s %s %s'", async (exptectedResult, shopwareVersion, comparator, comparedVersion) => {
      const compareIsShopwareVersion = getCompareIsShopwareVersion(mock(shopwareVersion));

      expect(await compareIsShopwareVersion(comparator, comparedVersion)).toBe(exptectedResult)
    });
  });
});
