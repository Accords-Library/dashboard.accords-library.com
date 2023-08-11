import { CollectionGroups, Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  recorder: "recorder",
} as const satisfies Record<string, string>;

export const RecordersThumbnails = buildCollectionConfig(
  Collections.RecordersThumbnails,
  {
    singular: "Recorders Thumbnail",
    plural: "Recorders Thumbnails",
  },
  ({ uploadDir }) => ({
    defaultSort: fields.filename,
    admin: {
      useAsTitle: fields.filename,
      disableDuplicate: true,
      group: CollectionGroups.Media,
    },
    upload: {
      staticDir: uploadDir,
      adminThumbnail: "small",
      mimeTypes: ["image/*"],
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
        where: (id) => ({ avatar: { equals: id } }),
      }),
    ],
  })
);
