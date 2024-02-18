import { Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const FoldersThumbnails = buildImageCollectionConfig({
  slug: Collections.FoldersThumbnails,
  labels: {
    singular: "Folders Thumbnail",
    plural: "Folders Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.updatedAt] },
  upload: {
    imageSizes: [
      {
        name: "medium",
        height: 400,
        width: 200,
        fit: "contain",
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 80, alphaQuality: 80 },
        },
      },
    ],
  },
  fields: [],
});
