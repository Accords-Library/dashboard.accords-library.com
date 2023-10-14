import { CollectionConfig } from "payload/types";
import { Collections } from "../constants";

type CollectionConfigWithPlugins = CollectionConfig;

export type BuildCollectionConfig = Omit<
  CollectionConfigWithPlugins,
  "slug" | "typescript" | "labels"
> & {
  slug: Collections;
  labels: { singular: string; plural: string };
};

export const buildCollectionConfig = (config: BuildCollectionConfig): CollectionConfig => ({
  ...config,
  typescript: { interface: config.labels.singular },
});
