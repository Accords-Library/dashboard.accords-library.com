import payload from "payload";
import { Endpoint } from "payload/config";
import { Collections } from "../constants";
import { EndpointAllPaths } from "../sdk";

export const getAllPathsEndpoint: Endpoint = {
  method: "get",
  path: "/all-paths",
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

    const result: EndpointAllPaths = {
      collectibles: collectibles.docs.map(({ slug }) => slug),
      pages: pages.docs.map(({ slug }) => slug),
      folders: folders.docs.map(({ slug }) => slug),
      videos: videos.docs.map(({ id }) => id),
      audios: audios.docs.map(({ id }) => id),
      images: images.docs.map(({ id }) => id),
      recorders: recorders.docs.map(({ id }) => id),
      chronologyEvents: chronologyEvents.docs.map(({ id }) => id),
    };

    return res.status(200).send(result);
  },
};
