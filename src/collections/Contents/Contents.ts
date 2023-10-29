import { sectionBlock } from "../../blocks/sectionBlock";
import { transcriptBlock } from "../../blocks/transcriptBlock";
import { CollectionGroups, Collections, FileTypes, KeysTypes } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { fileField } from "../../fields/fileField/fileField";
import { imageField } from "../../fields/imageField/imageField";
import { keysField } from "../../fields/keysField/keysField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { isDefined } from "../../utils/asserts";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";
import { importRelationsFromStrapi } from "./endpoints/importRelationsFromStrapi";

const fields = {
  slug: "slug",
  thumbnail: "thumbnail",
  categories: "categories",
  type: "type",
  translations: "translations",
  pretitle: "pretitle",
  title: "title",
  subtitle: "subtitle",
  summary: "summary",
  textContent: "textContent",
  textTranscribers: "textTranscribers",
  textTranslators: "textTranslators",
  textProofreaders: "textProofreaders",
  textNotes: "textNotes",
  video: "video",
  videoNotes: "videoNotes",
  audio: "audio",
  audioNotes: "videoNotes",
  status: "status",
  updatedBy: "updatedBy",
  previousContents: "previousContents",
  nextContents: "nextContents",
  folders: "folders",
  libraryItems: "libraryItems",
} as const satisfies Record<string, string>;

export const Contents = buildVersionedCollectionConfig({
  slug: Collections.Contents,
  labels: {
    singular: "Content",
    plural: "Contents",
  },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    description:
      "All the contents (textual, audio, and video) from the Library or other online sources.",
    defaultColumns: [
      fields.thumbnail,
      fields.slug,
      fields.categories,
      fields.type,
      fields.translations,
      fields.status,
    ],
    group: CollectionGroups.Collections,
    hooks: {
      beforeDuplicate: beforeDuplicatePiping([
        beforeDuplicateUnpublish,
        beforeDuplicateAddCopyTo(fields.slug),
      ]),
    },
  },
  endpoints: [importFromStrapi, importRelationsFromStrapi],
  fields: [
    rowField([
      slugField({ name: fields.slug }),
      imageField({
        name: fields.thumbnail,
        relationTo: Collections.ContentsThumbnails,
      }),
    ]),
    rowField([
      keysField({
        name: fields.categories,
        relationTo: KeysTypes.Categories,
        hasMany: true,
      }),
      keysField({
        name: fields.type,
        relationTo: KeysTypes.Contents,
      }),
      backPropagationField({
        name: fields.libraryItems,
        hasMany: true,
        relationTo: Collections.LibraryItems,
        where: ({ id }) => ({ "contents.content": { equals: id } }),
      }),
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
          type: "tabs",
          admin: {
            condition: (_, siblingData) =>
              isDefined(siblingData.language) && isDefined(siblingData.sourceLanguage),
          },
          tabs: [
            {
              label: "Text",
              fields: [
                {
                  name: fields.textContent,
                  type: "richText",
                  label: false,
                  editor: createEditor({
                    blocks: [sectionBlock, transcriptBlock],
                    images: true,
                    inlines: true,
                    lists: true,
                    links: true,
                    relations: true,
                    alignment: true,
                  }),
                },
                rowField([
                  {
                    name: fields.textTranscribers,
                    label: "Transcribers",
                    type: "relationship",
                    relationTo: Collections.Recorders,
                    hasMany: true,
                    admin: {
                      condition: (_, siblingData) =>
                        siblingData.language === siblingData.sourceLanguage,
                    },
                  },
                  {
                    name: fields.textTranslators,
                    label: "Translators",
                    type: "relationship",
                    relationTo: Collections.Recorders,
                    hasMany: true,
                    admin: {
                      condition: (_, siblingData) =>
                        siblingData.language !== siblingData.sourceLanguage,
                    },
                  },
                  {
                    name: fields.textProofreaders,
                    label: "Proofreaders",
                    type: "relationship",
                    relationTo: Collections.Recorders,
                    hasMany: true,
                  },
                ]),
                {
                  name: fields.textNotes,
                  label: "Notes",
                  type: "richText",
                  editor: createEditor({ inlines: true, lists: true, links: true }),
                },
              ],
            },
            {
              label: "Video",
              fields: [
                rowField([
                  fileField({
                    name: fields.video,
                    relationTo: FileTypes.ContentVideo,
                  }),
                  {
                    name: fields.videoNotes,
                    label: "Notes",
                    type: "richText",
                    editor: createEditor({ inlines: true, lists: true, links: true }),
                  },
                ]),
              ],
            },
            {
              label: "Audio",
              fields: [
                rowField([
                  fileField({
                    name: fields.audio,
                    relationTo: FileTypes.ContentAudio,
                  }),
                  {
                    name: fields.audioNotes,
                    label: "Notes",
                    type: "richText",
                    editor: createEditor({ inlines: true, lists: true, links: true }),
                  },
                ]),
              ],
            },
          ],
        },
      ],
    }),
    rowField([
      backPropagationField({
        name: fields.folders,
        hasMany: true,
        relationTo: Collections.ContentsFolders,
        where: ({ id }) => ({ contents: { equals: id } }),
        admin: {
          description: `You can set the folder(s) from the "Contents Folders" collection`,
        },
      }),
      backPropagationField({
        name: fields.previousContents,
        relationTo: Collections.Contents,
        hasMany: true,
        where: ({ id }) => ({ [fields.nextContents]: { equals: id } }),
      }),
      {
        name: fields.nextContents,
        type: "relationship",
        hasMany: true,
        relationTo: Collections.Contents,
      },
    ]),
  ],
});
