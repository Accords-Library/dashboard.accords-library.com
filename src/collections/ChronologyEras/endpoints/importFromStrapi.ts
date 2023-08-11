import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { ChronologyEra } from "../../../types/collections";

export const importFromStrapi = createStrapiImportEndpoint<ChronologyEra>({
  strapi: {
    collection: "chronology-eras",
    params: {
      populate: { title: { populate: "language" } },
    },
  },
  payload: {
    collection: Collections.ChronologyEras,
    convert: ({ slug, starting_year, ending_year, title: titles }) => ({
      slug,
      startingYear: starting_year,
      endingYear: ending_year,
      translations: titles.map(({ language, title, description }) => ({
        language: language.data.attributes.code,
        title,
        description,
      })),
    }),
  },
});
