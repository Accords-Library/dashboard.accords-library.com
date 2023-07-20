import { CollectionConfig } from "payload/types";
import { slugField } from "../../fields/slugField/slugField";
import { CollectionGroup, TagsTypes } from "../../constants";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { collectionSlug } from "../../utils/string";

const fields = {
  slug: "slug",
  translations: "translations",
  type: "type",
  name: "name",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Tag",
  plural: "Tags",
} as const satisfies { singular: string; plural: string };

export const Tags: CollectionConfig = {
  slug: collectionSlug(labels.plural),
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.type, fields.translations],
    group: CollectionGroup.Meta,
  },
  timestamps: false,
  versions: false,
  fields: [
    slugField({ name: fields.slug }),
    {
      name: fields.type,
      type: "select",
      required: true,
      options: Object.entries(TagsTypes).map(([value, label]) => ({ label, value })),
    },
    localizedFields({
      name: fields.translations,
      interfaceName: "CategoryTranslations",
      admin: {
        useAsTitle: fields.name,
      },
      fields: [{ name: fields.name, type: "text", required: true }],
    }),
  ],
};
