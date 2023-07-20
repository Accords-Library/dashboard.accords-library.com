import { CollectionConfig } from "payload/types";
import { slugField } from "../../fields/slugField/slugField";
import { imageField } from "../../fields/imageField/imageField";
import { CollectionGroup, TagsTypes } from "../../constants";
import { Recorders } from "../Recorders/Recorders";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { isDefined, isUndefined } from "../../utils/asserts";
import { removeTranslatorsForTranscripts } from "./hooks/beforeValidate";
import { Tags } from "../Tags/Tags";
import { collectionSlug } from "../../utils/string";

const fields = {
  slug: "slug",
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

const labels = {
  singular: "Post",
  plural: "Posts",
} as const satisfies { singular: string; plural: string };

export const Posts: CollectionConfig = {
  slug: collectionSlug(labels.plural),
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.thumbnail, fields.categories],
    group: CollectionGroup.Collections,
    preview: (doc) => `https://accords-library.com/news/${doc.slug}`,
  },
  hooks: {
    beforeValidate: [removeTranslatorsForTranscripts],
  },
  timestamps: true,
  versions: { drafts: true },
  fields: [
    {
      type: "row",
      fields: [
        slugField({ name: fields.slug, admin: { width: "50%" } }),
        imageField({ name: fields.thumbnail, admin: { width: "50%" } }),
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
          admin: { width: "50%" },
        },
        {
          name: fields.categories,
          type: "relationship",
          relationTo: [Tags.slug],
          filterOptions: { type: { equals: TagsTypes.Categories } },
          hasMany: true,
          admin: { allowCreate: false, width: "50%" },
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
                if (isUndefined(siblingData.language) || isUndefined(siblingData.sourceLanguage)) {
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
  ],
};
