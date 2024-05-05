import { ImageSize } from "payload/dist/uploads/types";
import { CollectionConfig } from "payload/types";
import { publicAccess } from "../accesses/publicAccess";
import { CollectionGroups } from "../constants";
import { BuildCollectionConfig, buildCollectionConfig } from "./collectionConfig";

const fields = {
  filename: "filename",
};

type BuildImageCollectionConfig = Omit<BuildCollectionConfig, "upload"> & {
  upload: { imageSizes: ImageSize[] };
};

export const buildImageCollectionConfig = ({
  admin,
  upload: { imageSizes },
  ...otherConfig
}: BuildImageCollectionConfig): CollectionConfig =>
  buildCollectionConfig({
    ...otherConfig,
    defaultSort: fields.filename,
    admin: {
      disableDuplicate: true,
      useAsTitle: fields.filename,
      group: CollectionGroups.Media,
      ...admin,
    },
    access: {
      read: publicAccess,
    },
    upload: {
      staticDir: `../uploads/${otherConfig.slug}`,
      mimeTypes: ["image/*"],
      adminThumbnail: "thumb",
      imageSizes: [
        {
          name: "thumb",
          height: 128,
          width: 128,
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          formatOptions: {
            format: "webp",
            options: { effort: 6, quality: 50, alphaQuality: 50 },
          },
        },
        ...imageSizes,
      ],
    },
  });
