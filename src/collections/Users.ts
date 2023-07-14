import { CollectionConfig } from "payload/types";

const fields = {
  email: "email",
} as const satisfies Record<string, string>;

const labels = {
  singular: "User",
  plural: "Users",
} as const satisfies { singular: string; plural: string };

export const Users: CollectionConfig = {
  slug: labels.plural,
  auth: true,
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.email,
  admin: {
    useAsTitle: fields.email,
    defaultColumns: [fields.email],
    group: "Administration",
  },
  timestamps: false,
  fields: [],
};
