import { shownOnlyToAdmin } from "src/accesses/collections/shownOnlyToAdmin";
import { createImageSizesRegenerationEndpoint } from "src/endpoints/imageSizesRegenerationEndpoint";
import { Collections } from "src/shared/payload/constants";
import { buildImageCollectionConfig, generateWebpSize } from "src/utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const Scans = buildImageCollectionConfig({
  slug: Collections.Scans,
  labels: {
    singular: "Scan",
    plural: "Scans",
  },
  admin: {
    defaultColumns: [fields.filename, fields.updatedAt],
    hidden: shownOnlyToAdmin,
  },
  endpoints: [createImageSizesRegenerationEndpoint(Collections.Scans)],
  upload: {
    imageSizes: [
      generateWebpSize(200, 60),
      generateWebpSize(320, 60),
      generateWebpSize(480, 70),
      generateWebpSize(800, 70),
    ],
  },
  fields: [],
});
