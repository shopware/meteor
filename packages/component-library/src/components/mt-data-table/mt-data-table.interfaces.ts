export interface Filter {
  id: string;
  label: string;
  type: {
    id: string;
    options: Option[];
  };
}

export interface Option {
  id: string;
  label: string;
}
