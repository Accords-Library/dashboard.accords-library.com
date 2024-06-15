import { CollectionBeforeChangeHook, CollectionConfig, RelationshipField } from "payload/types";
import { Collections } from "../constants";
import { BuildCollectionConfig, buildCollectionConfig } from "./collectionConfig";

const fields = { updatedBy: "updatedBy" };

const beforeChangeUpdatedBy: CollectionBeforeChangeHook = async ({ data, req }) => ({
  ...data,
  [fields.updatedBy]: req.user.id,
});

const updatedByField = (): RelationshipField => ({
  name: fields.updatedBy,
  type: "relationship",
  required: true,
  relationTo: Collections.Recorders,
  admin: { readOnly: true, hidden: true },
});

type BuildVersionedCollectionConfig = Omit<BuildCollectionConfig, "timestamps" | "versions">;

export const buildVersionedCollectionConfig = (
  config: BuildVersionedCollectionConfig
): CollectionConfig =>
  buildCollectionConfig({
    ...config,
    timestamps: true,
    versions: { drafts: { autosave: true } },
    hooks: {
      ...config.hooks,
      beforeChange: [...(config.hooks?.beforeChange ?? []), beforeChangeUpdatedBy],
    },
    fields: [...config.fields, updatedByField()],
  });
