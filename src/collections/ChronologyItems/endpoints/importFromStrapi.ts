import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { ChronologyItem } from "../../../types/collections";

export const importFromStrapi = createStrapiImportEndpoint<ChronologyItem>({
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
        translations: event.translations.map(({ title, description, note, language }) => ({
          title,
          description,
          note,
          language: language.data.attributes.code,
          sourceLanguage: "en",
          ...(language.data.attributes.code === "en"
            ? { transcribers: [user.id] }
            : { translators: [user.id] }),
        })),
      })),
    }),
  },
});
