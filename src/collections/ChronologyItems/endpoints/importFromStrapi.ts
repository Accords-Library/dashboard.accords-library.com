import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { ChronologyItem } from "../../../types/collections";
import { StrapiLanguage } from "../../../types/strapi";
import { isUndefined } from "../../../utils/asserts";

type StrapiChronologyItem = {
  year: number;
  month?: number;
  day?: number;
  events: {
    translations: {
      title?: string;
      description?: string;
      note?: string;
      language: StrapiLanguage;
    }[];
  }[];
};

export const importFromStrapi = createStrapiImportEndpoint<ChronologyItem, StrapiChronologyItem>({
  strapi: {
    collection: "chronology-items",
    params: {
      populate: { events: { populate: { translations: { populate: "language" } } } },
    },
  },
  payload: {
    collection: Collections.ChronologyItems,
    convert: ({ year, month, day, events }, user) => ({
      date: { year, month, day },
      events: events.map((event) => ({
        translations: event.translations.map(({ title, description, note, language }) => {
          if (isUndefined(language.data))
            throw new Error("A language is required for a chronology item event translation");
          return {
            title,
            description,
            note,
            language: language.data.attributes.code,
            sourceLanguage: "en",
            ...(language.data.attributes.code === "en"
              ? { transcribers: [user.id] }
              : { translators: [user.id] }),
          };
        }),
      })),
    }),
  },
});
