import { mustBeAdmin } from "../../accesses/mustBeAdmin";
import { CollectionGroup } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  id: "id",
  name: "name",
} as const satisfies Record<string, string>;

export const Languages = buildCollectionConfig(
  {
    singular: "Language",
    plural: "Languages",
  },
  () => ({
    defaultSort: fields.name,
    admin: {
      useAsTitle: fields.name,
      defaultColumns: [fields.name, fields.id],
      disableDuplicate: true,
      group: CollectionGroup.Meta,
    },
    access: { create: mustBeAdmin, update: mustBeAdmin },
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
  })
);
