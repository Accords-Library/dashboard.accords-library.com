import payload from "payload";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Video, VideosChannel } from "../../../types/collections";
import { PayloadCreateData } from "../../../utils/types";

export const importFromStrapi = createStrapiImportEndpoint<Video>({
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
