declare module "#meteor-component-meta" {
  interface PropMeta {
    name: string;
    description: string;
    type: string;
    required: boolean;
    default?: string;
    deprecated?: string;
  }

  interface EventMeta {
    name: string;
    description: string;
    type: string;
  }

  interface SlotMeta {
    name: string;
    description: string;
  }

  const componentMeta: Record<
    string,
    { props: PropMeta[]; events: EventMeta[]; slots: SlotMeta[] }
  >;

  export default componentMeta;
}

declare module "#meteor-example-sources" {
  const exampleSources: Record<string, string>;
  export default exampleSources;
}
