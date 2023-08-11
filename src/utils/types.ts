export type PayloadCreateData<T> = Omit<
  T,
  "id" | "updatedAt" | "createdAt" | "sizes" | "updatedBy"
>;
