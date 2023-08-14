import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { ChronologyEra } from "../../../types/collections";
import { StrapiLanguage } from "../../../types/strapi";
import { isUndefined } from "../../../utils/asserts";

type StrapiChronologyEra = {
  slug: string;
  starting_year: number;
  ending_year: number;
  title: { title: string; language: StrapiLanguage; description?: string }[];
};

export const importFromStrapi = createStrapiImportEndpoint<ChronologyEra, StrapiChronologyEra>({
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
      translations: titles.map(({ language, title, description }) => {
        if (isUndefined(language.data))
          throw new Error("Language is undefined for one of the translations");
        return {
          language: language.data?.attributes.code,
          title,
          description,
        };
      }),
    }),
  },
});
