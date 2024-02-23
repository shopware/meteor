import { adminExtensions } from '../channel';

export type privilegeString = `${keyof privileges}:${string}`;

export type privileges = {
  additional?: Array<string>,
  create?: Array<string>,
  read?: Array<string>,
  update?: Array<string>,
  delete?: Array<string>,
}

export type extension = {
  baseUrl: string,
  permissions: privileges,
}

export function findExtensionByBaseUrl(baseUrl: string): extension | undefined {
  if (typeof baseUrl !== 'string') {
    return undefined;
  }

  if (baseUrl === '') {
    return undefined;
  }

  const comparedBaseUrl = new URL(baseUrl);

  /*
   * Check if baseUrl is the same as the current window location
   * If so, return the dummy extension with all privileges available
   */
  if (comparedBaseUrl.origin === window.location.origin) {
    return {
      baseUrl: comparedBaseUrl.hostname,
      permissions: {
        additional: ['*'],
        create: ['*'],
        read: ['*'],
        update: ['*'],
        delete: ['*'],
      },
    };
  }

  return Object.values(adminExtensions)
    .find((ext) => {
      const extensionBaseUrl = new URL(ext.baseUrl);
      
      return extensionBaseUrl.hostname === comparedBaseUrl.hostname;
    });
}
