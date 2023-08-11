import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { VideosChannel } from "../../../types/collections";

export const importFromStrapi = createStrapiImportEndpoint<VideosChannel>({
  strapi: {
    collection: "video-channels",
    params: {},
  },
  payload: {
    collection: Collections.VideosChannels,
    convert: ({ uid, title, subscribers }) => ({
      uid,
      title,
      subscribers,
    }),
  },
});
