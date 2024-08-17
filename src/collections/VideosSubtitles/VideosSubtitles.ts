import { shownOnlyToAdmin } from "../../accesses/collections/shownOnlyToAdmin";
import { Collections, CollectionGroups } from "../../shared/payload/constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";

export const VideosSubtitles = buildCollectionConfig({
  slug: Collections.VideosSubtitles,
  labels: { singular: "Video Subtitle", plural: "Videos Subtitles" },
  admin: {
    useAsTitle: "filename",
    group: CollectionGroups.Media,
    disableDuplicate: true,
    hidden: shownOnlyToAdmin,
  },
  upload: {
    // mimeTypes: ["text/*"], Disable because of a bug on Chrome windows where the MIME is detected as application/octet-stream instead of text/vtt or text/plain
    disableLocalStorage: true,
  },
  timestamps: false,
  fields: [],
});
