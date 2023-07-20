import { CollectionConfig } from "payload/types";
import { CollectionGroup } from "../constants";
import { collectionSlug } from "../utils/string";

const fields = {
  email: "email",
} as const satisfies Record<string, string>;

const labels = {
  singular: "User",
  plural: "Users",
} as const satisfies { singular: string; plural: string };

export const Users: CollectionConfig = {
  slug: collectionSlug(labels.plural),
  auth: true,
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.email,
  admin: {
    useAsTitle: fields.email,
    defaultColumns: [fields.email],
    group: CollectionGroup.Administration,
  },
  timestamps: false,
  fields: [],
};
