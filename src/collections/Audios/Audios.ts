import { attributesField } from "src/fields/attributesField/attributesField";
import { creditsField } from "src/fields/creditsField/creditsField";
import { imageField } from "src/fields/imageField/imageField";
import { rowField } from "src/fields/rowField/rowField";
import { translatedFields } from "src/fields/translatedFields/translatedFields";
import { Collections, CollectionGroups } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";
import { createEditor } from "src/utils/editor";
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
  thumbnail: "thumbnail",
  duration: "duration",
  attributes: "attributes",
  credits: "credits",
};

export const Audios = buildCollectionConfig({
  slug: Collections.Audios,
  labels: { singular: "Audio", plural: "Audios" },
  defaultSort: fields.filename,
  admin: {
    group: CollectionGroups.Media,
    preview: ({ id }) => `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/audios/${id}`,
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
    mimeTypes: ["audio/*"],
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
      ],
    }),
    attributesField({ name: fields.attributes }),
    creditsField({ name: fields.credits }),
  ],
});
