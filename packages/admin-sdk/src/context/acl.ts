import type { contextAppInformation } from './index';
import type { privileges } from '../_internals/privileges';

export default function getCan(
  getContextAppInformation: () => Promise<contextAppInformation>
) {
  return async (privilege: string): Promise<boolean> => {
    const appInformation = await getContextAppInformation();
    const appPrivileges = appInformation.responseType.permissions;

    return can(privilege, flattenPrivileges(appPrivileges));
  };
}

function can(privilege: string, privileges: string[]): boolean {
  return privileges.includes(privilege);
}

function flattenPrivileges(acl: privileges): string[] {
  const flattened: string[] = [];

  Object.keys(acl).forEach((key) => {
    const privileges = acl[key] as string[];

    if (key === 'additional') {
      flattened.push(...privileges);
      return;
    }

    privileges.forEach((privilege) => {
      flattened.push(`${privilege}:${key}`);
    });
  });

  return flattened;
}
