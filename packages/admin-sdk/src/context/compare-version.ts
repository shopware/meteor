
import semverCmp from 'semver/functions/cmp';

type Comparator = '=' | '!=' | '<' | '>' | '<=' | '>=';

export default function getCompareShopwareVersion(
  getShopwareVersion: () => Promise<string>
) {
  return async (versionToCompare: string, comparator: Comparator): Promise<boolean> => {
    const shopwareVersion = await getShopwareVersion();
    const shopwareSemverVersion = convertToSemver(shopwareVersion);
    const versionSemverToCompare = convertToSemver(versionToCompare);
    return semverCmp(versionSemverToCompare, comparator, shopwareSemverVersion);
  };
}

function convertToSemver(version: string): string {
  return version.replace(/^\d\./, '');
}
