import { Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const LibraryItemsScans = buildImageCollectionConfig({
  slug: Collections.LibraryItemsScans,
  labels: {
    singular: "Library Item Scans",
    plural: "Library Item Scans",
  },
  admin: { defaultColumns: [fields.filename, fields.updatedAt] },
  upload: {
    imageSizes: [
      {
        name: "og",
        height: 1024,
        width: 1024,
        fit: "contain",
        formatOptions: {
          format: "jpg",
          options: { progressive: true, mozjpeg: true, compressionLevel: 9, quality: 80 },
        },
      },
      {
        name: "medium",
        height: 1024,
        width: 1024,
        fit: "contain",
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 80, alphaQuality: 80 },
        },
      },
      {
        name: "large",
        height: 2048,
        width: 2048,
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
