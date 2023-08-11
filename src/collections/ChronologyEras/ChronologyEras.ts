import { CollectionConfig } from "payload/types";
import { mustBeAdmin } from "../../accesses/mustBeAdmin";
import { CollectionGroups, Collections } from "../../constants";
import { slugField } from "../../fields/slugField/slugField";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  slug: "slug",
  startingYear: "startingYear",
  endingYear: "endingYear",
  translations: "translations",
  translationsTitle: "title",
  translationsDescription: "description",
} as const satisfies Record<string, string>;

export const ChronologyEras: CollectionConfig = buildCollectionConfig(
  Collections.ChronologyEras,
  {
    singular: "Chronology Era",
    plural: "Chronology Eras",
  },
  () => ({
    defaultSort: fields.startingYear,
    admin: {
      group: CollectionGroups.Collections,
      defaultColumns: [fields.slug, fields.startingYear, fields.endingYear, fields.translations],
      useAsTitle: fields.slug,
    },
    access: {
      create: mustBeAdmin,
      delete: mustBeAdmin,
    },
    endpoints: [importFromStrapi],
    fields: [
      slugField({ name: fields.slug }),
      {
        type: "row",
        fields: [
          {
            name: fields.startingYear,
            type: "number",
            min: 0,
            required: true,
            admin: { width: "50%", description: "The year the era started (year included)" },
          },
          {
            name: fields.endingYear,
            type: "number",
            min: 0,
            required: true,
            admin: { width: "50%", description: "The year the era ended (year included)" },
          },
        ],
      },
      localizedFields({
        name: fields.translations,
        admin: { useAsTitle: fields.translationsTitle },
        fields: [
          { name: fields.translationsTitle, type: "text", required: true },
          {
            name: fields.translationsDescription,
            type: "textarea",
          },
        ],
      }),
    ],
  })
);
