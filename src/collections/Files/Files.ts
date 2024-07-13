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
  attributes: "attributes",
  credits: "credits",
};

export const Files = buildCollectionConfig({
  slug: Collections.Files,
  labels: { singular: "File", plural: "Files" },
  defaultSort: fields.filename,
  admin: {
    group: CollectionGroups.Media,
    preview: ({ id }) => `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/files/${id}`,
    description: "For any file that isn't a video, an image, or an audio file.",
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
    disableLocalStorage: true,
  },
  endpoints: [getByID],
  fields: [
    imageField({
      name: fields.thumbnail,
      relationTo: Collections.MediaThumbnails,
    }),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsTitle },
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
