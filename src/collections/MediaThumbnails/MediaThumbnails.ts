import { shownOnlyToAdmin } from "../../accesses/collections/shownOnlyToAdmin";
import { Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const MediaThumbnails = buildImageCollectionConfig({
  slug: Collections.MediaThumbnails,
  labels: {
    singular: "Media Thumbnail",
    plural: "Media Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.updatedAt], hidden: shownOnlyToAdmin },
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
