export interface ComponentPropMeta {
  name: string;
  type?: string;
  default?: string;
  description?: string;
  required?: boolean;
  tags?: { name: string; text?: string }[];
}

export interface FetchedComponentMeta {
  meta?: {
    props?: ComponentPropMeta[];
  };
}
