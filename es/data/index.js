import { createHandler, createSender, processDataRegistration, send, subscribe as createSubscriber } from '../channel';
import MissingPrivilegesError from '../_internals/privileges/missing-privileges-error';
import Criteria from './Criteria';
import Entity from '../_internals/data/Entity';
import EntityCollection from '../_internals/data/EntityCollection';
import repository from './repository';
// Internal function to create a filterable subscriber
function createFilteredSubscriber(type) {
    return (id, callback, options) => {
        if (type === 'datasetSubscribe') {
            // Send message to admin that this window wants to subscribe to a dataset
            void send('datasetSubscribeRegistration', {
                id,
                selectors: options === null || options === void 0 ? void 0 : options.selectors,
            });
        }
        const wrapper = (data) => {
            var _a;
            if ((data === null || data === void 0 ? void 0 : data.id) !== id) {
                return;
            }
            if (data.selectors && data.selectors.length > 0) {
                // Compare if the selectors match independent of the order
                if (((_a = options === null || options === void 0 ? void 0 : options.selectors) === null || _a === void 0 ? void 0 : _a.sort().join(',')) !== data.selectors.sort().join(',')) {
                    return;
                }
            }
            // Check if data.data is an error and log it
            if ((data === null || data === void 0 ? void 0 : data.data) instanceof MissingPrivilegesError) {
                console.error(data.data);
            }
            const returnValue = callback(data);
            if (returnValue) {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                returnValue.catch(() => { });
            }
        };
        return createSubscriber(type, wrapper);
    };
}
/**
 * Methods used by extension developers to get and update data
 */
export const subscribe = createFilteredSubscriber('datasetSubscribe');
export const get = createSender('datasetGet');
export const update = createSender('datasetUpdate');
/**
 * Internal methods used by the administration
 */
export const register = processDataRegistration;
export const updateSubscriber = createFilteredSubscriber('datasetUpdate');
export const handleGet = createHandler('datasetGet');
const Classes = {
    Criteria,
    Entity: Entity,
    EntityCollection,
};
export { repository, Classes, };
//# sourceMappingURL=index.js.map