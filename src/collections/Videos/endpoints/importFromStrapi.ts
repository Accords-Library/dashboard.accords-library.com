import payload from "payload";
import { Collections, VideoSources } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Video, VideosChannel } from "../../../types/collections";
import { PayloadCreateData } from "../../../types/payload";
import { isDefined, isUndefined } from "../../../utils/asserts";

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
  source?: VideoSources;
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
      if (source === VideoSources.YouTube && isUndefined(channel.data))
        throw new Error("A channel is required to create a YouTube Video");

      let videoChannelId;
      if (isDefined(channel.data)) {
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

        if (result.docs.length > 0) {
          videoChannelId = result.docs[0].id;
        }
      }

      const video: PayloadCreateData<Video> = {
        uid,
        title,
        description,
        views,
        likes,
        gone,
        source,
        publishedDate: `${year}-${month}-${day}`,
        channel: videoChannelId,
      };

      await payload.create({
        collection: Collections.Videos,
        data: video,
        user,
      });
    },
  },
});
