import { shownOnlyToAdmin } from "src/accesses/collections/shownOnlyToAdmin";
import { Collections, CollectionGroups } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";

export const VideosSubtitles = buildCollectionConfig({
  slug: Collections.VideosSubtitles,
  labels: { singular: "Video Subtitle", plural: "Videos Subtitles" },
  admin: { group: CollectionGroups.Media, disableDuplicate: true, hidden: shownOnlyToAdmin },
  upload: {
    mimeTypes: ["text/*"],
    disableLocalStorage: true,
  },
  timestamps: false,
  fields: [],
});
