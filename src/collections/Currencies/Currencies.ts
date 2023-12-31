import { text } from "payload/dist/fields/validations";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { CollectionGroups, Collections } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  id: "id",
} as const satisfies Record<string, string>;

export const Currencies = buildCollectionConfig({
  slug: Collections.Currencies,
  labels: {
    singular: "Currency",
    plural: "Currencies",
  },
  defaultSort: fields.id,
  admin: {
    pagination: { defaultLimit: 100 },
    useAsTitle: fields.id,
    defaultColumns: [fields.id],
    disableDuplicate: true,
    group: CollectionGroups.Meta,
  },
  access: { create: mustBeAdmin, update: mustBeAdmin },
  endpoints: [importFromStrapi],
  timestamps: false,
  fields: [
    {
      name: fields.id,
      type: "text",
      unique: true,
      required: true,
      validate: (value, options) => {
        if (!/^[A-Z]{3}$/g.test(value)) {
          return "The code must be a valid ISO 4217 currency code (e.g: EUR, CAD...)";
        }
        return text(value, options);
      },
    },
  ],
});
