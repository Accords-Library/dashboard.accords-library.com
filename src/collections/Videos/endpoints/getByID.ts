import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointVideo, PayloadMedia } from "../../../sdk";
import { Video } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import {
  isDefined,
  isEmpty,
  isNotEmpty,
  isPayloadType,
  isUndefined,
  isValidPayloadImage,
  isValidPayloadMedia,
} from "../../../utils/asserts";
import {
  convertCreditsToEndpointCredits,
  convertRTCToEndpointRTC,
  convertTagsEndpointTagsGroups,
  getLanguageId,
} from "../../../utils/endpoints";

export const getByID: CollectionEndpoint = {
  method: "get",
  path: "/id/:id",
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

    if (!req.params.id) {
      return res.status(400).send({ errors: [{ message: "Missing 'id' query params" }] });
    }

    try {
      const result = await payload.findByID({
        collection: Collections.Videos,
        id: req.params.id,
      });

      if (!isValidPayloadMedia(result)) {
        return res.sendStatus(404);
      }

      return res.status(200).json(convertVideoToEndpointVideo(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};

export const convertVideoToEndpointVideo = ({
  url,
  tags,
  translations,
  mimeType,
  createdAt,
  updatedAt,
  filename,
  filesize,
  duration,
  id,
  thumbnail,
  platform,
  platformEnabled,
  credits,
}: Video & PayloadMedia): EndpointVideo => ({
  url,
  tagGroups: convertTagsEndpointTagsGroups(tags),
  createdAt,
  filename,
  filesize,
  id,
  mimeType,
  updatedAt,
  translations:
    translations?.map(({ language, title, pretitle, subtitle, description }) => ({
      language: getLanguageId(language),
      ...(isNotEmpty(pretitle) ? { pretitle } : {}),
      title,
      ...(isNotEmpty(subtitle) ? { subtitle } : {}),
      ...(isNotEmpty(description) ? { description: convertRTCToEndpointRTC(description) } : {}),
    })) ?? [],

  duration,
  ...(isValidPayloadImage(thumbnail) ? { thumbnail } : {}),
  ...(platformEnabled && isDefined(platform) && isPayloadType(platform.channel)
    ? {
        platform: {
          channel: platform.channel,
          publishedDate: platform.publishedDate,
          url: platform.url,
        },
      }
    : {}),
  subtitles:
    translations.flatMap(({ language, subfile }) => {
      if (
        isUndefined(subfile) ||
        !isPayloadType(subfile) ||
        isUndefined(subfile.url) ||
        isEmpty(subfile.url)
      )
        return [];
      return { language: getLanguageId(language), url: subfile.url };
    }) ?? [],
  credits: convertCreditsToEndpointCredits(credits),
});
