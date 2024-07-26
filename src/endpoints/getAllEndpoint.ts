import payload from "payload";
import { Endpoint } from "payload/config";
import { Collections } from "../shared/payload/constants";
import { EndpointChange } from "../shared/payload/webhooks";
import {
  getEndpointChangesForAudio,
  getEndpointChangesForChronologyEvent,
  getEndpointChangesForCollectible,
  getEndpointChangesForCurrency,
  getEndpointChangesForFile,
  getEndpointChangesForFolder,
  getEndpointChangesForImage,
  getEndpointChangesForLanguage,
  getEndpointChangesForPage,
  getEndpointChangesForRecorder,
  getEndpointChangesForVideo,
  getEndpointChangesForWebsiteConfig,
  getEndpointChangesForWording,
} from "../hooks/afterOperationSendChangesWebhook";
import { uniqueBy } from "../utils/array";

export const getAllEndpoint: Endpoint = {
  method: "get",
  path: "/all",
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

    const collectibles = await payload.find({
      collection: Collections.Collectibles,
      depth: 0,
      pagination: false,
      user: req.user,
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    const pages = await payload.find({
      collection: Collections.Pages,
      depth: 0,
      pagination: false,
      user: req.user,
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    const folders = await payload.find({
      collection: Collections.Folders,
      depth: 0,
      pagination: false,
      user: req.user,
    });

    const videos = await payload.find({
      collection: Collections.Videos,
      depth: 0,
      pagination: false,
      user: req.user,
    });

    const audios = await payload.find({
      collection: Collections.Audios,
      depth: 0,
      pagination: false,
      user: req.user,
    });

    const images = await payload.find({
      collection: Collections.Images,
      depth: 0,
      pagination: false,
      user: req.user,
    });

    const files = await payload.find({
      collection: Collections.Files,
      depth: 0,
      pagination: false,
      user: req.user,
    });

    const recorders = await payload.find({
      collection: Collections.Recorders,
      depth: 0,
      pagination: false,
      user: req.user,
    });

    const chronologyEvents = await payload.find({
      collection: Collections.ChronologyEvents,
      depth: 0,
      pagination: false,
      user: req.user,
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    const result: EndpointChange[] = [
      ...getEndpointChangesForWebsiteConfig(),
      ...getEndpointChangesForLanguage(),
      ...getEndpointChangesForCurrency(),
      ...getEndpointChangesForWording(),
      ...folders.docs.flatMap(getEndpointChangesForFolder),
      ...pages.docs.flatMap(getEndpointChangesForPage),
      ...collectibles.docs.flatMap(getEndpointChangesForCollectible),
      ...audios.docs.flatMap(getEndpointChangesForAudio),
      ...images.docs.flatMap(getEndpointChangesForImage),
      ...videos.docs.flatMap(getEndpointChangesForVideo),
      ...files.docs.flatMap(getEndpointChangesForFile),
      ...recorders.docs.flatMap(getEndpointChangesForRecorder),
      ...chronologyEvents.docs.flatMap(getEndpointChangesForChronologyEvent),
    ];

    return res.status(200).send(uniqueBy(result, ({ url }) => url));
  },
};
