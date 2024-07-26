import { GeneratedTypes } from "payload";
import { CollectionConfig } from "payload/types";
import { formatToPascalCase } from "./string";
import {
  afterChangeSendChangesWebhook,
  afterDeleteSendChangesWebhook,
} from "../hooks/afterOperationSendChangesWebhook";

type CollectionConfigWithPlugins = CollectionConfig;

export type BuildCollectionConfig = Omit<
  CollectionConfigWithPlugins,
  "slug" | "typescript" | "labels" | "custom"
> & {
  slug: keyof GeneratedTypes["collections"];
  labels: { singular: string; plural: string };
};

export const buildCollectionConfig = (config: BuildCollectionConfig): CollectionConfig => ({
  ...config,
  typescript: { interface: formatToPascalCase(config.labels.singular) },
  hooks: {
    ...config.hooks,
    afterChange: [...(config.hooks?.afterChange ?? []), afterChangeSendChangesWebhook],
    afterDelete: [...(config.hooks?.afterDelete ?? []), afterDeleteSendChangesWebhook],
  },
});
