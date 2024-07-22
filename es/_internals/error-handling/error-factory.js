import HandleError from './HandleError';
import { hasOwnProperty } from '../utils';
import MissingPrivilegesError from '../privileges/missing-privileges-error';
export default function createError(type, e) {
    if (typeof e === 'string') {
        return new HandleError(e);
    }
    if (!(e instanceof Error)) {
        return new HandleError('An unknown error occurred.');
    }
    /* eslint-disable */
    if (hasOwnProperty(e, 'response.data.errors.0.code') && e.response.data.errors.length) {
        const missingPrivilegeErrors = e.response.data.errors
            .filter((error) => error.code === 'FRAMEWORK__MISSING_PRIVILEGE_ERROR');
        const missingPrivileges = [];
        missingPrivilegeErrors.forEach((mpe) => {
            const data = JSON.parse(mpe.detail);
            missingPrivileges.push(...data.missingPrivileges);
        });
        if (missingPrivileges.length) {
            return new MissingPrivilegesError(type, missingPrivileges);
        }
        return new HandleError(e.response.data.errors[0].code, e.response.data.errors[0].status);
    }
    return new HandleError(e.message);
}
//# sourceMappingURL=error-factory.js.map