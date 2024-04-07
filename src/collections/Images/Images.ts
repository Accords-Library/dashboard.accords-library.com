import { Collections } from "../../constants";
import { tagsField } from "../../fields/tagsField/tagsField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { createEditor } from "../../utils/editor";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";
import { getByID } from "./endpoints/getByID";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  posts: "posts",
  updatedAt: "updatedAt",
  translations: "translations",
  translationsTitle: "title",
  translationsDescription: "description",
  tags: "tags",
} as const satisfies Record<string, string>;

export const Images = buildImageCollectionConfig({
  slug: Collections.Images,
  labels: {
    singular: "Image",
    plural: "Images",
  },
  admin: { defaultColumns: [fields.filename, fields.posts, fields.updatedAt] },
  upload: {
    imageSizes: [
      {
        name: "og",
        height: 750,
        width: 1125,
        formatOptions: {
          format: "jpg",
          options: { progressive: true, mozjpeg: true, compressionLevel: 9, quality: 60 },
        },
      },
    ],
  },
  endpoints: [getByID],
  fields: [
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsTitle },
      fields: [
        { name: fields.translationsTitle, type: "text", required: true },
        {
          name: fields.translationsDescription,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
      ],
    }),
    tagsField({ name: fields.tags }),
  ],
});
