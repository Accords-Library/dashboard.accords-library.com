import { CollectionConfig } from "payload/types";
import { slugField } from "../../fields/slugField/slugField";
import { CollectionGroup, KeysTypes } from "../../constants";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { collectionSlug } from "../../utils/string";
import { Key } from "../../types/collections";
import { isDefined } from "../../utils/asserts";

const fields = {
  slug: "slug",
  translations: "translations",
  type: "type",
  name: "name",
  short: "short",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Key",
  plural: "Keys",
} as const satisfies { singular: string; plural: string };

const keysTypesWithShort: (keyof typeof KeysTypes)[] = ["Categories", "GamePlatforms"];

export const Keys: CollectionConfig = {
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
      options: Object.entries(KeysTypes).map(([value, label]) => ({ label, value })),
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
            { name: fields.name, type: "text", required: true, admin: { width: "50%" } },
            {
              name: fields.short,
              type: "text",
              admin: {
                condition: (data: Partial<Key>) =>
                  isDefined(data.type) && keysTypesWithShort.includes(data.type),
                width: "50%",
              },
            },
          ],
        },
      ],
    }),
  ],
};
