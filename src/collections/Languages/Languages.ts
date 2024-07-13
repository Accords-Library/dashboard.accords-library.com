import { text } from "payload/dist/fields/validations";
import { getAllEndpoint } from "./endpoints/getAllEndpoint";
import { shownOnlyToAdmin } from "src/accesses/collections/shownOnlyToAdmin";
import { mustBeAdmin } from "src/accesses/fields/mustBeAdmin";
import { rowField } from "src/fields/rowField/rowField";
import { Collections, CollectionGroups } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";

const fields = {
  id: "id",
  name: "name",
  selectable: "selectable",
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
    defaultColumns: [fields.name, fields.id, fields.selectable],
    disableDuplicate: true,
    group: CollectionGroups.Meta,
    pagination: { defaultLimit: 100 },
    hidden: shownOnlyToAdmin,
  },
  access: { create: mustBeAdmin, update: mustBeAdmin, delete: mustBeAdmin },
  timestamps: false,
  endpoints: [getAllEndpoint],
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
    rowField([
      {
        name: fields.name,
        type: "text",
        unique: true,
        required: true,
      },
      {
        name: fields.selectable,
        type: "checkbox",
        defaultValue: false,
        required: true,
        admin: {
          description:
            "Check this box to make the language available to visitors on the website.\
            Make sure wordings have been translated in that language before making it selectable.",
        },
      },
    ]),
  ],
});
