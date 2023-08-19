import { Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  posts: "posts",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const PostsThumbnails = buildImageCollectionConfig({
  slug: Collections.PostsThumbnails,
  labels: {
    singular: "Post Thumbnail",
    plural: "Post Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.posts, fields.updatedAt] },
  upload: {
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
  fields: [
    backPropagationField({
      name: fields.posts,
      hasMany: true,
      relationTo: Collections.Posts,
      where: ({ id }) => ({ thumbnail: { equals: id } }),
    }),
  ],
});
