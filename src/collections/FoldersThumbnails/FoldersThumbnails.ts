import { Collections } from "../../constants";
import { buildImageCollectionConfig } from "../../utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const FoldersThumbnails = buildImageCollectionConfig({
  slug: Collections.FoldersThumbnails,
  labels: {
    singular: "Folders Thumbnail",
    plural: "Folders Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.updatedAt] },
  upload: {
    imageSizes: [],
  },
  fields: [],
});
