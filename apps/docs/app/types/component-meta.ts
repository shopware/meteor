export interface ComponentPropMeta {
  name: string;
  type?: string;
  default?: string;
  description?: string;
  required?: boolean;
  tags?: { name: string; text?: string }[];
}

export interface ComponentEventMeta {
  name: string;
  /** Payload type, e.g. "[value: string]". */
  type?: string;
  signature?: string;
  description?: string;
  tags?: { name: string; text?: string }[];
}

export interface ComponentSlotMeta {
  name: string;
  /** Slot bindings type, e.g. "{ size: number }". */
  type?: string;
  description?: string;
  tags?: { name: string; text?: string }[];
}

export interface ComponentExposedMeta {
  name: string;
  type?: string;
  description?: string;
  tags?: { name: string; text?: string }[];
}

export interface FetchedComponentMeta {
  meta?: {
    props?: ComponentPropMeta[];
    events?: ComponentEventMeta[];
    slots?: ComponentSlotMeta[];
    exposed?: ComponentExposedMeta[];
  };
}
