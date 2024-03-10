import { Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  posts: "posts",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const BackgroundImages = buildImageCollectionConfig({
  slug: Collections.BackgroundImages,
  labels: {
    singular: "Background Image",
    plural: "Background Images",
  },
  admin: { defaultColumns: [fields.filename, fields.posts, fields.updatedAt] },
  upload: {
    imageSizes: [],
  },
  fields: [],
});
