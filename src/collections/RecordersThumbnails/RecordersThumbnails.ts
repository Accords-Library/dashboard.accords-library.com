import { Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  recorder: "recorder",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const RecordersThumbnails = buildImageCollectionConfig({
  slug: Collections.RecordersThumbnails,
  labels: {
    singular: "Recorders Thumbnail",
    plural: "Recorders Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.recorder, fields.updatedAt] },
  upload: {
    imageSizes: [
      {
        name: "square",
        height: 150,
        width: 150,
        fit: "cover",
        formatOptions: {
          format: "webp",
          options: { effort: 6, quality: 80, alphaQuality: 80 },
        },
      },
    ],
  },
  fields: [
    backPropagationField({
      name: fields.recorder,
      hasMany: false,
      relationTo: Collections.Recorders,
      where: ({ id }) => ({ avatar: { equals: id } }),
    }),
  ],
});
