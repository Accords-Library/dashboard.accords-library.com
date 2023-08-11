import { CollectionGroups, Collections } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

export const WeaponsThumbnails = buildCollectionConfig(
  Collections.WeaponsThumbnails,
  {
    singular: "Weapons Thumbnail",
    plural: "Weapons Thumbnails",
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
    fields: [],
  })
);
