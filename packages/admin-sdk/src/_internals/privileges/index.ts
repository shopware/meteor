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
