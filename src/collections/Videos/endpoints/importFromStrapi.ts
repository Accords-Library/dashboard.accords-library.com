import payload from "payload";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Video, VideosChannel } from "../../../types/collections";
import { PayloadCreateData } from "../../../types/payload";
import { isUndefined } from "../../../utils/asserts";

type StapiVideo = {
  uid: string;
  title: string;
  description: string;
  published_date: {
    year?: number;
    month?: number;
    day?: number;
  };
  views: number;
  likes: number;
  source?: "YouTube" | "NicoNico" | "Tumblr";
  gone: boolean;
  channel: { data?: { attributes: { uid: string; title: string; subscribers: number } } };
};

export const importFromStrapi = createStrapiImportEndpoint<Video, StapiVideo>({
  strapi: {
    collection: "videos",
    params: { populate: "published_date,channel" },
  },
  payload: {
    collection: Collections.Videos,
    import: async (
      {
        uid,
        title,
        description,
        views,
        likes,
        gone,
        source,
        published_date: { year, month, day },
        channel,
      },
      user
    ) => {
      if (isUndefined(source)) throw new Error("A source is required to create a Video");
      if (isUndefined(channel.data)) throw new Error("A channel is required to create a Video");

      try {
        const videoChannel: PayloadCreateData<VideosChannel> = {
          uid: channel.data.attributes.uid,
          title: channel.data.attributes.title,
          subscribers: channel.data.attributes.subscribers,
        };
        await payload.create({
          collection: Collections.VideosChannels,
          data: videoChannel,
          user,
        });
      } catch (e) {}

      const result = await payload.find({
        collection: Collections.VideosChannels,
        where: { uid: { equals: channel.data.attributes.uid } },
      });

      if (result.docs.length === 0) {
        throw new Error("A video channel is required to create a video");
      }

      const videoChannel = result.docs[0] as VideosChannel;
      const video: PayloadCreateData<Video> = {
        uid,
        title,
        description,
        views,
        likes,
        gone,
        source,
        publishedDate: `${year}-${month}-${day}`,
        channel: videoChannel.id,
      };

      await payload.create({
        collection: Collections.Videos,
        data: video,
        user,
      });
    },
  },
});
