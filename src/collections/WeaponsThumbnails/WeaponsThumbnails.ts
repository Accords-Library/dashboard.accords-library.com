import { Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  weapon: "weapon",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const WeaponsThumbnails = buildImageCollectionConfig({
  slug: Collections.WeaponsThumbnails,
  labels: {
    singular: "Weapons Thumbnail",
    plural: "Weapons Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.weapon, fields.updatedAt] },
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
  fields: [
    backPropagationField({
      name: fields.weapon,
      hasMany: false,
      relationTo: Collections.Weapons,
      where: ({ id }) => ({ thumbnail: { equals: id } }),
    }),
  ],
});
