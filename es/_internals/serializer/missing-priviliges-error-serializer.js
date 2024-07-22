import { hasType } from '../utils';
import MissingPrivilegesError from '../privileges/missing-privileges-error';
/* eslint-disable */
const MissingPrivilegesErrorSerializer = () => ({
    name: 'handle-error',
    // serialize is empty because the error contains a toJSON function
    serialize: () => { },
    deserialize: ({ value }) => {
        if (hasType('__MissingPrivilegesError__', value)) {
            return new MissingPrivilegesError(value.__messageType__, value.__data__);
        }
    },
});
export default MissingPrivilegesErrorSerializer;
//# sourceMappingURL=missing-priviliges-error-serializer.js.map