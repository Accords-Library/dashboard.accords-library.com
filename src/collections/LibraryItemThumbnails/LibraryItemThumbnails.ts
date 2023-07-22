import { CollectionGroup } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

export const LibraryItemThumbnails = buildCollectionConfig(
  {
    singular: "Library Item Thumbnail",
    plural: "Library Item Thumbnails",
  },
  ({ labels }) => ({
    defaultSort: fields.filename,
    admin: {
      useAsTitle: fields.filename,
      group: CollectionGroup.Media,
    },
    upload: {
      staticDir: `../uploads/${labels.plural}`,
      mimeTypes: ["image/*"],
      imageSizes: [
        {
          name: "og",
          height: 1024,
          width: 1024,
          fit: "contain",
          formatOptions: {
            format: "jpg",
            options: { progressive: true, mozjpeg: true, compressionLevel: 9, quality: 80 },
          },
        },
        {
          name: "medium",
          height: 1024,
          width: 1024,
          fit: "contain",
          formatOptions: {
            format: "webp",
            options: { effort: 6, quality: 80, alphaQuality: 80 },
          },
        },
        {
          name: "large",
          height: 2048,
          width: 2048,
          fit: "contain",
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
