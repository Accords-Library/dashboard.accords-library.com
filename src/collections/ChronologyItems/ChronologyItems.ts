import { DateTime } from "luxon";
import { CollectionConfig } from "payload/types";
import {
  QuickFilters,
  languageBasedFilters,
  publishStatusFilters,
} from "../../components/QuickFilters";
import { CollectionGroups, Collections } from "../../constants";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { isDefined, isUndefined } from "../../utils/asserts";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  name: "name",
  events: "events",
  eventsTranslations: "translations",
  eventsTranslationsTitle: "title",
  eventsTranslationsDescription: "description",
  eventsTranslationsNotes: "notes",
  date: "date",
  year: "year",
  month: "month",
  day: "day",
  status: "_status",
} as const satisfies Record<string, string>;

export const ChronologyItems: CollectionConfig = buildVersionedCollectionConfig(
  Collections.ChronologyItems,
  {
    singular: "Chronology Item",
    plural: "Chronology Items",
  },
  () => ({
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
          beforeValidate: [
            ({
              data: {
                date: { year, month, day },
              },
            }) =>
              [
                String(year ?? "?????").padStart(5, "0"),
                String(month ?? "??").padStart(2, "0"),
                String(day ?? "??").padStart(2, "0"),
              ].join("-"),
          ],
        },
      },
      {
        type: "group",
        name: fields.date,
        validate: ({ year, month, day } = {}) => {
          if (isDefined(day)) {
            if (isUndefined(month)) return "A month is required if a day is set";
            const stringDate = `${year}/${month}/${day}`;
            if (!DateTime.fromObject({ year, month, day }).isValid)
              return `The given date (${stringDate}) is not a valid date.`;
          }
          return true;
        },
        fields: [
          {
            type: "row",
            fields: [
              {
                name: fields.year,
                type: "number",
                required: true,
                min: 0,
                admin: { width: "33%" },
              },
              { name: fields.month, type: "number", min: 1, max: 12, admin: { width: "33%" } },
              { name: fields.day, type: "number", min: 1, max: 31, admin: { width: "33%" } },
            ],
          },
        ],
      },
      {
        name: fields.events,
        type: "array",
        fields: [
          localizedFields({
            name: fields.eventsTranslations,
            admin: { useAsTitle: fields.eventsTranslationsTitle },
            fields: [
              { name: fields.eventsTranslationsTitle, type: "text" },
              { name: fields.eventsTranslationsDescription, type: "textarea" },
              { name: fields.eventsTranslationsNotes, type: "textarea" },
            ],
          }),
        ],
      },
    ],
  })
);
