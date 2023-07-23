import { CollectionConfig } from "payload/types";
import slugify from "slugify";

export type BuildCollectionConfig = Omit<CollectionConfig, "slug" | "typescript" | "labels">;

export type GenerationFunctionProps = {
  slug: string;
  uploadDir: string;
};

export const buildCollectionConfig = (
  labels: { singular: string; plural: string },
  generationFunction: (props: GenerationFunctionProps) => BuildCollectionConfig
): CollectionConfig => {
  const slug = slugify(labels.plural, { lower: true, strict: true, trim: true });
  const uploadDir = `../uploads/${slug}`;
  const config = generationFunction({ slug, uploadDir });
  return {
    ...config,
    slug,
    typescript: { interface: labels.singular },
  };
};
