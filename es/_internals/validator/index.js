import { findExtensionByBaseUrl, traverseObject } from '../utils';
import MissingPrivilegesError from '../privileges/missing-privileges-error';
export default function validate({ serializedData, origin, type, privilegesToCheck = [], }) {
    if (origin === undefined) {
        return null;
    }
    const extension = findExtensionByBaseUrl(origin);
    if (!extension) {
        console.warn(`No extension found for origin "${origin}"`);
        return null;
    }
    // Check privileges for entity
    const privilegeErrors = [];
    traverseObject(serializedData, (parentEntry, key, value) => {
        if (key === '__type__' && ['__EntityCollection__', '__Entity__'].includes(value)) {
            const entityName = parentEntry.__entityName__;
            if (!entityName) {
                return;
            }
            [...privilegesToCheck].sort().forEach(privilege => {
                const permissionsForPrivilege = extension.permissions[privilege];
                if ((!permissionsForPrivilege ||
                    !permissionsForPrivilege.includes(entityName))
                    &&
                        !privilegeErrors.includes(`${privilege}:${entityName}`)
                    &&
                        !(permissionsForPrivilege === null || permissionsForPrivilege === void 0 ? void 0 : permissionsForPrivilege.includes('*'))) {
                    privilegeErrors.push(`${privilege}:${entityName}`);
                }
            });
        }
    });
    if (privilegeErrors.length > 0) {
        return new MissingPrivilegesError(type, privilegeErrors);
    }
    return null;
}
//# sourceMappingURL=index.js.map