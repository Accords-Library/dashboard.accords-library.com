import payload from "payload";
import { Endpoint } from "payload/config";
import { Collections } from "../constants";
import { EndpointAllSDKUrls, getSDKEndpoint } from "../sdk";
import { Collectible } from "../types/collections";

export const getAllSDKUrlsEndpoint: Endpoint = {
  method: "get",
  path: "/all-sdk-urls",
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

    const urls = new Set([
      getSDKEndpoint.getConfigEndpoint(),
      getSDKEndpoint.getLanguagesEndpoint(),
      getSDKEndpoint.getCurrenciesEndpoint(),
      getSDKEndpoint.getWordingsEndpoint(),

      ...folders.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Folders, doc)),
      ...pages.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Pages, doc)),
      ...chronologyEvents.docs.flatMap((doc) =>
        getSDKUrlsForDocument(Collections.ChronologyEvents, doc)
      ),
      ...videos.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Videos, doc)),
      ...audios.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Audios, doc)),
      ...images.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Images, doc)),
      ...files.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Files, doc)),
      ...collectibles.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Collectibles, doc)),
      ...recorders.docs.flatMap((doc) => getSDKUrlsForDocument(Collections.Recorders, doc)),
    ]);

    const result: EndpointAllSDKUrls = {
      urls: [...urls],
    };

    return res.status(200).send(result);
  },
};

export const getSDKUrlsForDocument = (collection: Collections, doc: any): string[] => {
  switch (collection) {
    case Collections.WebsiteConfig:
      return [getSDKEndpoint.getConfigEndpoint()];

    case Collections.Folders:
      return [getSDKEndpoint.getFolderEndpoint(doc.slug)];

    case Collections.Languages:
      return [getSDKEndpoint.getLanguagesEndpoint()];

    case Collections.Currencies:
      return [getSDKEndpoint.getCurrenciesEndpoint()];

    case Collections.Wordings:
      return [getSDKEndpoint.getWordingsEndpoint()];

    case Collections.Pages:
      return [getSDKEndpoint.getPageEndpoint(doc.slug)];

    case Collections.Collectibles: {
      const { slug, gallery, scans, scansEnabled } = doc as Collectible;
      const urls: string[] = [getSDKEndpoint.getCollectibleEndpoint(slug)];
      if (gallery && gallery.length > 0) {
        urls.push(getSDKEndpoint.getCollectibleGalleryEndpoint(slug));
        urls.push(
          ...gallery.map((_, index) =>
            getSDKEndpoint.getCollectibleGalleryImageEndpoint(slug, index.toString())
          )
        );
      }
      if (scans && scansEnabled) {
        urls.push(getSDKEndpoint.getCollectibleScansEndpoint(slug));
        // TODO: Add other pages for cover, obi, dustjacket...
        if (scans.pages) {
          urls.push(
            ...scans.pages.map(({ page }) =>
              getSDKEndpoint.getCollectibleScanPageEndpoint(slug, page.toString())
            )
          );
        }
      }
      return urls;
    }

    case Collections.ChronologyEvents:
      return [
        getSDKEndpoint.getChronologyEventsEndpoint(),
        getSDKEndpoint.getChronologyEventByIDEndpoint(doc.id),
      ];

    case Collections.Images:
      return [getSDKEndpoint.getImageByIDEndpoint(doc.id)];

    case Collections.Audios:
      return [getSDKEndpoint.getAudioByIDEndpoint(doc.id)];

    case Collections.Videos:
      return [getSDKEndpoint.getVideoByIDEndpoint(doc.id)];

    case Collections.Recorders:
      return [getSDKEndpoint.getRecorderByIDEndpoint(doc.id)];

    case Collections.Files:
      return [getSDKEndpoint.getFileByIDEndpoint(doc.id)];

    case Collections.Attributes:
    case Collections.CreditsRole:
    case Collections.GenericContents:
    case Collections.MediaThumbnails:
    case Collections.Scans:
    case Collections.Tags:
    case Collections.VideosChannels:
    case Collections.VideosSubtitles:
      return [];

    default: {
      console.warn("Unrecognized collection", collection);
      return [];
    }
  }
};
