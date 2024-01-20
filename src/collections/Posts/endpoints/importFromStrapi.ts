import { DateTime } from "luxon";
import type { MarkOptional } from "ts-essentials";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import type { Post } from "../../../types/collections";
import { StrapiImage, StrapiLanguage, StrapiRecorders } from "../../../types/strapi";
import { isDefined, isUndefined } from "../../../utils/asserts";
import { findCategory, findRecorder, uploadStrapiImage } from "../../../utils/localApi";
import { plainTextToLexical } from "../../../utils/string";

type StrapiPost = {
  slug: string;
  categories: { data: { attributes: { slug: string } }[] };
  authors: StrapiRecorders;
  hidden: boolean;
  thumbnail: StrapiImage;
  translations: {
    title: string;
    excerpt?: string;
    body: string;
    translators: StrapiRecorders;
    proofreaders: StrapiRecorders;
    language: StrapiLanguage;
    source_language: StrapiLanguage;
  }[];
  date: {
    day: number;
    month: number;
    year: number;
  };
};

export const importFromStrapi = createStrapiImportEndpoint<StrapiPost>({
  strapi: {
    collection: "posts",
    params: {
      populate: [
        "date",
        "authors",
        "thumbnail",
        "categories",
        "translations",
        "translations.language",
        "translations.translators",
        "translations.proofreaders",
        "translations.source_language",
      ],
    },
  },
  payload: {
    collection: Collections.Posts,
    convert: async ({
      slug,
      date: { day, month, year },
      hidden,
      authors,
      thumbnail,
      categories,
      translations,
    }) => {
      const thumbnailId = await uploadStrapiImage({
        collection: Collections.PostsThumbnails,
        image: thumbnail,
      });

      const handleTranslation = async ({
        language,
        title,
        body,
        excerpt,
        proofreaders,
        source_language,
        translators,
      }: StrapiPost["translations"][number]): Promise<Post["translations"][number]> => {
        if (isUndefined(language.data))
          throw new Error("A language is required for a post translation");
        if (isUndefined(source_language.data))
          throw new Error("A source_language is required for a post translation");
        return {
          language: language.data.attributes.code,
          sourceLanguage: source_language.data.attributes.code,
          title,
          content: plainTextToLexical(body),
          summary: isDefined(excerpt) ? plainTextToLexical(excerpt) : undefined,
          translators:
            translators.data &&
            (await Promise.all(
              translators.data?.map(async (recorder) => findRecorder(recorder.attributes.username))
            )),
          proofreaders:
            proofreaders.data &&
            (await Promise.all(
              proofreaders.data?.map(async (recorder) => findRecorder(recorder.attributes.username))
            )),
        };
      };

      const data: MarkOptional<Post, "createdAt" | "id" | "updatedAt" | "updatedBy"> = {
        slug,
        publishedDate:
          DateTime.fromObject({ day, month, year }).toISO() ?? new Date().toISOString(),
        categories: await Promise.all(
          categories.data.map((category) => findCategory(category.attributes.slug))
        ),
        translations: await Promise.all(translations.map(handleTranslation)),
        authors: await Promise.all(
          authors.data?.map((author) => findRecorder(author.attributes.username)) ?? []
        ),
        thumbnail: thumbnailId,
        hidden,
      };
      return data;
    },
  },
});
