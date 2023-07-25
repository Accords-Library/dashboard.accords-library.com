import { CollectionBeforeChangeHook, CollectionConfig, RelationshipField } from "payload/types";
import {
  BuildCollectionConfig,
  GenerationFunctionProps,
  buildCollectionConfig,
} from "./collectionConfig";
import { Recorders } from "../collections/Recorders/Recorders";

const fields = { lastModifiedBy: "lastModifiedBy" };

const beforeChangeLastModifiedBy: CollectionBeforeChangeHook = async ({
  data: { updatedBy, ...data },
  req,
}) => ({
  ...data,
  [fields.lastModifiedBy]: req.user.id,
});

const lastModifiedByField = (): RelationshipField => ({
  name: fields.lastModifiedBy,
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
      beforeChange: [...(beforeChange ?? []), beforeChangeLastModifiedBy],
    },
    fields: [...fields, lastModifiedByField()],
  };
};
