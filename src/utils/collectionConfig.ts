import { CollectionConfig } from "payload/types";
import slugify from "slugify";

export type BuildCollectionConfig = Omit<CollectionConfig, "slug" | "typescript" | "labels">;

export type GenerationFunctionProps = {
  labels: { singular: string; plural: string };
  slug: string;
};

export const buildCollectionConfig = (
  labels: { singular: string; plural: string },
  generationFunction: (props: GenerationFunctionProps) => BuildCollectionConfig
): CollectionConfig => {
  const slug = slugify(labels.plural, { lower: true, strict: true, trim: true });
  const config = generationFunction({ labels, slug });
  return {
    ...config,
    slug,
    typescript: { interface: labels.singular },
  };
};
