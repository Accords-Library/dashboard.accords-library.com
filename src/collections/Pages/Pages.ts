import { Where } from "payload/types";
import { sectionBlock } from "../../blocks/sectionBlock";
import { spacerBlock } from "../../blocks/spacerBlock";
import { transcriptBlock } from "../../blocks/transcriptBlock";
import { QuickFilters, publishStatusFilters } from "../../components/QuickFilters";
import { CollectionGroups, Collections, PageType } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { tagsField } from "../../fields/tagsField/tagsField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { isDefined, isUndefined } from "../../utils/asserts";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";

const fields = {
  slug: "slug",
  type: "type",
  authors: "authors",
  thumbnail: "thumbnail",
  translations: "translations",
  tags: "tags",
  sourceLanguage: "sourceLanguage",
  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",
  summary: "summary",
  content: "content",
  transcribers: "transcribers",
  translators: "translators",
  proofreaders: "proofreaders",
  collectibles: "collectibles",
  folders: "folders",
} as const satisfies Record<string, string>;

const pageTypesWithAuthor = [PageType.Article];
const pageTypesWithCollectibles = [PageType.Content];
const pageTypesWithTranscribers = [PageType.Content];

export const Pages = buildVersionedCollectionConfig({
  slug: Collections.Pages,
  labels: {
    singular: "Page",
    plural: "Pages",
  },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.thumbnail, fields.slug],
    group: CollectionGroups.Collections,
    components: {
      BeforeListTable: [
        () =>
          QuickFilters({
            slug: Collections.Pages,
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
  },
  endpoints: [getBySlugEndpoint],
  fields: [
    {
      name: fields.type,
      type: "radio",
      required: true,
      defaultValue: PageType.Generic,
      options: Object.entries(PageType).map(([value, label]) => ({ label, value })),
    },
    rowField([
      slugField({ name: fields.slug }),
      imageField({
        name: fields.thumbnail,
        relationTo: Collections.Images,
      }),
    ]),
    rowField([
      tagsField({ name: fields.tags }),
      {
        name: fields.authors,
        type: "relationship",
        admin: {
          condition: (_, siblingData) => pageTypesWithAuthor.includes(siblingData[fields.type]),
        },
        relationTo: Collections.Recorders,
        required: true,
        minRows: 1,
        hasMany: true,
      },
    ]),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.title, hasSourceLanguage: true },
      required: true,
      minRows: 1,
      fields: [
        rowField([
          { name: fields.pretitle, type: "text" },
          { name: fields.title, type: "text", required: true },
          { name: fields.subtitle, type: "text" },
        ]),
        {
          name: fields.summary,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
        {
          name: fields.content,
          type: "richText",
          required: true,
          admin: {description: "Looking for help? Read the Rich Text Editor guide here: https://accords-library.com/dev/rich-text"},
          editor: createEditor({
            images: true,
            inlines: true,
            alignment: true,
            blocks: [sectionBlock, spacerBlock, transcriptBlock],
            links: true,
            lists: true,
          }),
        },
        rowField([
          {
            name: fields.transcribers,
            type: "relationship",
            relationTo: Collections.Recorders,
            hasMany: true,
            admin: {
              condition: (data, siblingData) => {
                if (!pageTypesWithTranscribers.includes(data[fields.type])) {
                  return false;
                }
                if (isUndefined(siblingData.language) || isUndefined(siblingData.sourceLanguage)) {
                  return false;
                }
                return siblingData.language === siblingData.sourceLanguage;
              },
            },
          },
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
    rowField([
      backPropagationField({
        name: fields.folders,
        relationTo: Collections.Folders,
        hasMany: true,
        where: ({ id }) => ({
          and: [
            { "files.value": { equals: id } },
            { "files.relationTo": { equals: Collections.Pages } },
          ] as Where[],
        }),
      }),
      backPropagationField({
        name: fields.collectibles,
        hasMany: true,
        relationTo: Collections.LibraryItems,
        admin: {
          condition: (_, siblingData) =>
            pageTypesWithCollectibles.includes(siblingData[fields.type]),
        },
        where: ({ id }) => ({ "contents.content": { equals: id } }),
      }),
    ]),
  ],
});
