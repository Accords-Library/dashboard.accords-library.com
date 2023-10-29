import type { MarkOptional } from "ts-essentials";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Content } from "../../../types/collections";
import { StrapiImage, StrapiLanguage, StrapiRecorders } from "../../../types/strapi";
import { isNotEmpty, isUndefined } from "../../../utils/asserts";
import {
  findCategory,
  findContentType,
  findRecorder,
  uploadStrapiImage,
} from "../../../utils/localApi";
import { plainTextToLexical } from "../../../utils/string";

type StrapiContent = {
  slug: string;
  categories: { data?: { attributes: { slug: string } }[] };
  type: { data?: { attributes: { slug: string } } };
  thumbnail: StrapiImage;
  translations: {
    title: string;
    subtitle?: string;
    pre_title?: string;
    description?: string;
    language: StrapiLanguage;
    text_set?: {
      text: string;
      notes?: string;
      source_language: StrapiLanguage;
      transcribers: StrapiRecorders;
      translators: StrapiRecorders;
      proofreaders: StrapiRecorders;
    };
  }[];
};

export const importFromStrapi = createStrapiImportEndpoint<StrapiContent>({
  strapi: {
    collection: "contents",
    params: {
      populate: [
        "type",
        "categories",
        "thumbnail",
        "translations",
        "translations.language",
        "translations.text_set",
        "translations.text_set.source_language",
        "translations.text_set.transcribers",
        "translations.text_set.translators",
        "translations.text_set.proofreaders",
      ],
    },
  },
  payload: {
    collection: Collections.Contents,
    convert: async ({ slug, categories, type, thumbnail, translations }) => {
      const thumbnailId = await uploadStrapiImage({
        collection: Collections.ContentsThumbnails,
        image: thumbnail,
      });

      const handleTranslation = async ({
        language,
        title,
        description,
        pre_title,
        subtitle,
        text_set,
      }: StrapiContent["translations"][number]) => {
        if (isUndefined(language.data))
          throw new Error("A language is required for a content translation");
        if (isUndefined(text_set)) throw new Error("Only content with text_set are supported");
        if (isUndefined(text_set.source_language.data))
          throw new Error("A language is required for a content translation text_set");
        return {
          language: language.data.attributes.code,
          sourceLanguage: text_set.source_language.data.attributes.code,
          title,
          pretitle: pre_title,
          subtitle,
          summary: isNotEmpty(description) ? plainTextToLexical(description) : undefined,
          textContent: plainTextToLexical(text_set.text),
          textNotes: isNotEmpty(text_set.notes) ? plainTextToLexical(text_set.notes) : undefined,
          textTranscribers:
            text_set.transcribers.data &&
            (await Promise.all(
              text_set.transcribers.data?.map(async (recorder) =>
                findRecorder(recorder.attributes.username)
              )
            )),
          textTranslators:
            text_set.translators.data &&
            (await Promise.all(
              text_set.translators.data?.map(async (recorder) =>
                findRecorder(recorder.attributes.username)
              )
            )),
          textProofreaders:
            text_set.proofreaders.data &&
            (await Promise.all(
              text_set.proofreaders.data?.map(async (recorder) =>
                findRecorder(recorder.attributes.username)
              )
            )),
        };
      };

      const data: MarkOptional<Content, "createdAt" | "id" | "updatedAt" | "updatedBy"> = {
        slug,
        categories:
          categories.data &&
          (await Promise.all(
            categories.data.map(async (category) => await findCategory(category.attributes.slug))
          )),
        type: type.data && (await findContentType(type.data?.attributes.slug)),
        thumbnail: thumbnailId,
        translations: await Promise.all(translations.map(handleTranslation)),
      };
      return data;
    },
  },
});
