import { text } from "payload/dist/fields/validations";
import { getAllEndpoint } from "./endpoints/getAllEndpoint";
import { importFromStrapi } from "./endpoints/importFromStrapi";
import { shownOnlyToAdmin } from "src/accesses/collections/shownOnlyToAdmin";
import { mustBeAdmin } from "src/accesses/fields/mustBeAdmin";
import { Collections, CollectionGroups } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";

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
    hidden: shownOnlyToAdmin,
  },
  access: { create: mustBeAdmin, update: mustBeAdmin, delete: mustBeAdmin },
  endpoints: [importFromStrapi, getAllEndpoint],
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
