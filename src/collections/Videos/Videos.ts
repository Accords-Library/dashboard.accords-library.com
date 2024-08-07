import { attributesField } from "../../fields/attributesField/attributesField";
import { componentField } from "../../fields/componentField/componentField";
import { creditsField } from "../../fields/creditsField/creditsField";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { Collections, CollectionGroups } from "../../shared/payload/constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { createEditor } from "../../utils/editor";
import { getByID } from "./endpoints/getByID";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
  translations: "translations",
  translationsPretitle: "pretitle",
  translationsTitle: "title",
  translationsSubtitle: "subtitle",
  translationsDescription: "description",
  translationsSubfile: "subfile",
  thumbnail: "thumbnail",
  duration: "duration",
  attributes: "attributes",
  platform: "platform",
  platformChannel: "channel",
  platformViews: "views",
  platformPublishedDate: "publishedDate",
  platformUrl: "url",
  platformLikes: "likes",
  platformDislikes: "dislikes",
  credits: "credits",
};

export const Videos = buildCollectionConfig({
  slug: Collections.Videos,
  labels: { singular: "Video", plural: "Videos" },
  defaultSort: fields.filename,
  admin: {
    useAsTitle: fields.filename,
    group: CollectionGroups.Media,
    preview: ({ id }) => `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/videos/${id}`,
    defaultColumns: [
      fields.filename,
      fields.thumbnail,
      fields.mimeType,
      fields.filesize,
      fields.translations,
      fields.updatedAt,
    ],
  },
  upload: {
    mimeTypes: ["video/*"],
    disableLocalStorage: true,
  },
  endpoints: [getByID],
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
        rowField([
          { name: fields.translationsPretitle, type: "text" },
          { name: fields.translationsTitle, type: "text", required: true },
          { name: fields.translationsSubtitle, type: "text" },
        ]),
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
    attributesField({ name: fields.attributes }),
    creditsField({ name: fields.credits }),
    componentField({
      name: fields.platform,
      admin: {
        description:
          "If the video comes from a platform (e.g: YouTube, NicoNico, Tumblr...),\
           add additional informations here.",
      },
      fields: [
        {
          name: fields.platformChannel,
          type: "relationship",
          relationTo: Collections.VideosChannels,
          required: true,
        },
        rowField([
          { name: fields.platformViews, type: "number", min: 0 },
          { name: fields.platformLikes, type: "number", min: 0 },
          { name: fields.platformDislikes, type: "number", min: 0 },
        ]),
        {
          name: fields.platformUrl,
          type: "text",
          required: true,
          admin: {
            description:
              "If the video comes from a platform (e.g: YouTube, NicoNico, Tumblr...), paste the URL here.",
          },
        },
        {
          name: fields.platformPublishedDate,
          required: true,
          type: "date",
          admin: {
            date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" },
          },
        },
      ],
    }),
  ],
});
