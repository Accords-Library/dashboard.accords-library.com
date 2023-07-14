import { CollectionConfig } from "payload/types";

const fields = {
  id: "id",
  name: "name",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Language",
  plural: "Languages",
} as const satisfies { singular: string; plural: string };

export const Languages: CollectionConfig = {
  slug: labels.plural,
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.name,
  admin: {
    useAsTitle: fields.name,
    defaultColumns: [fields.name, fields.id],
  },
  timestamps: false,
  fields: [
    {
      name: fields.id,
      type: "text",
      unique: true,
      required: true,
      validate: (value) => {
        if (/^[a-z]{2}(-[a-z]{2})?$/g.test(value)) {
          return true;
        }
        return "The code must be a valid IETF language tag and lowercase (i.e: en, pt-pt, fr, zh-tw...)";
      },
    },
    {
      name: fields.name,
      type: "text",
      unique: true,
      required: true,
    },
  ],
};
