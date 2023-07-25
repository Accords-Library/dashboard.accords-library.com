import { mustBeAdmin } from "../../accesses/mustBeAdmin";
import { CollectionGroup } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  id: "id",
} as const satisfies Record<string, string>;

export const Currencies = buildCollectionConfig(
  {
    singular: "Currency",
    plural: "Currencies",
  },
  () => ({
    defaultSort: fields.id,
    admin: {
      useAsTitle: fields.id,
      defaultColumns: [fields.id],
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
          if (/^[A-Z]{3}$/g.test(value)) {
            return true;
          }
          return "The code must be a valid ISO 4217 currency code (e.g: EUR, CAD...)";
        },
      },
    ],
  })
);
