import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointWebsiteConfig } from "../../../sdk";
import { CollectionEndpoint } from "../../../types/payload";
import { isImage, isPayloadType } from "../../../utils/asserts";
import { convertFolderToEndpointFolder } from "../../Folders/endpoints/getBySlugEndpoint";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";

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
          ? { backgroundImage: convertImageToEndpointImage(homeBackgroundImage) }
          : {}),
        folders:
          homeFolders?.flatMap(({ folder, darkThumbnail, lightThumbnail }) => {
            if (!isPayloadType(folder)) return [];
            return {
              ...convertFolderToEndpointFolder(folder),
              ...(isImage(darkThumbnail)
                ? { darkThumbnail: convertImageToEndpointImage(darkThumbnail) }
                : {}),
              ...(isImage(lightThumbnail)
                ? { lightThumbnail: convertImageToEndpointImage(lightThumbnail) }
                : {}),
            };
          }) ?? [],
      },
      timeline: {
        ...(isImage(timelineBackgroundImage)
          ? { backgroundImage: convertImageToEndpointImage(timelineBackgroundImage) }
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
        ? { defaultOpenGraphImage: convertImageToEndpointImage(defaultOpenGraphImage) }
        : {}),
    };
    res.status(200).json(endpointWebsiteConfig);
  },
};
