import { shownOnlyToAdmin } from "../../accesses/collections/shownOnlyToAdmin";
import { createImageSizesRegenerationEndpoint } from "../../endpoints/imageSizesRegenerationEndpoint";
import { Collections } from "../../shared/payload/constants";
import { buildImageCollectionConfig, generateWebpSize } from "../../utils/imageCollectionConfig";

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
    useAsTitle: fields.filename,
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
