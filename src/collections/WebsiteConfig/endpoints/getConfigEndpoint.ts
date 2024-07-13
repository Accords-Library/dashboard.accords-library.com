import payload from "payload";
import { convertFolderToEndpointFolderPreview } from "src/collections/Folders/endpoints/getBySlugEndpoint";
import { Collections } from "src/shared/payload/constants";
import { EndpointWebsiteConfig } from "src/shared/payload/endpoint-types";
import { CollectionEndpoint } from "src/types/payload";
import { isImage, isPayloadType } from "src/utils/asserts";
import { convertImageToEndpointPayloadImage } from "src/utils/endpoints";

export const getConfigEndpoint: CollectionEndpoint = {
  method: "get",
  path: "/config",
  handler: async (req, res) => {
    if (!req.user) {
      return res.status(403).send({
        errors: [
          {
            message: "You are not allowed to perform this action.",
          },
        ],
      });
    }

    const {
      homeFolders,
      timeline,
      defaultOpenGraphImage,
      homeBackgroundImage,
      timelineBackgroundImage,
    } = await payload.findGlobal({
      slug: Collections.WebsiteConfig,
    });

    const events = (
      await payload.find({
        collection: Collections.ChronologyEvents,
        pagination: false,
        draft: false,
        where: {
          _status: {
            equals: "published",
          },
        },
      })
    ).docs;

    let eventCount = 0;
    events.forEach(({ events }) => {
      eventCount += events.length;
    });

    const endpointWebsiteConfig: EndpointWebsiteConfig = {
      home: {
        ...(isImage(homeBackgroundImage)
          ? { backgroundImage: convertImageToEndpointPayloadImage(homeBackgroundImage) }
          : {}),
        folders:
          homeFolders?.flatMap(({ folder, darkThumbnail, lightThumbnail }) => {
            if (!isPayloadType(folder)) return [];
            return {
              ...convertFolderToEndpointFolderPreview(folder),
              ...(isImage(darkThumbnail)
                ? { darkThumbnail: convertImageToEndpointPayloadImage(darkThumbnail) }
                : {}),
              ...(isImage(lightThumbnail)
                ? { lightThumbnail: convertImageToEndpointPayloadImage(lightThumbnail) }
                : {}),
            };
          }) ?? [],
      },
      timeline: {
        ...(isImage(timelineBackgroundImage)
          ? { backgroundImage: convertImageToEndpointPayloadImage(timelineBackgroundImage) }
          : {}),
        breaks: timeline?.breaks ?? [],
        eventCount,
        eras:
          timeline?.eras?.flatMap(({ endingYear, name, startingYear }) => {
            if (!isPayloadType(name)) return [];
            return {
              name: isPayloadType(name) ? name.name : name,
              startingYear,
              endingYear,
            };
          }) ?? [],
      },
      ...(isImage(defaultOpenGraphImage)
        ? { defaultOpenGraphImage: convertImageToEndpointPayloadImage(defaultOpenGraphImage) }
        : {}),
    };
    res.status(200).json(endpointWebsiteConfig);
  },
};
