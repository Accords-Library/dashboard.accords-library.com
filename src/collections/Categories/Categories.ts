import { CollectionConfig } from "payload/types";
import { localizedFields } from "../../elements/translatedFields/translatedFields";

const fields = {
  id: "id",
  translations: "translations",
  name: "name",
  short: "short",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Category",
  plural: "Categories",
} as const satisfies { singular: string; plural: string };

export const Categories: CollectionConfig = {
  slug: labels.plural,
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.id,
  admin: {
    useAsTitle: fields.id,
    defaultColumns: [fields.id, fields.translations],
  },
  timestamps: false,
  fields: [
    {
      name: fields.id,
      type: "text",
    },
    localizedFields({
      name: fields.translations,
      interfaceName: "CategoryTranslations",
      admin: {
        useAsTitle: fields.name,
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: fields.name, type: "text", required: true },
            { name: fields.short, type: "text" },
          ],
        },
      ],
    }),
  ],
};
