import { createStrapiImportEndpoint } from "src/endpoints/createStrapiImportEndpoint";
import { Collections } from "src/shared/payload/constants";
import { StrapiLanguage } from "src/types/strapi";
import { isUndefined, isDefined } from "src/utils/asserts";
import { plainTextToLexical } from "src/utils/string";

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

export const importFromStrapi = createStrapiImportEndpoint<StrapiChronologyItem>({
  strapi: {
    collection: "chronology-items",
    params: {
      populate: { events: { populate: { translations: { populate: "language" } } } },
    },
  },
  payload: {
    collection: Collections.ChronologyEvents,
    convert: ({ year, month, day, events }, user) => ({
      date: { year, month, day },
      events: events.map((event) => ({
        translations: event.translations.map(({ title, description, note, language }) => {
          if (isUndefined(language.data))
            throw new Error("A language is required for a chronology item event translation");

          const newLanguage =
            language.data.attributes.code === "pt-br" ? "pt" : language.data.attributes.code;
          const sourceLanguage = language.data.attributes.code === "ja" ? "ja" : "en";

          return {
            ...(isDefined(title) ? { title } : {}),
            ...(isDefined(note) ? { notes: plainTextToLexical(note) } : {}),
            ...(isDefined(description) ? { description: plainTextToLexical(description) } : {}),
            language: newLanguage,
            sourceLanguage,
            ...(newLanguage === sourceLanguage
              ? { transcribers: [user.id] }
              : { translators: [user.id] }),
          };
        }),
      })),
    }),
  },
});
