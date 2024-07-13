import { CollectionConfig } from "payload/types";
import { QuickFilters, languageBasedFilters } from "src/components/QuickFilters";
import { rowField } from "src/fields/rowField/rowField";
import { translatedFields } from "src/fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "src/hooks/beforeDuplicateAddCopyTo";
import { Collections, CollectionGroups } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";

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
            filterGroups: [languageBasedFilters("translations.language")],
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
