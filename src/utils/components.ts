export type AdminComponent<T extends Record<string, any>> = (props: {
  data: Partial<T>;
  index?: number;
}) => string;
