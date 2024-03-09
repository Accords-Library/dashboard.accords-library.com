import { text } from "payload/dist/fields/validations";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { publicAccess } from "../../accesses/publicAccess";
import { CollectionGroups, Collections } from "../../constants";
import { afterOperationWebhook } from "../../hooks/afterOperationWebhook";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { getAllEndpoint } from "./endpoints/getAllEndpoint";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  id: "id",
  name: "name",
} as const satisfies Record<string, string>;

export const Languages = buildCollectionConfig({
  slug: Collections.Languages,
  labels: {
    singular: "Language",
    plural: "Languages",
  },
  defaultSort: fields.name,
  admin: {
    useAsTitle: fields.name,
    defaultColumns: [fields.name, fields.id],
    disableDuplicate: true,
    group: CollectionGroups.Meta,
    pagination: { defaultLimit: 100 },
  },
  access: { create: mustBeAdmin, update: mustBeAdmin, read: publicAccess },
  hooks: {
    afterOperation: [afterOperationWebhook],
  },
  timestamps: false,
  endpoints: [importFromStrapi, getAllEndpoint],
  fields: [
    {
      name: fields.id,
      type: "text",
      unique: true,
      required: true,
      validate: (value, options) => {
        if (!/^[a-z]{2}(-[a-z]{2})?$/g.test(value)) {
          return "The code must be a valid BCP 47 language \
          tag and lowercase (i.e: en, pt-pt, fr, zh-tw...)";
        }
        return text(value, options);
      },
    },
    {
      name: fields.name,
      type: "text",
      unique: true,
      required: true,
    },
  ],
});
