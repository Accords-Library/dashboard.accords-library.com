import { CollectionGroups, Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  recorder: "recorder",
} as const satisfies Record<string, string>;

export const RecordersThumbnails = buildImageCollectionConfig({
  slug: Collections.RecordersThumbnails,
  labels: {
    singular: "Recorders Thumbnail",
    plural: "Recorders Thumbnails",
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
        height: 256,
        width: 256,
        formatOptions: {
          format: "jpg",
          options: { progressive: true, mozjpeg: true, compressionLevel: 9, quality: 80 },
        },
      },
      {
        name: "small",
        height: 128,
        width: 128,
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
