import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointVideo, EndpointVideoPreview, PayloadMedia } from "../../../sdk";
import { Video } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import {
  isDefined,
  isEmpty,
  isMediaThumbnail,
  isNotEmpty,
  isPayloadType,
  isUndefined,
  isVideo,
} from "../../../utils/asserts";
import {
  convertAttributesToEndpointAttributes,
  convertCreditsToEndpointCredits,
  convertMediaThumbnailToEndpointPayloadImage,
  convertRTCToEndpointRTC,
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

      if (!isVideo(result)) {
        return res.sendStatus(404);
      }

      return res.status(200).json(convertVideoToEndpointVideo(result));
    } catch {
      return res.sendStatus(404);
    }
  },
};

export const convertVideoToEndpointVideoPreview = ({
  url,
  attributes,
  translations,
  mimeType,
  filename,
  duration,
  id,
  thumbnail,
}: Video & PayloadMedia): EndpointVideoPreview => ({
  id,
  url,
  filename,
  mimeType,
  attributes: convertAttributesToEndpointAttributes(attributes),
  translations:
    translations?.map(({ language, title, pretitle, subtitle }) => ({
      language: getLanguageId(language),
      ...(isNotEmpty(pretitle) ? { pretitle } : {}),
      title,
      ...(isNotEmpty(subtitle) ? { subtitle } : {}),
    })) ?? [],
  duration,
  ...(isMediaThumbnail(thumbnail)
    ? { thumbnail: convertMediaThumbnailToEndpointPayloadImage(thumbnail) }
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
});

const convertVideoToEndpointVideo = (video: Video & PayloadMedia): EndpointVideo => {
  const { translations, createdAt, updatedAt, filesize, platform, platformEnabled, credits } =
    video;

  return {
    ...convertVideoToEndpointVideoPreview(video),
    createdAt,
    filesize,
    updatedAt,
    translations:
      translations?.map(({ language, title, pretitle, subtitle, description }) => ({
        language: getLanguageId(language),
        ...(isNotEmpty(pretitle) ? { pretitle } : {}),
        title,
        ...(isNotEmpty(subtitle) ? { subtitle } : {}),
        ...(isNotEmpty(description) ? { description: convertRTCToEndpointRTC(description) } : {}),
      })) ?? [],
    ...(platformEnabled && isDefined(platform) && isPayloadType(platform.channel)
      ? {
          platform: {
            channel: platform.channel,
            publishedDate: platform.publishedDate,
            url: platform.url,
          },
        }
      : {}),
    credits: convertCreditsToEndpointCredits(credits),
  };
};
