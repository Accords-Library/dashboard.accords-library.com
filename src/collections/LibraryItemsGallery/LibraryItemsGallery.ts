import { CollectionGroups, Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

export const LibraryItemsGallery = buildImageCollectionConfig({
  slug: Collections.LibraryItemsGallery,
  labels: {
    singular: "Library Item Gallery",
    plural: "Library Item Gallery",
  },
  defaultSort: fields.filename,
  admin: {
    useAsTitle: fields.filename,
    disableDuplicate: true,
    group: CollectionGroups.Media,
  },
  upload: {
    imageSizes: [
      {
        name: "small",
        height: 512,
        width: 512,
        fit: "cover",
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 60, alphaQuality: 60 },
        },
      },
      {
        name: "max",
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 80, alphaQuality: 80 },
        },
      },
    ],
  },
  fields: [],
});
