import type { Criteria, Entities, EntityName } from "../../shared/types";
import * as server from "../../server/repository";
import { transfer, useRequest } from "./useRequest";

/**
 * Reads and writes the entities of one type in the mock Admin API, like the Administration's
 * repositories.
 */
export function useRepository<Name extends EntityName>(name: Name) {
  const { request } = useRequest();

  return {
    search: (criteria: Criteria) =>
      request(() => server.search(name, criteria)),
    get: (id: string) => request(() => server.get(name, id)),
    save: (entity: Entities[Name]) =>
      request(() => server.save(name, transfer(entity))),
    remove: (ids: string[]) => request(() => server.remove(name, ids)),
  };
}
