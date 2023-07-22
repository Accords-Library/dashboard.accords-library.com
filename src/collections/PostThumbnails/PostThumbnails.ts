import { CollectionConfig } from "payload/types";
import { CollectionGroup } from "../../constants";
import { collectionSlug } from "../../utils/string";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Post Thumbnail",
  plural: "Post Thumbnails",
} as const satisfies { singular: string; plural: string };

export const PostThumbnails: CollectionConfig = {
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
};
