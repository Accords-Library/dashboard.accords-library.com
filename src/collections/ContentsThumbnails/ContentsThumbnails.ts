import { CollectionGroups, Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

export const ContentsThumbnails = buildImageCollectionConfig({
  slug: Collections.ContentsThumbnails,
  labels: {
    singular: "Contents Thumbnail",
    plural: "Contents Thumbnails",
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
        name: "og",
        height: 750,
        width: 1125,
        formatOptions: {
          format: "jpg",
          options: { progressive: true, mozjpeg: true, compressionLevel: 9, quality: 80 },
        },
      },
      {
        name: "medium",
        height: 1000,
        width: 1500,
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 80, alphaQuality: 80 },
        },
      },
    ],
  },
  fields: [],
});
