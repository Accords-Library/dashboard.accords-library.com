import { CollectionConfig } from "payload/types";
import { mustBeAdmin } from "src/accesses/fields/mustBeAdmin";
import { iconField } from "src/fields/iconField/iconField";
import { rowField } from "src/fields/rowField/rowField";
import { slugField } from "src/fields/slugField/slugField";
import { translatedFields } from "src/fields/translatedFields/translatedFields";
import { Collections, CollectionGroups, AttributeTypes } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";

const fields = {
  slug: "slug",
  translations: "translations",
  translationsName: "name",
  icon: "icon",
  type: "type",
};

export const Attributes: CollectionConfig = buildCollectionConfig({
  slug: Collections.Attributes,
  labels: { singular: "Attribute", plural: "Attributes" },
  admin: {
    group: CollectionGroups.Meta,
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.icon, fields.type, fields.translations],
  },
  fields: [
    rowField([
      slugField({ name: fields.slug }),
      iconField({ name: fields.icon }),
      {
        name: fields.type,
        type: "select",
        access: {
          update: mustBeAdmin,
        },
        required: true,
        options: Object.values(AttributeTypes).map((value) => ({
          label: value,
          value: value,
        })),
      },
    ]),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsName },
      required: true,
      minRows: 1,
      fields: [{ name: fields.translationsName, type: "text", required: true }],
    }),
  ],
});
