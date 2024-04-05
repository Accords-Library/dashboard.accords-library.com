import { CollectionGroups, Collections } from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { tagsField } from "../../fields/tagsField/tagsField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { createEditor } from "../../utils/editor";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
  translations: "translations",
  translationsTitle: "title",
  translationsDescription: "description",
  translationsSubfile: "subfile",
  thumbnail: "thumbnail",
  duration: "duration",
  tags: "tags",
};

export const Audios = buildCollectionConfig({
  slug: Collections.Audios,
  labels: { singular: "Audio", plural: "Audios" },
  defaultSort: fields.updatedAt,
  admin: {
    group: CollectionGroups.Media,
    defaultColumns: [
      fields.filename,
      fields.mimeType,
      fields.filesize,
      fields.translations,
      fields.updatedAt,
    ],
  },
  upload: {
    mimeTypes: ["audio/*"],
    disableLocalStorage: true,
  },
  fields: [
    rowField([
      { name: fields.duration, type: "number", min: 0, required: true },
      imageField({
        name: fields.thumbnail,
        relationTo: Collections.MediaThumbnails,
      }),
    ]),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsTitle },
      required: true,
      minRows: 1,
      fields: [
        { name: fields.translationsTitle, type: "text", required: true },
        {
          name: fields.translationsDescription,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
        {
          name: fields.translationsSubfile,
          type: "upload",
          relationTo: Collections.VideosSubtitles,
          admin: { description: "The subtitle file needs to follow the WebVTT file format (.vtt)" },
        },
      ],
    }),
    tagsField({ name: fields.tags }),
  ],
});
