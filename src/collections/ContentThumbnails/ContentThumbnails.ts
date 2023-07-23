import { CollectionGroup } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

export const ContentThumbnails = buildCollectionConfig(
  {
    singular: "Content Thumbnail",
    plural: "Content Thumbnails",
  },
  ({ uploadDir }) => ({
    defaultSort: fields.filename,
    admin: {
      useAsTitle: fields.filename,
      group: CollectionGroup.Media,
    },
    upload: {
      staticDir: uploadDir,
      mimeTypes: ["image/*"],
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
  })
);
