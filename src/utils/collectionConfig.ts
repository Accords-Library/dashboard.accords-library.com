import { CollectionConfig } from "payload/types";
import { Collections } from "../constants";
import { CollectionConfigWithGridView } from "../plugins/payload-grid-view";

type CollectionConfigWithPlugins = CollectionConfig & CollectionConfigWithGridView;

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
