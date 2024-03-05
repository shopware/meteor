import type { ShopwareMessageTypes } from '../../message-types';
import { findExtensionByBaseUrl } from '../utils';
import type { privilegeString, extension } from '../privileges';
import MissingPrivilegesError from '../privileges/missing-privileges-error';

/**
 * Selects data from a source object using a list of selectors.
 */
export function selectData(
  sourceData: Record<string|number, unknown>,
  selectors?: string[],
  messageType: keyof ShopwareMessageTypes = 'datasetSubscribe',
  origin = '',
): unknown {
  if (!selectors) {
    return sourceData;
  }

  const result = {};
  const extension = findExtensionByBaseUrl(origin ?? '');
  const permissionErrors: Array<privilegeString> = [];

  // Iterate through all selectors, e.g. ['a.b.c', 'd.e.f']
  selectors.forEach((selector) => {
    selectValue(
      sourceData,
      selector,
      extension,
      permissionErrors,
      origin,
      messageType,
      result
    );
  });

  if (!extension) {
    console.warn(`No extension found for origin "${origin}"`);
    return result;
  }

  if (permissionErrors.length) {
    return new MissingPrivilegesError(messageType, permissionErrors);
  }

  return result;
}

/**
 * Adds the structure and value of the selector to the result object.
 * Also checks if the extension has the required permissions for the given data.
 */
function selectValue(
  data: Record<string|number, unknown>,
  selector: string,
  extension: extension|undefined,
  permissionErrors: Array<privilegeString>,
  origin: string,
  messageType: keyof ShopwareMessageTypes,
  result: Record<string|number, unknown> = {}
): Record<string|number, unknown> {
  const parts = selector.split('.');

  let tmpResult = result;
  let tmpData = data;

  // Iterate through all parts of the selector, e.g. ['products', '*', 'name']
  for (let i = 0; i < parts.length; i++) {
    const specificArrayMatcher = /\[\d*\]/;
    const currentPart = parts[i];
    const nextPart = parts[i + 1];

    // Next part is wildcard or specific array selector
    if (nextPart && (nextPart === '*' || nextPart.match(specificArrayMatcher))) {
      // No part after the wildcard? Add the whole array to the result
      if (!parts[i +2]) {
        // Check parent object permissions
        checkPermission(tmpData, extension, permissionErrors);
        // Check requested value permissions
        checkPermission(tmpData?.[currentPart], extension, permissionErrors);

        tmpResult[currentPart] = tmpData?.[currentPart] as Record<string|number, unknown>;
        break;
      }

      // Set next value as existing array or create a new one
      tmpResult[currentPart] = tmpResult[currentPart] ?? [];
      tmpData = tmpData?.[currentPart] as Record<string|number, unknown>;
      tmpResult = tmpResult[currentPart] as Record<string|number, unknown>;
      continue;
    }

    // Setting data into an array with a following selector
    if (Array.isArray(tmpData) && nextPart) {
      const selectorAfterCurrent = parts.slice(i+1).join('.');

      // Current part was a wildcard? Add the value for all array entries
      if (currentPart === '*') {
        for(let j=0; j<tmpData.length; j++) {
          selectValue(
              tmpData[j] as Record<string|number, unknown>,
              selectorAfterCurrent,
              extension,
              permissionErrors,
              origin,
              messageType,
              // Result is either the root array or the existing array entry
              (tmpResult[j] ?? tmpResult) as Record<string|number, unknown>
          );
        }
        break;
      }

      // Current part was a specific array index? Add the value for the specific array entry
      if (currentPart.match(specificArrayMatcher)) {
        const index = parseArrayIndex(currentPart);
        selectValue(
            tmpData[index] as Record<string|number, unknown>,
            selectorAfterCurrent,
            extension,
            permissionErrors,
            origin,
            messageType,
            // Result is either the root array or the existing array entry
            (tmpResult[index] ?? tmpResult) as Record<string|number, unknown>
        );
        break;
      }
    }

    // Is the current part the last of the selector?
    if (i === parts.length - 1) {
      // Check parent object permissions
      checkPermission(tmpData, extension, permissionErrors);
      // Check requested value permissions
      checkPermission(tmpData?.[currentPart], extension, permissionErrors);

      // Add value to array
      if (Array.isArray(tmpResult)) {
        tmpResult.push({ [currentPart]: tmpData?.[currentPart] });
        break;
      }

      // Adds the value to object structures
      tmpResult[currentPart] = tmpData?.[currentPart];
      break;
    }

    // Move to next level
    tmpResult[currentPart] = {};
    tmpData = tmpData?.[currentPart] as Record<string|number, unknown>;
    tmpResult = tmpResult[currentPart] as Record<string|number, unknown>;
  }

  return result;
}

/**
 * Checks if the extension has the required permissions for the given data.
 */
function checkPermission(data: unknown, extension: extension|undefined, permissionErrors: Array<privilegeString>): void {
  if (!data) {
    return;
  }

  const permissionsToCheck = ['read'] as const;
  let entityName = '';

  // @ts-expect-error - we just check if the value is an entity
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (data.__identifier__ && data.__identifier__() === 'Entity') {
    // @ts-expect-error - we know that the value is an entity
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    entityName = data.getEntityName();
  }

  // @ts-expect-error - we just check if the value is an entityCollection
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (data.__identifier__ && data.__identifier__() === 'EntityCollection') {
    // @ts-expect-error - we know that the value is an entityCollection
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    entityName = data.entity;
  }
  
  if (!entityName) {
    return;
  }
  
  permissionsToCheck.forEach((privilege) => {
    const permissionsForPrivilege = extension?.permissions?.[privilege];
        
    if (
      (
        !permissionsForPrivilege ||
            !permissionsForPrivilege.includes(entityName)
      )
        &&
        !permissionErrors.includes(`${privilege}:${entityName}`)
        &&
        !permissionsForPrivilege?.includes('*')
    ) {
      permissionErrors.push(`${privilege}:${entityName}`);
    }
  });
}

/**
 * Parses the array index from a string.
 */
function parseArrayIndex(index: string): number {
  return Number.parseInt(index.replace('[', '').replace(']', ''));
}
