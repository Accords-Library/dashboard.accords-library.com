import { CollectionGroups, Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

export const WeaponsThumbnails = buildImageCollectionConfig({
  slug: Collections.WeaponsThumbnails,
  labels: {
    singular: "Weapons Thumbnail",
    plural: "Weapons Thumbnails",
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
        height: 512,
        width: 512,
        fit: "inside",
        formatOptions: {
          format: "jpg",
          options: { progressive: true, mozjpeg: true, compressionLevel: 9, quality: 80 },
        },
      },
      {
        name: "small",
        height: 256,
        width: 256,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 70, alphaQuality: 70 },
        },
      },
      {
        name: "medium",
        height: 1024,
        width: 1024,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 80, alphaQuality: 80 },
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
