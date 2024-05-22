import { GeneratedTypes } from "payload";
import { CollectionConfig } from "payload/types";
import { formatToPascalCase } from "./string";

type CollectionConfigWithPlugins = CollectionConfig;

export type BuildCollectionConfig = Omit<
  CollectionConfigWithPlugins,
  "slug" | "typescript" | "labels"
> & {
  slug: keyof GeneratedTypes["collections"];
  labels: { singular: string; plural: string };
};

export const buildCollectionConfig = (config: BuildCollectionConfig): CollectionConfig => ({
  ...config,
  typescript: { interface: formatToPascalCase(config.labels.singular) },
});
