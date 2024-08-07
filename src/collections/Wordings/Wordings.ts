import { CollectionConfig } from "payload/types";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { QuickFilters, languageBasedFilters } from "../../components/QuickFilters";
import { rowField } from "../../fields/rowField/rowField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { getAllEndpoint } from "./endpoints/getAllEndpoint";
import { Collections, CollectionGroups } from "../../shared/payload/constants";

const fields = {
  name: "name",
  translations: "translations",
  translationsName: "name",
} as const satisfies Record<string, string>;

export const Wordings: CollectionConfig = buildCollectionConfig({
  slug: Collections.Wordings,
  labels: {
    singular: "Wording",
    plural: "Wordings",
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
            slug: Collections.Wordings,
            filterGroups: [languageBasedFilters("translations.language")],
          }),
      ],
    },
  },
  access: {
    create: mustBeAdmin,
    delete: mustBeAdmin,
  },
  endpoints: [getAllEndpoint],
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
