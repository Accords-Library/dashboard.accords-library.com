import { sectionBlock } from "../../blocks/sectionBlock";
import { transcriptBlock } from "../../blocks/transcriptBlock";
import { QuickFilters, publishStatusFilters } from "../../components/QuickFilters";
import { CollectionGroups, Collections, KeysTypes } from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { keysField } from "../../fields/keysField/keysField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { isDefined, isUndefined } from "../../utils/asserts";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

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

export const Posts = buildVersionedCollectionConfig({
  slug: Collections.Posts,
  labels: {
    singular: "Post",
    plural: "Posts",
  },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    description:
      "News articles written by our Recorders! Here you will find announcements about \
         new merch/items releases, guides, theories, unboxings, showcases...",
    defaultColumns: [fields.thumbnail, fields.slug, fields.categories],
    group: CollectionGroups.Collections,
    components: {
      BeforeListTable: [
        () =>
          QuickFilters({
            slug: Collections.Posts,
            filterGroups: [publishStatusFilters],
          }),
      ],
    },
    hooks: {
      beforeDuplicate: beforeDuplicatePiping([
        beforeDuplicateUnpublish,
        beforeDuplicateAddCopyTo(fields.slug),
      ]),
    },
    preview: (doc) => `https://accords-library.com/news/${doc.slug}`,
  },
  endpoints: [importFromStrapi],
  fields: [
    rowField([
      slugField({ name: fields.slug }),
      imageField({
        name: fields.thumbnail,
        relationTo: Collections.PostsThumbnails,
      }),
    ]),
    rowField([
      {
        name: fields.authors,
        type: "relationship",
        relationTo: Collections.Recorders,
        required: true,
        minRows: 1,
        hasMany: true,
      },
      keysField({ name: fields.categories, relationTo: KeysTypes.Categories, hasMany: true }),
    ]),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.title, hasSourceLanguage: true },
      required: true,
      minRows: 1,
      fields: [
        { name: fields.title, type: "text", required: true },
        {
          name: fields.summary,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
        {
          name: fields.content,
          type: "richText",
          editor: createEditor({
            images: true,
            inlines: true,
            alignment: true,
            blocks: [sectionBlock, transcriptBlock],
            links: true,
            lists: true,
          }),
        },
        rowField([
          {
            name: fields.translators,
            type: "relationship",
            relationTo: Collections.Recorders,
            hasMany: true,
            hooks: {
              beforeChange: [
                ({ siblingData }) => {
                  if (siblingData.language === siblingData.sourceLanguage) {
                    delete siblingData.translators;
                  }
                },
              ],
            },
            admin: {
              condition: (_, siblingData) => {
                if (isUndefined(siblingData.language) || isUndefined(siblingData.sourceLanguage)) {
                  return false;
                }
                return siblingData.language !== siblingData.sourceLanguage;
              },
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
            relationTo: Collections.Recorders,
            hasMany: true,
          },
        ]),
      ],
    }),
    {
      name: fields.publishedDate,
      type: "date",
      defaultValue: new Date().toISOString(),
      admin: {
        date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
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
      },
    },
  ],
});
