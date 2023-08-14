import { CollectionConfig } from "payload/types";
import { mustBeAdmin } from "../../accesses/collections/mustBeAdmin";
import { CollectionGroups, Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";
import { beforeValidateEndingGreaterThanStarting } from "./hooks/beforeValidateEndingGreaterThanStarting";
import { beforeValidateNoIntersection } from "./hooks/beforeValidateNoIntersection";

const fields = {
  slug: "slug",
  startingYear: "startingYear",
  endingYear: "endingYear",
  translations: "translations",
  translationsTitle: "title",
  translationsDescription: "description",
  events: "events",
} as const satisfies Record<string, string>;

export const ChronologyEras: CollectionConfig = buildCollectionConfig({
  slug: Collections.ChronologyEras,
  labels: {
    singular: "Chronology Era",
    plural: "Chronology Eras",
  },
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
  hooks: {
    beforeValidate: [beforeValidateEndingGreaterThanStarting, beforeValidateNoIntersection],
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
    translatedFields({
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
    backPropagationField({
      name: fields.events,
      hasMany: true,
      relationTo: Collections.ChronologyItems,
      where: ({ startingYear, endingYear }) => ({
        and: [
          { "date.year": { greater_than_equal: startingYear } },
          { "date.year": { less_than_equal: endingYear } },
        ],
      }),
    }),
  ],
});
