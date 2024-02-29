import { Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  posts: "posts",
  updatedAt: "updatedAt",
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
  fields: [],
});
