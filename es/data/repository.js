import { send } from '../channel';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (entityName) => ({
    search: (criteria, context) => {
        return send('repositorySearch', { entityName, context, criteria });
    },
    get: (id, context, criteria) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return send('repositoryGet', { entityName, id, context, criteria });
    },
    save: (entity, context) => {
        return send('repositorySave', { entityName, entity, context });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clone: (entityId, context, behavior) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return send('repositoryClone', { entityName, entityId, context, behavior });
    },
    hasChanges: (entity) => {
        return send('repositoryHasChanges', { entityName, entity });
    },
    saveAll: (entities, context) => {
        return send('repositorySaveAll', { entityName, entities, context });
    },
    delete: (entityId, context) => {
        return send('repositoryDelete', { entityName, entityId, context });
    },
    create: (context, entityId) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return send('repositoryCreate', { entityName, entityId, context });
    },
});
//# sourceMappingURL=repository.js.map