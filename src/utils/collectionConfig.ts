import { CollectionConfig } from "payload/types";
import { Collections } from "../constants";
import { formatToPascalCase } from "./string";

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
  typescript: { interface: formatToPascalCase(config.labels.singular) },
});
