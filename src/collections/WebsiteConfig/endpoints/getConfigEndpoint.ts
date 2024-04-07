import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointWebsiteConfig } from "../../../sdk";
import { CollectionEndpoint } from "../../../types/payload";
import { isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertFolderToEndpointFolder } from "../../Folders/endpoints/getBySlugEndpoint";

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

    const { homeFolders, timeline } = await payload.findGlobal({
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
      homeFolders:
        homeFolders?.flatMap(({ folder, darkThumbnail, lightThumbnail }) => {
          if (!isPayloadType(folder)) return [];
          return {
            ...convertFolderToEndpointFolder(folder),
            ...(isValidPayloadImage(darkThumbnail) ? { darkThumbnail } : {}),
            ...(isValidPayloadImage(lightThumbnail) ? { lightThumbnail } : {}),
          };
        }) ?? [],
      timeline: {
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
    };
    res.status(200).json(endpointWebsiteConfig);
  },
};
