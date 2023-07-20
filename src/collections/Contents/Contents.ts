import { CollectionConfig } from "payload/types";
import { collectionSlug } from "../../utils/string";
import { CollectionGroup, FileTypes, TagsTypes } from "../../constants";
import { slugField } from "../../fields/slugField/slugField";
import { imageField } from "../../fields/imageField/imageField";
import { Tags } from "../Tags/Tags";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { Recorders } from "../Recorders/Recorders";
import { isDefined } from "../../utils/asserts";
import { fileField } from "../../fields/fileField/fileField";
import { rootBlocks } from "./Blocks/blocks";

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
} as const satisfies Record<string, string>;

const labels = {
  singular: "Content",
  plural: "Contents",
} as const satisfies { singular: string; plural: string };

export const Contents: CollectionConfig = {
  slug: collectionSlug(labels.plural),
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.thumbnail, fields.categories],
    group: CollectionGroup.Collections,
    preview: (doc) => `https://accords-library.com/contents/${doc.slug}`,
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
      name: "testing",
      type: "blocks",
      admin: { initCollapsed: true },
      blocks: rootBlocks,
    },
    {
      type: "row",
      fields: [
        {
          name: fields.categories,
          type: "relationship",
          relationTo: [Tags.slug],
          filterOptions: { type: { equals: TagsTypes.Categories } },
          hasMany: true,
          admin: { allowCreate: false, width: "50%" },
        },
        {
          name: fields.type,
          type: "relationship",
          relationTo: [Tags.slug],
          filterOptions: { type: { equals: TagsTypes.Contents } },
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
                      relationTo: Recorders.slug,
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
                      relationTo: Recorders.slug,
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
                      relationTo: Recorders.slug,
                      hasMany: true,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: fields.textContent,
                  label: "Content",
                  type: "richText",
                  admin: { hideGutter: true },
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
                      filterOptions: { type: { equals: FileTypes.ContentVideo } },
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
                      filterOptions: { type: { equals: FileTypes.ContentAudio } },
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
};
