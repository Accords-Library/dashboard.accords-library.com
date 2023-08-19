import { CollectionGroups, Collections, FileTypes, KeysTypes } from "../../constants";
import { fileField } from "../../fields/fileField/fileField";
import { imageField } from "../../fields/imageField/imageField";
import { keysField } from "../../fields/keysField/keysField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { beforeDuplicateAddCopyTo } from "../../hooks/beforeDuplicateAddCopyTo";
import { beforeDuplicatePiping } from "../../hooks/beforeDuplicatePiping";
import { beforeDuplicateUnpublish } from "../../hooks/beforeDuplicateUnpublish";
import { isDefined } from "../../utils/asserts";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { contentBlocks } from "./Blocks/blocks";

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
    preview: (doc) => `https://accords-library.com/contents/${doc.slug}`,
  },
  fields: [
    {
      type: "row",
      fields: [
        slugField({ name: fields.slug, admin: { width: "50%" } }),
        imageField({
          name: fields.thumbnail,
          relationTo: Collections.ContentsThumbnails,
          admin: { width: "50%" },
        }),
      ],
    },
    {
      type: "row",
      fields: [
        keysField({
          name: fields.categories,
          relationTo: KeysTypes.Categories,
          hasMany: true,
          admin: { allowCreate: false, width: "50%" },
        }),
        keysField({
          name: fields.type,
          relationTo: KeysTypes.Contents,
          admin: { allowCreate: false, width: "50%" },
        }),
      ],
    },
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.title, hasSourceLanguage: true },
      required: true,
      minRows: 1,
      fields: [
        {
          type: "row",
          fields: [
            { name: fields.pretitle, type: "text" },
            { name: fields.title, type: "text", required: true },
            { name: fields.subtitle, type: "text" },
          ],
        },
        { name: fields.summary, type: "textarea" },
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
                  type: "row",
                  fields: [
                    {
                      name: fields.textTranscribers,
                      label: "Transcribers",
                      type: "relationship",
                      relationTo: Collections.Recorders,
                      hasMany: true,
                      admin: {
                        condition: (_, siblingData) =>
                          siblingData.language === siblingData.sourceLanguage,
                        width: "50%",
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
                        width: "50%",
                      },
                    },
                    {
                      name: fields.textProofreaders,
                      label: "Proofreaders",
                      type: "relationship",
                      relationTo: Collections.Recorders,
                      hasMany: true,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: fields.textContent,
                  label: "Content",
                  labels: { singular: "Block", plural: "Blocks" },
                  type: "blocks",
                  admin: { initCollapsed: true },
                  blocks: contentBlocks,
                },
                {
                  name: fields.textNotes,
                  label: "Notes",
                  type: "textarea",
                },
              ],
            },
            {
              label: "Video",
              fields: [
                {
                  type: "row",
                  fields: [
                    fileField({
                      name: fields.video,
                      relationTo: FileTypes.ContentVideo,
                      admin: { width: "50%" },
                    }),
                    {
                      name: fields.videoNotes,
                      label: "Notes",
                      type: "textarea",
                      admin: { width: "50%" },
                    },
                  ],
                },
              ],
            },
            {
              label: "Audio",
              fields: [
                {
                  type: "row",
                  fields: [
                    fileField({
                      name: fields.audio,
                      relationTo: FileTypes.ContentAudio,
                      admin: { width: "50%" },
                    }),
                    {
                      name: fields.audioNotes,
                      label: "Notes",
                      type: "textarea",
                      admin: { width: "50%" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
