import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { VideosChannel } from "../../../types/collections";

type StrapiVideoChannel = {
  uid: string;
  title: string;
  subscribers: number;
};

export const importFromStrapi = createStrapiImportEndpoint<VideosChannel, StrapiVideoChannel>({
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
