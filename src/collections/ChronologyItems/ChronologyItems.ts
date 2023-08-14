import { DateTime } from "luxon";
import { CollectionConfig } from "payload/types";
import {
  QuickFilters,
  languageBasedFilters,
  publishStatusFilters,
} from "../../components/QuickFilters";
import { CollectionGroups, Collections } from "../../constants";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { isEmpty, isUndefined } from "../../utils/asserts";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";
import { beforeValidatePopulateNameField } from "./hooks/beforeValidatePopulateNameField";

const fields = {
  name: "name",
  events: "events",
  eventsSource: "source",
  eventsTranslations: "translations",
  eventsTranslationsTitle: "title",
  eventsTranslationsDescription: "description",
  eventsTranslationsNotes: "notes",
  date: "date",
  dateYear: "year",
  dateMonth: "month",
  dateDay: "day",
  era: "era",
  status: "_status",
} as const satisfies Record<string, string>;

export const ChronologyItems: CollectionConfig = buildVersionedCollectionConfig({
  slug: Collections.ChronologyItems,
  labels: {
    singular: "Chronology Item",
    plural: "Chronology Items",
  },
  defaultSort: fields.name,
  admin: {
    group: CollectionGroups.Collections,
    defaultColumns: [fields.name, fields.events, fields.status],
    useAsTitle: fields.name,
    components: {
      BeforeListTable: [
        () =>
          QuickFilters({
            slug: Collections.ChronologyItems,
            filterGroups: [
              languageBasedFilters("events.translations.language"),
              publishStatusFilters,
            ],
          }),
      ],
    },
  },
  endpoints: [importFromStrapi],
  fields: [
    {
      name: fields.name,
      type: "text",
      admin: { hidden: true },
      hooks: {
        beforeValidate: [beforeValidatePopulateNameField],
      },
    },
    {
      type: "group",
      name: fields.date,
      validate: ({ year, month, day } = {}) => {
        if (isUndefined(day)) return true;
        if (isUndefined(month)) return "A month is required if a day is set";
        const stringDate = `${year}/${month}/${day}`;
        if (!DateTime.fromObject({ year, month, day }).isValid) {
          return `The given date (${stringDate}) is not a valid date.`;
        }
        return true;
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: fields.dateYear,
              type: "number",
              required: true,
              min: 0,
              admin: { width: "33%" },
            },
            { name: fields.dateMonth, type: "number", min: 1, max: 12, admin: { width: "33%" } },
            { name: fields.dateDay, type: "number", min: 1, max: 31, admin: { width: "33%" } },
          ],
        },
      ],
    },
    {
      name: fields.events,
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: fields.eventsSource,
          type: "relationship",
          relationTo: [Collections.Contents, Collections.LibraryItems],
          // required: true,
          admin: { allowCreate: false },
        },
        translatedFields({
          name: fields.eventsTranslations,
          required: true,
          minRows: 1,
          admin: {
            useAsTitle: fields.eventsTranslationsTitle,
            hasSourceLanguage: true,
            hasCredits: true,
          },
          fields: [
            {
              name: fields.eventsTranslationsTitle,
              validate: (_, { siblingData: { description, title } }) => {
                if (isEmpty(description) && isEmpty(title)) {
                  return "This field is required if no description is set.";
                }
                return true;
              },
              type: "text",
            },
            {
              name: fields.eventsTranslationsDescription,
              validate: (_, { siblingData: { description, title } }) => {
                if (isEmpty(description) && isEmpty(title)) {
                  return "This field is required if no title is set.";
                }
                return true;
              },
              type: "textarea",
            },
            { name: fields.eventsTranslationsNotes, type: "textarea" },
          ],
        }),
      ],
    },
  ],
});
