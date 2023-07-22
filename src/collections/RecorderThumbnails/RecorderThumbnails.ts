import { CollectionConfig } from "payload/types";
import { CollectionGroup } from "../../constants";
import { collectionSlug } from "../../utils/string";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Recorder Thumbnail",
  plural: "Recorder Thumbnails",
} as const satisfies { singular: string; plural: string };

export const RecorderThumbnails: CollectionConfig = {
  slug: collectionSlug(labels.plural),
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.filename,
  admin: {
    useAsTitle: fields.filename,
    group: CollectionGroup.Media,
  },

  upload: {
    staticDir: `../uploads/${labels.plural}`,
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
};
