import { shownOnlyToAdmin } from "../../accesses/collections/shownOnlyToAdmin";
import { CollectionGroups, Collections } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

export const VideosSubtitles = buildCollectionConfig({
  slug: Collections.VideosSubtitles,
  labels: { singular: "Video Subtitle", plural: "Videos Subtitles" },
  admin: { group: CollectionGroups.Media, disableDuplicate: true, hidden: shownOnlyToAdmin },
  upload: {
    staticDir: `../uploads/${Collections.VideosSubtitles}`,
    mimeTypes: ["text/*"],
  },
  timestamps: false,
  fields: [],
});
