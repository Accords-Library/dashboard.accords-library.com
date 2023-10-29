import { CollectionBeforeChangeHook, CollectionConfig, RelationshipField } from "payload/types";
import { Collections } from "../constants";
import { BuildCollectionConfig } from "./collectionConfig";

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

export const buildVersionedCollectionConfig = ({
  hooks: { beforeChange, ...otherHooks } = {},
  fields,
  ...otherParams
}: BuildVersionedCollectionConfig): CollectionConfig => ({
  ...otherParams,
  timestamps: true,
  versions: { drafts: { autosave: { interval: 2000 } } },
  hooks: {
    ...otherHooks,
    beforeChange: [...(beforeChange ?? []), beforeChangeUpdatedBy],
  },
  fields: [...fields, updatedByField()],
});
