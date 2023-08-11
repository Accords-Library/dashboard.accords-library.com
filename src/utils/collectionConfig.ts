import { CollectionConfig } from "payload/types";
import { Collections } from "../constants";

export type BuildCollectionConfig = Omit<CollectionConfig, "slug" | "typescript" | "labels">;

export type GenerationFunctionProps = {
  uploadDir: string;
};

export const buildCollectionConfig = (
  slug: Collections,
  labels: { singular: string; plural: string },
  generationFunction: (props: GenerationFunctionProps) => BuildCollectionConfig
): CollectionConfig => {
  const uploadDir = `../uploads/${slug}`;
  const config = generationFunction({ uploadDir });
  return {
    ...config,
    slug,
    typescript: { interface: labels.singular },
  };
};
