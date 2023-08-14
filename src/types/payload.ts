import { CollectionConfig } from "payload/types";

export type PayloadCreateData<T> = Omit<
  T,
  "id" | "updatedAt" | "createdAt" | "sizes" | "updatedBy"
>;

export type CollectionEndpoint = NonNullable<CollectionConfig["endpoints"]>[number];
