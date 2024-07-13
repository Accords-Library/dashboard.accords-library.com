import { shownOnlyToAdmin } from "src/accesses/collections/shownOnlyToAdmin";
import { createImageSizesRegenerationEndpoint } from "src/endpoints/imageSizesRegenerationEndpoint";
import { Collections } from "src/shared/payload/constants";
import {
  buildImageCollectionConfig,
  generateOpenGraphSize,
  generateWebpSize,
} from "src/utils/imageCollectionConfig";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  updatedAt: "updatedAt",
} as const satisfies Record<string, string>;

export const MediaThumbnails = buildImageCollectionConfig({
  slug: Collections.MediaThumbnails,
  labels: {
    singular: "Media Thumbnail",
    plural: "Media Thumbnails",
  },
  admin: { defaultColumns: [fields.filename, fields.updatedAt], hidden: shownOnlyToAdmin },
  endpoints: [createImageSizesRegenerationEndpoint(Collections.MediaThumbnails)],
  upload: {
    imageSizes: [
      generateOpenGraphSize(),
      generateWebpSize(200, 60),
      generateWebpSize(320, 60),
      generateWebpSize(480, 70),
      generateWebpSize(800, 70),
      generateWebpSize(1280, 85),
      generateWebpSize(1920, 85),
      generateWebpSize(2560, 90),
    ],
  },
  fields: [],
});
