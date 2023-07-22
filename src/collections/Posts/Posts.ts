import { slugField } from "../../fields/slugField/slugField";
import { imageField } from "../../fields/imageField/imageField";
import { CollectionGroup, KeysTypes } from "../../constants";
import { Recorders } from "../Recorders/Recorders";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { isDefined, isUndefined } from "../../utils/asserts";
import { removeTranslatorsForTranscripts } from "./hooks/beforeValidate";
import { Keys } from "../Keys/Keys";
import { PostThumbnails } from "../PostThumbnails/PostThumbnails";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";

const fields = {
  slug: "slug",
  hidden: "hidden",
  thumbnail: "thumbnail",
  categories: "categories",
  authors: "authors",
  publishedDate: "publishedDate",
  translations: "translations",
  sourceLanguage: "sourceLanguage",
  title: "title",
  summary: "summary",
  content: "content",
  translators: "translators",
  proofreaders: "proofreaders",
} as const satisfies Record<string, string>;

export const Posts = buildVersionedCollectionConfig(
  {
    singular: "Post",
    plural: "Posts",
  },
  () => ({
    defaultSort: fields.slug,
    admin: {
      useAsTitle: fields.slug,
      description:
        "News articles written by our Recorders! Here you will find announcements about \
new merch/items releases, guides, theories, unboxings, showcases...",
      defaultColumns: [fields.slug, fields.thumbnail, fields.categories],
      group: CollectionGroup.Collections,
      preview: (doc) => `https://accords-library.com/news/${doc.slug}`,
    },
    hooks: {
      beforeValidate: [removeTranslatorsForTranscripts],
    },
    fields: [
      {
        type: "row",
        fields: [
          slugField({ name: fields.slug, admin: { width: "50%" } }),
          imageField({
            name: fields.thumbnail,
            relationTo: PostThumbnails.slug,
            admin: { width: "50%" },
          }),
        ],
      },
      {
        type: "row",
        fields: [
          {
            name: fields.authors,
            type: "relationship",
            relationTo: [Recorders.slug],
            required: true,
            minRows: 1,
            hasMany: true,
            admin: { width: "35%" },
          },
          {
            name: fields.categories,
            type: "relationship",
            relationTo: [Keys.slug],
            filterOptions: { type: { equals: KeysTypes.Categories } },
            hasMany: true,
            admin: { allowCreate: false, width: "35%" },
          },
        ],
      },
      localizedFields({
        name: fields.translations,
        admin: { useAsTitle: fields.title, hasSourceLanguage: true },
        required: true,
        minRows: 1,
        fields: [
          { name: fields.title, type: "text", required: true },
          { name: fields.summary, type: "textarea" },
          {
            type: "row",
            fields: [
              {
                name: fields.translators,
                type: "relationship",
                relationTo: Recorders.slug,
                hasMany: true,
                admin: {
                  condition: (_, siblingData) => {
                    if (
                      isUndefined(siblingData.language) ||
                      isUndefined(siblingData.sourceLanguage)
                    ) {
                      return false;
                    }
                    return siblingData.language !== siblingData.sourceLanguage;
                  },
                  width: "50%",
                },
                validate: (translators, { siblingData }) => {
                  if (
                    isUndefined(siblingData.language) ||
                    isUndefined(siblingData.sourceLanguage)
                  ) {
                    return true;
                  }
                  if (siblingData.language === siblingData.sourceLanguage) {
                    return true;
                  }
                  if (isDefined(translators) && translators.length > 0) {
                    return true;
                  }
                  return "This field is required when the language is different from the source language.";
                },
              },
              {
                name: fields.proofreaders,
                type: "relationship",
                relationTo: Recorders.slug,
                hasMany: true,
                admin: { width: "50%" },
              },
            ],
          },
          { name: fields.content, type: "richText", admin: { hideGutter: true } },
        ],
      }),
      {
        name: fields.publishedDate,
        type: "date",
        defaultValue: new Date().toISOString(),
        admin: {
          date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
          position: "sidebar",
        },
        required: true,
      },
      {
        name: fields.hidden,
        type: "checkbox",
        required: false,
        defaultValue: false,
        admin: {
          description: "If enabled, the post won't appear in the 'News' section",
          position: "sidebar",
        },
      },
    ],
  })
);
