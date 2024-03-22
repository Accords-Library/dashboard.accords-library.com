import { CollectionConfig } from "payload/types";
import {
  QuickFilters,
  languageBasedFilters,
  publishStatusFilters,
} from "../../components/QuickFilters";
import { CollectionGroups, Collections } from "../../constants";
import { rowField } from "../../fields/rowField/rowField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { collectibleBlock } from "./blocks/collectibleBlock";
import { pageBlock } from "./blocks/contentBlock";
import { urlBlock } from "./blocks/urlBlock";
import { getAllEndpoint } from "./endpoints/getAllEndpoint";
import { getByID } from "./endpoints/getByID";
import { importFromStrapi } from "./endpoints/importFromStrapi";
import { beforeValidatePopulateNameField } from "./hooks/beforeValidatePopulateNameField";
import { validateDate } from "./validations/validateDate";
import { validateEventsTranslationsDescription } from "./validations/validateEventsTranslationsDescription";
import { validateEventsTranslationsTitle } from "./validations/validateEventsTranslationsTitle";

const fields = {
  name: "name",
  events: "events",
  eventsSources: "sources",
  eventsTranslations: "translations",
  eventsTranslationsTitle: "title",
  eventsTranslationsDescription: "description",
  eventsTranslationsNotes: "notes",
  date: "date",
  dateYear: "year",
  dateMonth: "month",
  dateDay: "day",
  status: "_status",
} as const satisfies Record<string, string>;

export const ChronologyEvents: CollectionConfig = buildVersionedCollectionConfig({
  slug: Collections.ChronologyEvents,
  labels: {
    singular: "Chronology Event",
    plural: "Chronology Events",
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
            slug: Collections.ChronologyEvents,
            filterGroups: [
              languageBasedFilters("events.translations.language"),
              publishStatusFilters,
            ],
          }),
      ],
    },
  },
  endpoints: [importFromStrapi, getAllEndpoint, getByID],
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
      admin: {
        description:
          "Make sure there isn't already an entry in the Chronology Events with the same date.\
      If you try to create another entry with the same date, it will refuse to publish.",
      },
      validate: validateDate,
      fields: [
        rowField([
          {
            name: fields.dateYear,
            type: "number",
            required: true,
            min: 0,
          },
          {
            name: fields.dateMonth,
            type: "number",
            min: 1,
            max: 12,
          },
          {
            name: fields.dateDay,
            type: "number",
            min: 1,
            max: 31,
          },
        ]),
      ],
    },
    {
      name: fields.events,
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: fields.eventsSources,
          type: "blocks",
          blocks: [urlBlock, collectibleBlock, pageBlock],
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
              validate: validateEventsTranslationsTitle,
              type: "text",
            },
            {
              name: fields.eventsTranslationsDescription,
              validate: validateEventsTranslationsDescription,
              type: "richText",
              editor: createEditor({ inlines: true, lists: true, links: true }),
            },
            {
              name: fields.eventsTranslationsNotes,
              type: "richText",
              editor: createEditor({ inlines: true, lists: true, links: true }),
            },
          ],
        }),
      ],
    },
  ],
});
