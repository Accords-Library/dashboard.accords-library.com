import { GeneratedTypes } from "payload";
import { CollectionConfig } from "payload/types";
import { afterDeleteWebhook, collectionAfterChangeWebhook } from "../hooks/afterOperationWebhook";
import { formatToPascalCase } from "./string";

type CollectionConfigWithPlugins = CollectionConfig;

export type BuildCollectionConfig = Omit<
  CollectionConfigWithPlugins,
  "slug" | "typescript" | "labels" | "custom"
> & {
  slug: keyof GeneratedTypes["collections"];
  labels: { singular: string; plural: string };
  custom?: {
    getBackPropagatedRelationships?: (object: any) => string[];
    [key: string]: unknown;
  };
};

export const buildCollectionConfig = (config: BuildCollectionConfig): CollectionConfig => ({
  ...config,
  typescript: { interface: formatToPascalCase(config.labels.singular) },
  hooks: {
    ...config.hooks,
    afterChange: [...(config.hooks?.afterChange ?? []), collectionAfterChangeWebhook],
    afterDelete: [...(config.hooks?.afterDelete ?? []), afterDeleteWebhook],
  },
});
