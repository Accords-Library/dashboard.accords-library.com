import { CollectionConfig } from "payload/types";
import { QuickFilters } from "../../components/QuickFilters";
import { CollectionGroups, Collections, LanguageCodes } from "../../constants";
import { rowField } from "../../fields/rowField/rowField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  name: "name",
  translations: "translations",
  translationsName: "name",
} as const satisfies Record<string, string>;

export const GenericContents: CollectionConfig = buildCollectionConfig({
  slug: Collections.GenericContents,
  labels: {
    singular: "Generic Content",
    plural: "Generic Contents",
  },
  defaultSort: fields.name,
  admin: {
    useAsTitle: fields.name,
    defaultColumns: [fields.name, fields.translations],
    group: CollectionGroups.Meta,
    hooks: {
      beforeDuplicate: beforeDuplicateAddCopyTo(fields.name),
    },
    components: {
      BeforeListTable: [
        () =>
          QuickFilters({
            slug: Collections.GenericContents,
            filterGroups: [
              Object.entries(LanguageCodes).map(([key, value]) => ({
                label: `∅ ${value}`,
                filter: { where: { "translations.language": { not_equals: key } } },
              })),
            ],
          }),
      ],
    },
  },
  fields: [
    {
      name: fields.name,
      type: "text",
      required: true,
      unique: true,
    },
    translatedFields({
      name: fields.translations,
      minRows: 1,
      required: true,
      interfaceName: "CategoryTranslations",
      admin: {
        useAsTitle: fields.translationsName,
      },
      fields: [
        rowField([
          {
            name: fields.translationsName,
            type: "textarea",
            required: true,
          },
        ]),
      ],
    }),
  ],
});
