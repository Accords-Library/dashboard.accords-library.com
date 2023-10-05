import payload from "payload";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { QuickFilters } from "../../components/QuickFilters";
import { CollectionGroups, Collections, KeysTypes, LanguageCodes } from "../../constants";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { Key } from "../../types/collections";
import { isDefined, isUndefined } from "../../utils/asserts";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  name: "name",
  type: "type",
  translations: "translations",
  translationsName: "name",
  translationsShort: "short",
} as const satisfies Record<string, string>;

const keysTypesWithShort: (keyof typeof KeysTypes)[] = ["Categories", "GamePlatforms"];

// TODO: Maybe make sure there is at least one English translation as a fallback

export const Keys = buildCollectionConfig({
  slug: Collections.Keys,
  labels: {
    singular: "Key",
    plural: "Keys",
  },
  defaultSort: fields.name,
  admin: {
    useAsTitle: fields.name,
    defaultColumns: [fields.name, fields.type, fields.translations],
    group: CollectionGroups.Meta,
    components: {
      BeforeListTable: [
        () =>
          QuickFilters({
            slug: Collections.Keys,
            filterGroups: [
              Object.entries(KeysTypes).map(([key, value]) => ({
                label: value,
                filter: { where: { type: { equals: key } } },
              })),
              Object.entries(LanguageCodes).map(([key, value]) => ({
                label: `∅ ${value}`,
                filter: { where: { "translations.language": { not_equals: key } } },
              })),
            ],
          }),
      ],
    },
    hooks: {
      beforeDuplicate: beforeDuplicateAddCopyTo(fields.name),
    },
  },
  access: {
    create: mustBeAdmin,
    delete: mustBeAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (isUndefined(data)) return;
        const { name, type } = data;
        const result = await payload.find({
          collection: Collections.Keys,
          where: { name: { equals: name }, type: { equals: type } },
        });
        if (result.docs.length > 0) {
          throw new Error(`A Key of type "${type}" already exists with the name "${name}"`);
        }
      },
    ],
  },
  endpoints: [importFromStrapi],
  timestamps: false,
  versions: false,
  fields: [
    {
      name: fields.name,
      type: "text",
      required: true,
    },
    {
      name: fields.type,
      type: "select",
      required: true,
      options: Object.entries(KeysTypes).map(([value, label]) => ({ label, value })),
    },
    translatedFields({
      name: fields.translations,
      interfaceName: "CategoryTranslations",
      admin: {
        useAsTitle: fields.translationsName,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: fields.translationsName,
              type: "text",
              required: true,
              admin: { width: "50%" },
            },
            {
              name: fields.translationsShort,
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
});
