import { CollectionBeforeChangeHook, CollectionConfig, RelationshipField } from "payload/types";
import {
  BuildCollectionConfig,
  GenerationFunctionProps,
  buildCollectionConfig,
} from "./collectionConfig";
import { Recorders } from "../collections/Recorders/Recorders";

const fields = { updatedBy: "updatedBy" };

const beforeChangeUpdatedBy: CollectionBeforeChangeHook = async ({ data, req }) => ({
  ...data,
  [fields.updatedBy]: req.user.id,
});

const updatedByField = (): RelationshipField => ({
  name: fields.updatedBy,
  type: "relationship",
  required: true,
  relationTo: Recorders.slug,
  admin: { readOnly: true, position: "sidebar" },
});

type BuildVersionedCollectionConfig = Omit<BuildCollectionConfig, "timestamps" | "versions">;

export const buildVersionedCollectionConfig = (
  labels: { singular: string; plural: string },
  generationFunction: (props: GenerationFunctionProps) => BuildVersionedCollectionConfig
): CollectionConfig => {
  const {
    hooks: { beforeChange, ...otherHooks } = {},
    fields,
    ...otherParams
  } = buildCollectionConfig(labels, generationFunction);

  return {
    ...otherParams,
    timestamps: true,
    versions: { drafts: { autosave: { interval: 2000 } } },
    hooks: {
      ...otherHooks,
      beforeChange: [...(beforeChange ?? []), beforeChangeUpdatedBy],
    },
    fields: [...fields, updatedByField()],
  };
};
