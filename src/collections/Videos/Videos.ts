import { CollectionGroups, Collections } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

export const Videos = buildCollectionConfig({
  slug: Collections.Videos,
  labels: { singular: "Video", plural: "Videos" },
  admin: { group: CollectionGroups.Media },
  upload: {
    mimeTypes: ["video/*"],
    disableLocalStorage: true,
  },
  fields: [],
});
