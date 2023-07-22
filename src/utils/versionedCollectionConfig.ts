import { CollectionBeforeChangeHook, CollectionConfig, RelationshipField } from "payload/types";
import { Users } from "../collections/Users";
import {
  BuildCollectionConfig,
  GenerationFunctionProps,
  buildCollectionConfig,
} from "./collectionConfig";

const fields = { lastModifiedBy: "lastModifiedBy" };

const beforeChangeLastModifiedBy: CollectionBeforeChangeHook = async ({
  data: { updatedBy, ...data },
  req,
}) => {
  console.log(data, req.user);
  return {
    ...data,
    [fields.lastModifiedBy]: req.user.id,
  };
};

const lastModifiedByField = (): RelationshipField => ({
  name: fields.lastModifiedBy,
  type: "relationship",
  required: true,
  relationTo: Users.slug,
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
