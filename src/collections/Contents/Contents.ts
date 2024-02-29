import { Where } from "payload/types";
import { sectionBlock } from "../../blocks/sectionBlock";
import { transcriptBlock } from "../../blocks/transcriptBlock";
import { CollectionGroups, Collections, FileTypes } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { fileField } from "../../fields/fileField/fileField";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { tagsField } from "../../fields/tagsField/tagsField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { isDefined } from "../../utils/asserts";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";
import { importFromStrapi } from "./endpoints/importFromStrapi";
import { importRelationsFromStrapi } from "./endpoints/importRelationsFromStrapi";

const fields = {
  slug: "slug",
  thumbnail: "thumbnail",
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
  audioNotes: "audioNotes",
  status: "status",
  updatedBy: "updatedBy",
  previousContents: "previousContents",
  nextContents: "nextContents",
  folders: "folders",
  libraryItems: "libraryItems",
  tags: "tags",
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
    defaultColumns: [fields.thumbnail, fields.slug, fields.translations, fields.status],
    group: CollectionGroups.Collections,
    hooks: {
      beforeDuplicate: beforeDuplicatePiping([
        beforeDuplicateUnpublish,
        beforeDuplicateAddCopyTo(fields.slug),
      ]),
    },
  },
  endpoints: [importFromStrapi, importRelationsFromStrapi, getBySlugEndpoint],
  fields: [
    rowField([
      slugField({ name: fields.slug }),
      imageField({
        name: fields.thumbnail,
        relationTo: Collections.ContentsThumbnails,
      }),
    ]),
    tagsField({ name: fields.tags }),
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
        relationTo: Collections.Folders,
        hasMany: true,
        where: ({ id }) => ({
          and: [
            { "files.value": { equals: id } },
            { "files.relationTo": { equals: Collections.Contents } },
          ] as Where[],
        }),
      }),
      backPropagationField({
        name: fields.libraryItems,
        hasMany: true,
        relationTo: Collections.LibraryItems,
        where: ({ id }) => ({ "contents.content": { equals: id } }),
      }),
    ]),
    rowField([
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
