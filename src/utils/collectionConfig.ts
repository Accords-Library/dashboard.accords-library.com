import { GeneratedTypes } from "payload";
import { CollectionConfig } from "payload/types";
import { formatToPascalCase } from "./string";
import {
  afterChangeSendChangesWebhook,
  afterDeleteSendChangesWebhook,
  beforeDeletePrepareChanges,
} from "../hooks/afterOperationSendChangesWebhook";

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
  hooks: {
    ...config.hooks,
    afterChange: [...(config.hooks?.afterChange ?? []), afterChangeSendChangesWebhook],
    beforeDelete: [...(config.hooks?.beforeDelete ?? []), beforeDeletePrepareChanges],
    afterDelete: [...(config.hooks?.afterDelete ?? []), afterDeleteSendChangesWebhook],
  },
});
