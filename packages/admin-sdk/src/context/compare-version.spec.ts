import getCompareShopwareVersion from './compare-version';

describe('getCompareShopwareVersion', () => {
  const mock = (version: string) => () => Promise.resolve(version);

  it(`should return true for equal versions with '=' comparator`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.0', '=')
    ).toBe(true);
  });

  it(`should return false for different versions with '=' comparator`, async () => {
    expect(await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.1', '=')).toBe(
      false
    );
  });

  it(`should return false for equal versions with '!=' comparator`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.0', '!=')
    ).toBe(false);
  });

  it(`should return false for different versions with '=' comparator`, async () => {
    expect(await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.1', '!=')).toBe(
      true
    );
  });

  it(`should return true for greater version with '>' comparator`, async () => {
    expect(await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.1', '>')).toBe(
      true
    );
  });

  it(`should return false for lesser version with '>' comparator`, async () => {
    expect(await getCompareShopwareVersion(mock('1.0.0.1'))('1.0.0.0', '>')).toBe(
      false
    );
  });

  it(`should return true for lesser version with '<' comparator`, async () => {
    expect(await getCompareShopwareVersion(mock('1.0.0.1'))('1.0.0.0', '<')).toBe(
      true
    );
  });

  it(`should return false for greater version with '<' comparator`, async () => {
    expect(await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.1', '<')).toBe(
      false
    );
  });

  it(`should return true for equal or greater version with '>=' comparator`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.1', '>=')
    ).toBe(true);
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.0', '>=')
    ).toBe(true);
  });

  it(`should return false for lesser version with '>=' comparator`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.1'))('1.0.0.0', '>=')
    ).toBe(false);
  });

  it(`should return true for equal or lesser version with '<=' comparator`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.1'))('1.0.0.1', '<=')
    ).toBe(true);
    expect(
      await getCompareShopwareVersion(mock('1.0.0.1'))('1.0.0.0', '<=')
    ).toBe(true);
  });

  it(`should return false for greater version with '<=' comparator`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.1', '<=')
    ).toBe(false);
  });

  it(`should handle versions with suffixes correctly`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0-beta'))(
        '1.0.0.0-alpha',
        '<'
      )
    ).toBe(true);
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0-alpha'))(
        '1.0.0.0-beta',
        '>'
      )
    ).toBe(true);
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0-alpha'))(
        '1.0.0.0-alpha',
        '='
      )
    ).toBe(true);
  });

  it(`should consider versions without suffixes as greater`, async () => {
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0'))('1.0.0.0-alpha', '<')
    ).toBe(true);
    expect(
      await getCompareShopwareVersion(mock('1.0.0.0-alpha'))('1.0.0.0', '>')
    ).toBe(true);
  });
});
