import { Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  libraryItem: "libraryItem",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const LibraryItemsThumbnails = buildImageCollectionConfig({
  slug: Collections.LibraryItemsThumbnails,
  labels: {
    singular: "Library Item Thumbnail",
    plural: "Library Item Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.libraryItem, fields.updatedAt] },
  upload: {
    imageSizes: [
      {
        name: "og",
        height: 1024,
        width: 1024,
        fit: "inside",
        formatOptions: {
          format: "jpg",
          options: { progressive: true, mozjpeg: true, compressionLevel: 9, quality: 80 },
        },
      },
      {
        name: "square",
        height: 1024,
        width: 1024,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 80, alphaQuality: 80 },
        },
      },
    ],
  },
  fields: [
    backPropagationField({
      name: fields.libraryItem,
      hasMany: true,
      relationTo: Collections.LibraryItems,
      where: ({ id }) => ({ thumbnail: { equals: id } }),
    }),
  ],
});
